package com.ai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ai.domain.User;
import com.ai.service.MyPageService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MyPageController {
	private final MyPageService ms;
	
	// 회원정보 조회
	@GetMapping("/mypage/info")
	public ResponseEntity<?> mypage() {
		try {
			return ResponseEntity.ok(ms.getMyInfo());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("사용자 정보를 조회하는 데 실패했습니다. 다시 시도해 주세요.");
		}	
	}
	

	
	@PostMapping("/mypage/checkpw")
	public ResponseEntity<?> checkPasword(@RequestBody User user) {
		try {
			if (ms.checkPW(user)) {
				return ResponseEntity.ok("비밀번호 검증 성공");
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호 검증 실패");
			}
			
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("알 수 없는 에러 발생");
		}
	}
	
	
	// 비밀번호 변경
	@PostMapping("/mypage/changepw")
	public ResponseEntity<?> changePassword(@RequestBody User user) {
		if (ms.changePassword(user) == true) {
			return ResponseEntity.ok("비밀번호 변경 성공");
		} else {
			return ResponseEntity.badRequest().body("비밀번호 변경 실패");
		}
	}
	
	// 부서 변경
	@PostMapping("/mypage/changedept")
	public ResponseEntity<?> changeDept(@RequestBody User user) {
		if (ms.changeDept(user) == true) {
			return ResponseEntity.ok("부서 변경 성공");
		} else {
			return ResponseEntity.badRequest().body("부서 변경 실패");
		}
	}
	
	// 회원 탈퇴
	@PostMapping("/mypage/deleteacc")
	public ResponseEntity<?> deleteacc() {
		if (ms.deleteAccount() == true) {
			return ResponseEntity.ok("회원 탈퇴 성공");
		} else {
			return ResponseEntity.badRequest().body("회원 탈퇴 실패");
		}
	}
}
