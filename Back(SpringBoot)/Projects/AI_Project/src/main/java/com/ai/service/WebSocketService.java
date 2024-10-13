package com.ai.service;

import java.io.IOException;

import java.math.RoundingMode;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.ai.config.WebSocketConfig;
import com.ai.domain.Log;
import com.ai.domain.RiskPrediction;
import com.ai.domain.SensorData;

import com.ai.repository.LogRepository;
import com.ai.repository.RiskPredictionRepository;
import com.ai.repository.SensorDataRepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ai.dto.FlaskRequestDTO;
import com.ai.dto.FlaskResponseDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WebSocketService {
	
	private final LogRepository logRepo;
	private final RiskPredictionRepository riskRepo;
	private final SensorDataRepository sensorRepo;
	
	private int no = 1;
	private final WebSocketConfig wsConfig;
	private final WebClient webClient = WebClient.create();
	
	// 
	@Scheduled(fixedRate = 20)
	public void pushData() throws IOException {
		// DB의 user_vital_sign 테이블에서 no를 1씩 증가시키며 해당 행 조회 후 vitalSign 인스턴스에 저장
		System.out.println("no: " + no);

		// (최종)Vital Gyro 통합 테이블
		SensorData sd = sensorRepo.findById(no).orElse(null);
		
		if(sd == null) {
			return; // DB 데이터가 더이상 조회 안되면 종료
		}
		FlaskRequestDTO fqDTO = getFqDTO(sd);

		// Flask 요청(fqDTO) 전송 후 응답 frDTO로 변환
		sendData(fqDTO);
		// sensor_data 순회
		no++;
	}
	
	// Flask에 요청 데이터 전송 후 응답 데이터 프론트에 전송
	private void sendData(FlaskRequestDTO fqDTO) {
		sendDataToFlaskAsync(fqDTO).thenAccept(rp -> {
			 if (rp != null && rp.getUserCode() != null) {
				 
				FlaskResponseDTO frDTO = getFrDTO(rp);
				// 기록된 최근 위험 예측 데이터를 ld에 저장
				Log ld = logRepo.findByLastNo().orElse(null);
				
				System.out.println(frDTO);
				// 저장 프로시저 메서드
				setStoreProcedure(frDTO);

				// 초기에 logRepo에는 값이 없으니까 null과 응답을 비교할수없으니까 바로 프론트로 전송
				if (ld == null) {
					sendPushMessage(frDTO);
				} else {
					// 응답과 최근 기록 비교 후 Front에 push
					compareAndPush(frDTO, ld);
				}
			 }				
		}).exceptionally(ex -> {
			System.err.println("에러 발생: " + ex.getMessage());
			return null;
		});
	}
	
	
	// risk_prediction 저장 프로시저 메서드
	private void setStoreProcedure(FlaskResponseDTO frDTO) {
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
	
	// 프론트에 전송할 응답 데이터 log 테이블 마지막 데이터와 비교 후 다르면 sendPushMessage
	private void compareAndPush(FlaskResponseDTO rp, Log ld) {
		final double EPSILON = 1e-6; // 허용 오차 (예: 0.000001)
		if (!rp.getWorkDate().isEqual(ld.getWorkDate())
		        || rp.getHeartbeat() != ld.getHeartbeat()
		        || Math.abs(rp.getLatitude() - ld.getLatitude()) > EPSILON
		        || Math.abs(rp.getLongitude() - ld.getLongitude()) > EPSILON
		        || rp.getTemperature().setScale(1, RoundingMode.HALF_UP).compareTo(ld.getTemperature().setScale(1, RoundingMode.HALF_UP)) != 0
		        || rp.getOutsideTemperature().setScale(1, RoundingMode.HALF_UP).compareTo(ld.getOutsideTemperature().setScale(1, RoundingMode.HALF_UP)) != 0
		        || !rp.getUserCode().equals(ld.getUser().getUserCode())
		        || !rp.getActivity().equals(ld.getActivity())) {
		    sendPushMessage(rp);
		}
	}
	
	// Flask와 API 연결
	private CompletableFuture<RiskPrediction> sendDataToFlaskAsync(FlaskRequestDTO fqDTO) {
		return webClient.post() // POST 요청 준비
				.uri("http://192.168.45.203:8000/api/data/") // 요청 보낼 flask 서버
				.bodyValue(fqDTO) // Flask 서버에 보낼 데이터
				.retrieve() // 응답을 받아오는 메서드
				.bodyToMono(RiskPrediction.class) // 응답 받은 객체를 RiskPrediction 객체로 변환
				.toFuture(); // CompletableFutuer로 변환
	}
	
	
	// FE에게 정보 전송 메소드 
	public void sendPushMessage(Object frDTO) {
		Set<WebSocketSession> clients = wsConfig.getClients();
		// 연결된 클라이언트가 없으면 그냥 리턴
	    if (clients.size() == 0) {
	    	System.out.println("클라이언트 연결이 없습니다.");
	    	return;
	    }	
	    // 자바 객체를 JSON 문자열로 변환
	    // PushDTO 객체를 JSON으로 변환
	    ObjectMapper objectMapper = new ObjectMapper();
	    String msg = null;
	    FlaskResponseDTO frontData = null;

		try { 
			frontData = (FlaskResponseDTO) frDTO;
			msg = objectMapper.writeValueAsString(frDTO);
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
				if (frontData != null) {
					if (userCode.equals("0") || userCode.equals("00") || userCode.equals(frontData.getUserCode())) {
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
