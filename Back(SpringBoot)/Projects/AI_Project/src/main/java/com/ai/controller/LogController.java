package com.ai.controller;

import java.time.LocalDate;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.projection.LogProjection;
import com.ai.projection.WorkDateListProjection;
import com.ai.service.LogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LogController {

	private final LogService logService;

	// 해당일자의 지정한 userCode의 정보 조회 
	@GetMapping("/log/userlog")
	public ResponseEntity<?> getUserLog(@RequestParam String userCode, @RequestParam LocalDate workDate) {
		try {
			return ResponseEntity.ok(logService.getUserLogs(userCode, workDate));
		} catch (NoSuchElementException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Logs not found for user code: " + userCode);
		} catch (Exception e) {
			// 기타 예외 발생 시
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error retrieving logs: " + e.getMessage());
		}
	}
	
	// 과거부터 이전까지 기록된 workDate 가져오기
	@GetMapping("/log/workdatelist")
	public ResponseEntity<?> getWorkDateList() {
		try {
			List<WorkDateListProjection> logs = logService.getWorkDateList();
			return ResponseEntity.ok(logs);
	    } catch (DataAccessException dae) {
	        // 데이터베이스 관련 예외 처리
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("데이터베이스에서 작업 일자 목록을 가져오는 중 오류가 발생했습니다.");
	    } catch (IllegalStateException ise) {
	        // 서비스 레이어에서 잘못된 상태일 경우 처리
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                             .body("작업 일자 목록을 가져오는 동안 잘못된 상태가 발생했습니다.");
	    } catch (Exception e) {
	        // 그 외 모든 예외 처리
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("예상치 못한 오류가 발생했습니다.");
	    }
	}
	
	// 해당일자의 모든 userCode의 기록 가져오기 
	@GetMapping("/log/alllog/workdate")
	public ResponseEntity<?> getUserLogs() {
		try {
			List<LogProjection> logs = logService.getAllUserLogs(1);
			return ResponseEntity.ok(logs);
		} catch (NoSuchElementException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Logs not found for user code");
		} catch (Exception e) {
			// 기타 예외 발생 시
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error retrieving logs: " + e.getMessage());
		}
	}

	@GetMapping("/log/alllog")
	public ResponseEntity<?> getAllLog() {
		try {
			return ResponseEntity.ok(logService.getAllLogs());
		} catch (NoSuchElementException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("All Logs not found");
		} catch (Exception e) {
			// 기타 예외 발생 시
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error retrieving logs: " + e.getMessage());
		}
	}

}
