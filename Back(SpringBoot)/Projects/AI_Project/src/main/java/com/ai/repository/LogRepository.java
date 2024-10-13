package com.ai.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.Log;
import com.ai.dto.LogDTO;

// log 테이블
public interface LogRepository extends JpaRepository<Log, Integer> {
	

	// JPQL로 DTO 반환 방식
	@Query(
		    value = "SELECT new com.ai.dto.LogDTO(l.no, l.workDate, l.riskFlag, " +
		    		"l.heartbeat, l.temperature, l.outsideTemperature, " +
		            "l.latitude, l.longitude, l.activity, l.vitalDate, u.userCode) " +
		            "FROM Log l " +
		            "JOIN l.user u " +
		            "WHERE u.userCode = ?1 AND l.workDate = ?2 " +
		            "ORDER BY l.no DESC LIMIT 60")
	List<LogDTO> findByUserCodeAndWorkDate(String userCode, LocalDate workDate);
	
	@Query // 데이터 조회 및 전체 데이터 개수를 계산하는 SQL 쿼리문 정의 어노테이션
	(value = "SELECT * FROM log " +
			 "ORDER BY no DESC LIMIT 1", // db에서 조회할 데이터  
     nativeQuery = true) // 해당 쿼리가 실제 SQL 쿼리임을 지정
	Optional<Log> findByLastNo();
	
	// 네이티브쿼리 DTO 반환 방식
//	@Query(
//		    value = "SELECT l.no, l.work_date, l.risk_flag, l.heartbeat, l.temperature, l.outside_temperature, " +
//		            "l.latitude, l.longitude, l.activity, l.vital_date, u.user_code AS userCode " +
//		            "FROM log l " +
//		            "JOIN user u ON l.user_code = u.user_code " +
//		            "WHERE u.user_code = ?1 AND l.work_date = ?2 " +
//		            "ORDER BY l.no DESC LIMIT 60",
//		    nativeQuery = true)
//		List<Object[]> findByUserCodeAndWorkDate(String userCode, LocalDate workDate);
}
