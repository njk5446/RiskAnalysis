package com.ai.config;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.ai.domain.User;
import com.ai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomHandshakeInterceptor implements HandshakeInterceptor{
	
	private final UserRepository userRepo;
	
	@Override 
	public boolean beforeHandshake(
        ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Map<String, Object> attributes) throws Exception {

	 	// 요청 url의 id 추출(ws://localhost:8080/pushservice?userId=u1)
	  	// substring(7): ?userId="아이디" 0~6번째까지 건너뛰고 7번째인 아이디부터 추출
		String userId = request.getURI().getQuery().substring(7);
		Optional<User> user = userRepo.findByUserId(userId); // DB에 해당 사용자가 존재하는지 확인
		 
		// 사용자가 존재하면 세션에 userCode와 role 저장
		if (user.isPresent()) {
	    	   attributes.put("userCode", user.get().getUserCode());
	    	   attributes.put("role", user.get().getRole());
	    	   return true;
	       } else {
	    	   return false;
	       }
	    }

	@Override
	public void afterHandshake(ServerHttpRequest req, ServerHttpResponse res, WebSocketHandler wsHandler, Exception e) {
		// TODO Auto-generated method stub
		
	}	
}

// 핸드셰이크 과정은 WebSocket 연결이 이루어지기 전에 인증을 처리하고 연결 속성(세션 정보)을 설정
