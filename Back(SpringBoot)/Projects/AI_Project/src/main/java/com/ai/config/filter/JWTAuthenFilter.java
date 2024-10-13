package com.ai.config.filter;

import java.io.IOException;
import java.util.Date;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// 사용자 인증 요청을 처리하고 사용자가 제공한 자격증명(아이디, 비밀번호)으로 인증을 시도
@Slf4j
@RequiredArgsConstructor
public class JWTAuthenFilter extends UsernamePasswordAuthenticationFilter{
	
	// 인증 객체: 인증 요청 응답 처리
	private final AuthenticationManager am; 
	// AuthenticationManager의 인증 처리 과정에서 UsernamePasswordAuthenticationFilter로 
	// 인증 성공시에 successfulAuthentication 메서드가 호출
	// Override(재정의)한 하단에 successfulAuthentication 메서드가 호출
	
	// POST/login 요청 왔을 때 인증을 시도하는 메서드
	@Override
	// HttpServletRequest: 요청, HttpServletResponse: 응답(해당 객체를 기반으로 인증 응답 처리 시도)
	// attemptAuthentication (인증처리)
	public Authentication attemptAuthentication(HttpServletRequest request,
									HttpServletResponse response) throws AuthenticationException {	// AuthenticationException: 인증 예외 발생 처리
		// request에서 json 타입의 [inputId/inputPassword]를 읽어서 User 객체를 생성
		ObjectMapper mapper = new ObjectMapper();
		// ObjectMapper: JSON 데이터를 Java 객체로 변환
		try { // 요청 데이터를 JSON으로 읽어 Mapper(Java 객체)로 변환하고 user 객체에 저장
			com.ai.domain.User user = mapper.readValue(request.getInputStream(), com.ai.domain.User.class);	
			// UsernamePasswordAuthenticationToken:토큰에 자격증명(ID,PW)를 포함해서 토큰생성
			Authentication authToken = new UsernamePasswordAuthenticationToken(user.getUserId(), user.getPassword());
			
			return am.authenticate(authToken); 
			// authenticationManager.authenticate: 인증 시도 후 자격증명의 정보를 검증 후,
			// 인증 성공 시 토큰 반환(successfulAuthentication으로)  
		} catch (Exception e) {
			log.info(e.getMessage()); // 인증과정 예외발생(비밀번호 불일치, 사용자 없음)
			// 로그를 남기고 클라이언트에게 401 Unauthorized 반환
		}
		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		// 자격증명 실패시 401 Unauthorized 설정
		return null; // 인증 실패시 null 반환 (인증 실패)
	}
	
	
	// successfulAuthentication(인증 성공 처리): 성공 응답을 클라이언트에게 전송
	@Override // authResult: attemptAuthenticatin의 인증 성공시 반환된 값
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
				FilterChain chain, Authentication authResult) throws IOException, ServletException {
	// FilterChain: 요청들을 다음 필터들로 전달하는 용도의 객체
		User user = (User)authResult.getPrincipal(); // 해당 User 클래스는 스프링시큐리티 내장 객체 User이다
		// authResult.getPrincipal: 인증 성공된 유저의 정보를 가져옴
		// User로 캐스팅해서 user에 저장
		
		String token = JWT.create() // 새로운 JWT 토큰 생성
				.withExpiresAt(new Date(System.currentTimeMillis()+1000*60*1000)) // 토큰만료시간설정(10분)
				.withClaim("userId", user.getUsername()) // 클레임에 유저 아이디 추가(User 내장객체의 함수(username=아이디)
				.sign(Algorithm.HMAC256("com.ai.project")); // 서명
		response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
		// 토큰을 응답헤더에 추가
		response.setStatus(HttpStatus.OK.value());
		// 응답으로 인증 성공했음을 클라이언트 화면에 출력
	}
	
}

// Authentication(인증): 사용자의 자격증명을 확인하는 과정
// 인증이 성공하면 토큰을 클라이언트에게 제공