package com.ai.config;

import java.util.Collections;
import java.util.HashSet;

import java.util.Set;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;


import lombok.RequiredArgsConstructor;


// WebSocket 연결을 설정
@Configuration
@EnableWebSocket	// Boot WebSocket 활성화
@RequiredArgsConstructor
public class WebSocketConfig extends TextWebSocketHandler implements WebSocketConfigurer  {

	// 연결된 클라이언트들을 저장하는 Set
	private static Set<WebSocketSession> clients = Collections.synchronizedSet(new HashSet<WebSocketSession>());

	private final CustomHandshakeInterceptor customInter;

	// WebSocket 연결명 설정 (ws://localhost:8080/pushservice) ==> WebSocketConfigurer
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(this, "/pushservice") // 엔드포인트 /pushservice로 지정
				.setAllowedOrigins("*") // 모든 컴퓨터에서 접근 가능
				.addInterceptors(customInter); // 핸드셰이크로 세션 속성키 설정
	}
	
	
	// Client가 접속 시 호출되는 메서드
	@Override 
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		clients.add(session); // Set에 해당 session 저장
	    System.out.println(session + " 클라이언트 접속");    
	}
	
	// Client가 접속 해제 시 호출되는 메서드
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println(session + " 클라이언트 접속 해제");
		clients.remove(session);
	}		

	// Client에서 메시지가 왔을 때 호출되는 메서드 -> 채팅과 같은 형태의 기능을 추가하지 않는다면 필요없는 메소드이다.
	@Override // 클라이언트가 보낸 메시지를 처리하는 용도
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println("Message : " + message.getPayload());
	}
	
	// 현재 접속한 세션의 클라이언트 불러오기 (Service단에서 사용)
    public Set<WebSocketSession> getClients() {
        return clients;
    }
}