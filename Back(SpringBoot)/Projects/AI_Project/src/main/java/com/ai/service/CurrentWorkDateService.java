package com.ai.service;

import org.springframework.stereotype.Service;

import com.ai.domain.CurrentWorkDate;
import com.ai.repository.CurrentWorkDateRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentWorkDateService {
	private final CurrentWorkDateRepository curRepo;
	
	public CurrentWorkDate getWorkDate(int id) {
		return curRepo.findById(id).orElse(null);
	}

}
