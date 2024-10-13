package com.ai.service;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ai.domain.User;
import com.ai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SecurityUserDetailsService implements UserDetailsService {
	// UserDetailsService: 사용자 정보 불러오기 위한 객체
	// 사용자 정보를 불러올때 loadUserByUsername 호출(현재 오버라이드된 사용자 정의 메서드를 호출)
	private final UserRepository userRepo; // 사용자들 정보 DB
	

	// 스프링 시큐리티 내장객체 방식 UserDetails
	@Override
	public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
		// 입력한 아이디와 일치하는지 DB에서 찾는다
		// 존재하면, 사용자 정보를 user에 저장
		// 없으면, UserNotFoundException으로 User Not Found 화면에 출력
		User user = userRepo.findByUserId(userId).orElseThrow(()->
		new UsernameNotFoundException("User Not Found."));
			
		// 내장객체 User를 사용해서 UserDetails 객체를 생성
		// 객체에는 사용자 아이디, 비밀번호, 권한 목록을 포함
		return new org.springframework.security.core.userdetails.User(
				user.getUserId(),
				user.getPassword(),
				AuthorityUtils.createAuthorityList(user.getRole().toString()));
		// 생성된 UserDetails 객체는 Spring Security로 반환되어 자격을 검증하고 처리
	}
}
