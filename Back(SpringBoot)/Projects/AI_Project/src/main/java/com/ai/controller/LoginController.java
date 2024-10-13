package com.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ai.domain.User;
import com.ai.service.LoginService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class LoginController {
	
	private final LoginService ls;
	

	// 회원가입
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody User user) {
		try {
			ls.signUp(user);
			return ResponseEntity.ok("가입 성공");
		}
		catch(Exception e) {
			return ResponseEntity.badRequest().body("가입 실패: " + e.getMessage());
		}
		
		
	}
	
	// 회원가입 시 아이디 중복 확인
	@PostMapping("signup/checkId")
	public ResponseEntity<?> checkId(@RequestBody User user) {
		return ls.checkId(user);
	}

}
