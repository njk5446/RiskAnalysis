package com.ai.service;

import java.io.IOException;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.ai.config.WebSocketConfig;

import com.ai.domain.LastNo;
import com.ai.domain.RiskPrediction;
import com.ai.domain.Role;
import com.ai.domain.SensorData;
import com.ai.repository.LastNoRepository;
import com.ai.repository.LogRepository;
import com.ai.repository.CurrentWorkDateRepository;
import com.ai.repository.RiskPredictionRepository;
import com.ai.repository.SensorDataRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import com.ai.dto.FlaskRequestDTO;
import com.ai.dto.FlaskResponseDTO;
import com.ai.projection.LogResponseProjection;
import com.ai.projection.SensorWorkDateProjection;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WebSocketService {
	
	private final LogRepository logRepo;
	private final RiskPredictionRepository riskRepo;
	private final SensorDataRepository sensorRepo;
	private final LastNoRepository lastNoRepo;
	private final CurrentWorkDateRepository recentRepo;
	
	private int no;
	private final WebSocketConfig wsConfig;
	private final WebClient webClient = WebClient.create();
	
	// Flask Server 통신 url
	@Value("${flask.server.url}")
	private String flaskServerUrl;
	
	// 위험 분석 응답 데이터 전송
	@Scheduled(fixedRate = 1000000000)
	public void pushData() throws IOException {
		// DB의 user_vital_sign 테이블에서 no를 1씩 증가시키며 해당 행 조회 후 vitalSign 인스턴스에 저장
		// 현재 lastNo값 추출
		// (최종)Vital Gyro 통합 테이블
		SensorData sd = sensorRepo.findById(no).orElse(null);
		setCurrentStoreProcedure(sd);
		
		if(sd == null) {
			return; // DB 데이터가 더이상 조회 안되면 종료
		}
		
		System.out.println("no: " + sd.getNo());
		FlaskRequestDTO fqDTO = getFqDTO(sd);

		// Flask 요청(fqDTO) 전송 후 응답 frDTO로 변환
		sendData(fqDTO);
		// sensor_data 순회
		no++;
	}
	
	@PostConstruct // 서버 시작 시 마지막 저장된 no를 불러옴
	public void init() {
		System.out.println("서버 실행");
	    LastNo lastNoEntity = lastNoRepo.findById(1).orElse(null);
	    
	    if (lastNoEntity == null) {
	        // 엔티티가 없으면 기본값 1로 새로 생성하여 저장
	        lastNoEntity = new LastNo(1, 1);
	        lastNoRepo.save(lastNoEntity);
	        no = 1; // 기본값으로 설정
	    } else {
	        no = lastNoEntity.getLastNo(); // 기존 값 가져오기
	    }
	}
	
	@PreDestroy // 서버 종료 직전은 읽은 행을 db에 저장
	public void shutdown() {
		System.out.println("서버 종료 중...");
		try {
			updateLastNo(no); // 서버 종료 시 마지막으로 읽은 lastNo를 업데이트
			System.out.println("종료 완료");
		} catch (Exception e) {
			System.out.println("종료 중 오류 발생: " + e.getMessage());
		}
	}
	
	// 서버 종료 직전 마지막 행을 저장
	private void updateLastNo(int lastNo) {
		lastNoRepo.updateLastNo(lastNo);
	}
	
	// Flask에 요청 데이터 전송 후 응답 데이터 프론트에 전송
	private void sendData(FlaskRequestDTO fqDTO) {
		sendDataToFlaskAsync(fqDTO).thenAccept(rp -> {
			 if (rp != null && rp.getUserCode() != null) {
				 
				FlaskResponseDTO frDTO = getFrDTO(rp);
				// 기록된 최근 위험 예측 데이터를 ld에 저장
				
				// 저장 프로시저 메서드
				setRiskStoreProcedure(frDTO);

				LogResponseProjection ld = logRepo.findByLastNo().orElse(null);
				
				if (ld == null) {
					sendPushMessage(frDTO);
				} else {
					sendPushMessage(ld);
				}
			 }				
		}).exceptionally(ex -> {
			System.err.println("에러 발생: " + ex.getMessage());
			return null;
		});
	}
	
	// 현재 행의 workDate 가져오기 
	private void setCurrentStoreProcedure(SensorData sd) {
		SensorWorkDateProjection swp = sensorRepo.findWorkDateById(sd.getNo());
		LocalDate workDate = swp.getWorkDate();
		recentRepo.updateCurrentWorkDate(workDate);
	}
	
	// risk_prediction 저장 프로시저 메서드
	private void setRiskStoreProcedure(FlaskResponseDTO frDTO) {
		riskRepo.upsertRiskPrediction(frDTO.getUserCode(), frDTO.getWorkDate(), 
				frDTO.getRiskFlag(), frDTO.getHeartbeat(),frDTO.getTemperature(), frDTO.getOutsideTemperature(), 
				frDTO.getLatitude(), frDTO.getLongitude(), frDTO.getActivity(), frDTO.getVitalDate());
	}
	
	// Flask에 요청할 데이터 DTO 생성
	private FlaskRequestDTO getFqDTO(SensorData sd) {
		FlaskRequestDTO fqDTO = FlaskRequestDTO.builder()
				.userCode(sd.getUserCode())
				.workDate(sd.getWorkDate())
				.gyroData(new float[] {sd.getX(), sd.getY(), sd.getZ()})
				.heartbeat(sd.getHeartbeat())
				.temperature(sd.getTemperature())
				.outsideTemperature(sd.getOutsideTemperature())
				.vitalDate(sd.getVitalDate())
				.longitude(sd.getLongitude())
				.latitude(sd.getLatitude())
				.build();
		return fqDTO;
	}
	
	// Flask 응답 DTO 생성 메서드
	private FlaskResponseDTO getFrDTO(RiskPrediction rp) {
		FlaskResponseDTO frDTO = FlaskResponseDTO.builder()
				.userCode(rp.getUserCode())
				.workDate(rp.getWorkDate())
				.riskFlag(rp.getRiskFlag())
				.heartbeat(rp.getHeartbeat())
				.temperature(rp.getTemperature())
				.outsideTemperature(rp.getOutsideTemperature())
				.vitalDate(rp.getVitalDate())
				.longitude(rp.getLongitude())
				.latitude(rp.getLatitude())
				.activity(rp.getActivity())
				.build();
		return frDTO;
	}
	
	// Flask와 API 연결
	private CompletableFuture<RiskPrediction> sendDataToFlaskAsync(FlaskRequestDTO fqDTO) {
		return webClient.post() // POST 요청 준비
				.uri(flaskServerUrl) // 요청 보낼 flask 서버
				.bodyValue(fqDTO) // Flask 서버에 보낼 데이터
				.retrieve() // 응답을 받아오는 메서드
				.bodyToMono(RiskPrediction.class) // 응답 받은 객체를 RiskPrediction 객체로 변환
				.toFuture(); // CompletableFutuer로 변환
	}
	
	
	// FE에게 정보 전송 메소드 
	public void sendPushMessage(Object ld) {
		Set<WebSocketSession> clients = wsConfig.getClients();
		// 연결된 클라이언트가 없으면 그냥 리턴
	    if (clients.size() == 0) {
	    	return;
	    }	
	    // 자바 객체를 JSON 문자열로 변환
	    // PushDTO 객체를 JSON으로 변환
	    ObjectMapper objectMapper = new ObjectMapper();
	    String msg = null;
	    LogResponseProjection logData = null;

		try { 
			logData = (LogResponseProjection) ld;
			msg = objectMapper.writeValueAsString(ld);
		} catch (JsonProcessingException e) {
			System.out.println("JSON Error:" + e.getMessage());
			return;
		}
		
		// FE에 전송할 JSON 메시지객체 생성
		// TextMessage는 WebSocket을 통해 클라이언트에게 전송할 수 있는 메시지 포맷
		TextMessage message = new TextMessage(msg);
		
		// 블럭안에 코드를 수행하는 동안 map 객체에 대한 다른 스레드의 접근을 방지한다.
		synchronized (clients) { // 연결된 모든 세션을 담은 컬렉션
			// 연결된 모든 세션을 WebsockSession 객체에 반복문으로 저장
			// 메시지 전송
			for (WebSocketSession sess : clients) {
				Map<String, Object> map = sess.getAttributes();
				String userCode = (String) map.get("userCode");
				Role role = (Role) map.get("role");
				if (logData != null) {
					if (Role.ROLE_ADMIN.equals(role) || userCode.equals(logData.getUserCode())) {
						sendMessageToClient(sess, message, userCode, msg);
					} 
				} 
			}
			
	    }
	}
	
	// 클라이언트 데이터 전송 메서드
	private void sendMessageToClient(WebSocketSession sess, TextMessage message, String userCode, String msg) {
	    try {
	        System.out.println(userCode + ", " + msg);
	        sess.sendMessage(message);
	    } catch (IOException e) {
	        System.out.println(sess.getRemoteAddress() + ": " + e.getMessage());
	    }
	}
		
	
}
