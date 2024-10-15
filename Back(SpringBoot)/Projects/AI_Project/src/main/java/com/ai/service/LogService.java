package com.ai.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ai.domain.Log;
import com.ai.dto.LogProjection;
import com.ai.repository.LogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogService {
	private final LogRepository logRepo;

    // 해당 userCode, 일자별 이전 데이터 조회
    public List<LogProjection> getUserLogs(String userCode, LocalDate workDate) {
        return logRepo.findLogsByUserCodeAndWorkDate(userCode, workDate);
    }
    
    // 일자별 모든 이전 데이터 조회
    public List<LogProjection> getLogsByDate(LocalDate workDate) {
    	return logRepo.findLogsByWorkDate(workDate);
    }
	
	// 모든 작업자의 이전 데이터 조회 (모든 일자)
	public List<Log> getAllLogs() {
		return logRepo.findAll();
	}
}
