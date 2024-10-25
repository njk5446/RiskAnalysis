package com.ai.service;

import org.springframework.stereotype.Service;

import com.ai.domain.Dept;
import com.ai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserInfoService {
	private final UserRepository userRepo;
	
	public String getYourName(String userCode) {
		return userRepo.searchUserName(userCode);
	}
	
	public String getPersonName(String userId) {
		return userRepo.searchPersonName(userId);
	}
	
	public Dept getDepartment(String userId) {
		return userRepo.findDept(userId);
	}
}
