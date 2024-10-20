package com.ai.controller;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.service.GraphService;
import com.ai.service.LogService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class GraphController {
	
	private final LogService logService;
	private final GraphService graphService;
	
	@GetMapping("/showgraph/risk")
	public ResponseEntity<?> getRiskGraph(@RequestParam String userCode, @RequestParam LocalDate workDate) {
		try {
			return ResponseEntity.ok(graphService.getRiskData(userCode, workDate));
		} catch (IllegalArgumentException e) {
	        // 잘못된 파라미터 값 등으로 발생하는 예외 처리
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request parameters: " + e.getMessage());
	    } catch (Exception e) {
	        // 기타 예외 처리
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
	    }
	}
	
	// 해당일자의 userCode 가져오기
	@GetMapping("/showgraph/userlist")
	public ResponseEntity<?> getUsercodeList(@RequestParam LocalDate workDate) {
		try {
			return ResponseEntity.ok(logService.getUserCodeByWorkDate(workDate));
		} catch (IllegalArgumentException e) {
	        // 잘못된 파라미터 값 등으로 발생하는 예외 처리
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request parameters: " + e.getMessage());
	    } catch (Exception e) {
	        // 기타 예외 처리
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
	    }
	}
}
