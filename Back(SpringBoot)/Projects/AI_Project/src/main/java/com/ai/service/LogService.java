package com.ai.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ai.domain.Log;
import com.ai.dto.LogDTO;
import com.ai.repository.LogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogService {
	private final LogRepository logRepo;

//	// 해당 userCode의 이전 데이터 조회
//	public List<Log> getUserLogs(String userCode, LocalDate workDate) {
//		return logRepo.findByUserCodeAndWorkDate(userCode, workDate);
//	}
	
    // 해당 userCode의 이전 데이터 조회
    public List<LogDTO> getUserLogs(String userCode, LocalDate workDate) {
        return logRepo.findByUserCodeAndWorkDate(userCode, workDate);
    }
	
    // 네이티브쿼리방식 DTO 반환
//    public List<LogDTO> getUserLogs(String userCode, LocalDate workDate) {
//        List<Object[]> logs = logRepo.findByUserCodeAndWorkDate(userCode, workDate);
//        return logs.stream().map(log -> new LogDTO(
//                (int) log[0],               // no
//                (LocalDate) log[1],        // workDate
//                (int) log[2],              // riskFlag
//                (int) log[3],              // heartbeat
//                (BigDecimal) log[4],       // temperature
//                (BigDecimal) log[5],       // outsideTemperature
//                (double) log[6],           // latitude
//                (double) log[7],           // longitude
//                (String) log[8],           // activity
//                (LocalDateTime) log[9],    // vitalDate
//                (String) log[10]           // userCode
//        )).collect(Collectors.toList());
//    }
	
	// 모든 작업자의 이전 데이터 조회
	public List<Log> getAllLogs() {
		return logRepo.findAll();
	}
}
