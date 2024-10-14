package com.ai.controller;

import java.time.LocalDate;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.service.LogService;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class LogController {
	
	private final LogService logService;
	
	@GetMapping("/userlog")
	public ResponseEntity<?> getUserLog(@RequestParam String userCode, @RequestParam LocalDate workDate) {
		try {
			return ResponseEntity.ok(logService.getUserLogs(userCode, workDate));
		} catch (NoSuchElementException  e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Logs not found for user code: " + userCode);
		} catch (Exception e) {
	        // 기타 예외 발생 시
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving logs: " + e.getMessage());
	    }
	}
	
	@GetMapping("/alllog")
	public ResponseEntity<?> getAllLog() {
		try {
			return ResponseEntity.ok(logService.getAllLogs());
		} catch (NoSuchElementException  e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("All Logs not found");
		} catch (Exception e) {
	        // 기타 예외 발생 시
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving logs: " + e.getMessage());
	    }
	}
	
	
}
