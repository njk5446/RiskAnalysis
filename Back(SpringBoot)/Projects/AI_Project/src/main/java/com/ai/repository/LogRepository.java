package com.ai.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.Log;

import com.ai.dto.LogProjection;
import com.ai.dto.LogResponseProjection;
import com.ai.dto.UserCodeProjection;

// log 테이블
public interface LogRepository extends JpaRepository<Log, Integer> {
	
//	// 일자별, userCode별 이전 데이터 조회
//	@Query
//	(value = "SELECT l.no, l.work_date, l.risk_flag, " +
//             "l.heartbeat, l.temperature, l.outside_temperature, " +
//             "l.latitude, l.longitude, l.activity, l.vital_date, u.user_code " +
//             "FROM log l " +
//             "JOIN user u ON l.user_code = u.user_code " +
//             "WHERE u.user_code = ? AND l.work_date = ? " +
//             "ORDER BY l.no DESC LIMIT 60",
//    nativeQuery = true) // 이건 최근 기록 60개만 받는게 맞는듯?
//	List<LogProjection> findLogsByUserCodeAndWorkDate(String userCode, LocalDate workDate);
	
	// 일자별, userCode별 이전 데이터 조회
	@Query
	(value = "SELECT l.no, l.work_date, l.risk_flag, " +
             "l.heartbeat, l.temperature, l.outside_temperature, " +
             "l.latitude, l.longitude, l.activity, l.vital_date, u.user_code " +
             "FROM log l " +
             "JOIN user u ON l.user_code = u.user_code " +
             "WHERE u.user_code = ? AND l.work_date = ? " +
             "ORDER BY l.no DESC LIMIT 60",
    nativeQuery = true) // 이건 최근 기록 60개만 받는게 맞는듯?
	List<LogProjection> findLogsByUserCodeAndWorkDate(String userCode, LocalDate workDate);
	
	
			
	@Query // Log 테이블의 마지막 행과 중복되는지 검사
	(value = "SELECT user_code, work_date, risk_flag, heartbeat, "
		    + "temperature, outside_temperature, latitude, longitude, "
			+ "vital_date, activity "
			+ "FROM log "
			+ "ORDER BY no DESC LIMIT 1", // db에서 조회할 데이터  
    nativeQuery = true) // 해당 쿼리가 실제 SQL 쿼리임을 지정
	Optional<LogResponseProjection> findByLastNo();
	
	// 일자별 이전 데이터 조회
	@Query
	(value = "SELECT l.no, l.work_date, l.risk_flag, "
             + "l.heartbeat, l.temperature, l.outside_temperature, " 
             + "l.latitude, l.longitude, l.activity, l.vital_date, u.user_code " 
             + "FROM log l " 
             + "JOIN user u ON l.user_code = u.user_code "
             + "WHERE l.work_date = ? "
             + "ORDER BY l.no DESC",
    nativeQuery = true) 
	List<LogProjection> findLogsByWorkDate(LocalDate workDate);
	
	
	@Query
	(value = "SELECT DISTINCT user_code "
			+ "FROM log "
			+ "WHERE work_date = ?",
	nativeQuery = true)
	List<UserCodeProjection> findUserCodeByWorkDate(LocalDate workDate);
	
//	@Query
//	(value = "SELECT l.no, l.work_date, l.risk_flag, "
//             + "l.heartbeat, l.temperature, l.outside_temperature, "
//             + "l.latitude, l.longitude, l.activity, l.vital_date, u.user_code " 
//             + "FROM log l "
//             + "JOIN user u ON l.user_code = u.user_code "
//             + "WHERE l.work_date = ? "
//             + "ORDER BY l.no DESC LIMIT 60",
//    nativeQuery = true) 
//	List<LogProjection> findLogsByWorkDateLimit(LocalDate workDate);
}
