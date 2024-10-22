package com.ai.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ai.projection.ActivityProjection;
import com.ai.projection.RiskFlagProjection;
import com.ai.repository.LogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GraphService {
	
	private final LogRepository logRepo;
	
	// 해당일자의 해당 작업자의 기록된 RiskFlag, VitalDate 가져오기
	public List<RiskFlagProjection> getRiskData(String userCode, LocalDate workDate) {
		return logRepo.findRiskFlag(userCode, workDate);
	}
	
	// 특정 날짜에 특정 사용자가 어떠한 활동시 위험이 발생한 횟수 조회
	public List<ActivityProjection> getActivityCount(String userCode, LocalDate workDate) {
		return logRepo.findActivityCount(userCode, workDate);
	}
}
