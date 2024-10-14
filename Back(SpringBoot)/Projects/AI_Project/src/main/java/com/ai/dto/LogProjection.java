package com.ai.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// 네이티브쿼리문 매핑할땐 프로젝션 인터페이스 사용
// (DTO 클래스는 네이티브쿼리의 SQL문의 엔티티와 타입을 맞춰야하므로 네이티브쿼리에는 부적합)
// (프로젝션 인터페이스는 쿼리 결과가 인터페이스의 메서드와 자동으로 매핑한다)
public interface LogProjection {
	int getNo();
	String getUserCode();
    LocalDate getWorkDate();
    int getRiskFlag();
    int getHeartbeat();
	BigDecimal getTemperature();
	BigDecimal getOutsideTemperature();
	double getLatitude();
	double getLongitude();
	String getActivity();
	LocalDateTime getVitalDate();
}
