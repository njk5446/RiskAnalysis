package com.ai.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ai.domain.User;
import com.ai.dto.MyInfoDTO;
import com.ai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageService {
	private final UserRepository userRepo;
	private final PasswordEncoder passwordEnc;
	
	// 회원정보 조회: 로그인 후 얻은 토큰의 User 객체 정보의 토큰을 뽑아내서 DB에서 일치하는 User 객체를 가져옴
	public MyInfoDTO getMyInfo() {
		User user = userRepo.findByUserCode(getUserFromToken().getUserCode()).orElseThrow();
		return MyInfoDTO.builder()
				   .userId(user.getUserId())
				   .userName(user.getUserName())
				   .dept(user.getDept())
				   .region(user.getRegion())
				   .gender(user.getGender())
				   .createDate(user.getCreateDate())
				   .build();
	};
	
	// 로그인 후 얻은 토큰으로 해당 아이디의 User 객체를 추출
	public User getUserFromToken() {
		// SecurityContextHolder: 로그인하면 토큰이 나오는데, 
		// 토큰에 들어있는 정보를 바탕으로 Spring Security가 인증 정보를 저장하는 객체
		// 인증정보(아이디,비밀번호 등)를 가져와서 authentication에 저장
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		// 인증정보가 있으면서 인증되었다면(아이디,비밀번호가 DB에 있다면)		
		if (authentication != null && authentication.isAuthenticated()) {
			String userId = authentication.getName(); // 인증 정보의 아이디를 추출해서 userId에 저장 
			if (userId != null) { // userId가 존재하면,
				return userRepo.findByUserId(userId).orElse(null); // 해당 userId의 user 객체를 반환
			}
		}
		return null;
	};
	
	// 비밀번호 변경
	public boolean changePassword(User newPassword) {
		try {
			User currentPassword = userRepo.findByUserCode(getUserFromToken().getUserCode()).orElseThrow();
			currentPassword.setPassword(passwordEnc.encode(newPassword.getPassword()));
			userRepo.save(currentPassword);
			return true;
		} catch (Exception e) {
			return false;
		}
	};
	
	// 부서 변경
	public boolean changeDept(User newDept) {
		try {
			User currentDept = userRepo.findByUserCode(getUserFromToken().getUserCode()).orElseThrow();
			currentDept.setDept(newDept.getDept());
			userRepo.save(currentDept);
			return true;
		} catch (Exception e) {
			return false;
		}
	};

	// 회원탈퇴
	public boolean deleteAccount() {
		try {
			User user = userRepo.findByUserCode(getUserFromToken().getUserCode()).orElseThrow();
			userRepo.delete(user);
			return true;
		} catch (Exception e) {
			return false;
		}
	};
	
	// 회원정보 접근 시 비밀번호 검증
	// 입력한 비밀번호 inputPW와 토큰에 있는 비밀번호와 일치하는지 검증
	public boolean checkPW(User inputPW) {
			User tokenPW = userRepo.findByUserCode(getUserFromToken().getUserCode()).orElseThrow();
			if (passwordEnc.matches(inputPW.getPassword(), tokenPW.getPassword())) {
		        return true;
		    } else {
		        return false;
		    }
	}
}
