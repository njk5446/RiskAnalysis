package com.ai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.service.UserInfoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserInfoController {
	private final UserInfoService userService;
	
	// userCode로 userName 가져오기
	@GetMapping("/userinfo/username")
	public ResponseEntity<?> getYourName(@RequestParam String userCode) {
		try {
			return ResponseEntity.ok(userService.getYourName(userCode));
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
								 .body(e.getMessage());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								 .body("유효하지않은 userCode" + userCode);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								 .body("사용자 이름을 가져오는 중 오류가 발생했습니다.");
		}
	}
	
	// sessionStorage의 userId로 userName 가져오기
	@GetMapping("/username")
	public ResponseEntity<?> getPersonName(@RequestParam String userId) {
		try {
			return ResponseEntity.ok(userService.getPersonName(userId));
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
								 .body(e.getMessage());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								 .body("유효하지않은 userId" + userId);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								 .body("사용자 이름을 가져오는 중 오류가 발생했습니다.");
		}
	}
	
	@GetMapping("/department")
	public ResponseEntity<?> getDepartment(@RequestParam String userId) {
		try {
			return ResponseEntity.ok(userService.getDepartment(userId));
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
								 .body(e.getMessage());
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
								 .body("유효하지않은 userId" + userId);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								 .body("사용자 이름을 가져오는 중 오류가 발생했습니다.");
		}
	}
}
