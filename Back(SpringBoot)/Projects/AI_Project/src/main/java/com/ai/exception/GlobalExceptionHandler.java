package com.ai.exception;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.auth0.jwt.exceptions.TokenExpiredException;


@ControllerAdvice // 사용자 정의 전역 예외처리 
public class GlobalExceptionHandler extends Exception{
	
	// 직렬화된 데이터와 클래스 정의 간의 호환성 유지
	private static final long serialVersionUID = 1L; 
	
	@ExceptionHandler
	public ResponseEntity<String> handleNoSuchElementException(NoSuchElementException ex) {
		return new ResponseEntity<>("요청값을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(TokenExpiredException.class)
	public ResponseEntity<String> handleTokenExpiredException(TokenExpiredException ex) {
		return new ResponseEntity<>("토큰이 만료되었습니다.", HttpStatus.UNAUTHORIZED); // 인증 실패
	}
}
