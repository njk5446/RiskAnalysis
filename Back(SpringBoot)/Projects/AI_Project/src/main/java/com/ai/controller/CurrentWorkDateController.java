package com.ai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.domain.CurrentWorkDate;
import com.ai.service.CurrentWorkDateService;

import lombok.RequiredArgsConstructor;

// 현재일자 가져오기 컨트롤러
@RestController
@RequiredArgsConstructor
public class CurrentWorkDateController {
	
	private final CurrentWorkDateService cwService;
	
	@GetMapping("/workdate")
	public CurrentWorkDate getWorkDate(@RequestParam int id) {
		return cwService.getWorkDate(id);
	}
}
