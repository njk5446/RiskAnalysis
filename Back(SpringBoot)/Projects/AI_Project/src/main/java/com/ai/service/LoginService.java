package com.ai.service;

import java.security.SecureRandom;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ai.domain.Role;
import com.ai.domain.User;
import com.ai.repository.UserRepository;

import lombok.RequiredArgsConstructor;


// 로그인 및 회원가입 서비스 계층
@Service
@RequiredArgsConstructor
public class LoginService {
	private final UserRepository userRepo;
	private final PasswordEncoder passwordEnc;
	
	private static final SecureRandom random = new SecureRandom();
	private static final String CHARACTERS = "0123456789";


	// db에 중복되는 userCode가 있는지 확인 후 userCode 반환
	public String generateUniqueUserCode(int length) {
		String userCode;
		do {
			userCode = generateUserCode(length);
		} while (userRepo.findByUserCode(userCode).isPresent());
		return userCode;
	}

	// UserCode 생성 메서드
	public String generateUserCode(int length) {
		StringBuilder sb = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			int index = random.nextInt(CHARACTERS.length());
			sb.append(CHARACTERS.charAt(index));
		}
		return sb.toString();
	}

	
	// 회원가입 메서드
	public void signUp(User user) {
		String userCode = generateUniqueUserCode(8);
		userRepo.save(User.builder() // userRepository에 user 정보를 저장
					  .userCode(userCode)
					  .userId(user.getUserId())
					  .password(passwordEnc.encode(user.getPassword())) // encode를 통해 암호화
					  .userName(user.getUserName())
					  .dept(user.getDept())
					  .region(user.getRegion())
					  .gender(user.getGender())
					  .role(Role.ROLE_USER)
					  .build());
	}
	
	// 중복 아이디 체크
	public ResponseEntity<?> checkId(User user) {
		// ResponseEntity 요청에 대한 응답 객체
		if (userRepo.findByUserId(user.getUserId()).isPresent()) { 
			return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 ID");
			// 응답 객체의 상태가 CONFLICT(충돌)상태로 body(본문)의 내용 "중복된 ID"를 화면에 출력하도록 반환
		} else {
			return ResponseEntity.ok("사용 가능한 아이디");
		}
	}

}
