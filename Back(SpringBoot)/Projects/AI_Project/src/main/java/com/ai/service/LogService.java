package com.ai.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ai.domain.Log;
import com.ai.projection.LogProjection;
import com.ai.projection.UserCodeProjection;
import com.ai.projection.WorkDateListProjection;
import com.ai.repository.CurrentWorkDateRepository;
import com.ai.repository.LogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogService {
	private final LogRepository logRepo;
	private final CurrentWorkDateRepository curRepo;

    // 해당 userCode, 일자별 이전 데이터 조회 (최근 60개)
    public List<LogProjection> getUserLogs(String userCode, LocalDate workDate) {
        return logRepo.findLogsByUserCodeAndWorkDate(userCode, workDate);
    }
      
    // 모든 유저 코드에 대한 로그를 한 번에 가져오는 메서드 추가
    public List<LogProjection> getAllUserLogs(int workDateId) {
        // 1. 현재 작업일자 가져오기
        LocalDate workDate = getCurrentWorkDate(workDateId);
        // 2. 해당 작업일자의 유저 코드 리스트 가져오기
        List<UserCodeProjection> userCodes = getUserCodeByWorkDate(workDate);
        // 3. 로그를 저장할 리스트 초기화
        List<LogProjection> allLogs = new ArrayList<>();
        
        // 4. 유저 코드 리스트 순회
        for (UserCodeProjection userCodeProjection : userCodes) {
            String userCode = userCodeProjection.getUserCode(); // 유저 코드 추출
            // 5. 각 유저 코드에 대해 로그 가져오기
            List<LogProjection> logs = getUserLogs(userCode, workDate);
            
            // 6. 가져온 로그를 allLogs 리스트에 추가
            allLogs.addAll(logs); // 여러 로그를 리스트에 추가
        }
        // 7. 모든 로그 반환
        return allLogs;
    }
    
    // 일자별 모든 이전 데이터 조회
    public List<LogProjection> getLogsByDate(LocalDate workDate) {
    	return logRepo.findLogsByWorkDate(workDate);
    }
    
    // 과거부터 현재가지 기록된 workDate 조회
    public List<WorkDateListProjection> getWorkDateList() {
    	return logRepo.findWorkDateList();
    }
	
	// 모든 작업자의 이전 데이터 조회 (모든 일자)
	public List<Log> getAllLogs() {
		return logRepo.findAll();
	}
	
	// 해당일자의 UserCode(작업자) 불러오기
	public List<UserCodeProjection> getUserCodeByWorkDate(LocalDate workDate) {
		return logRepo.findUserCodeByWorkDate(workDate);
	}
	
	// 현재 일자 불러오기
	public LocalDate getCurrentWorkDate(int id) {
		System.out.println("getWorkDate: " + curRepo.findById(id).orElse(null).getWorkDate());
        return curRepo.findById(id).orElse(null).getWorkDate();
    }
	
}
