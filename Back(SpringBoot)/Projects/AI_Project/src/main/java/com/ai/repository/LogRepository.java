package com.ai.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.Log;
import com.ai.projection.ActivityProjection;
import com.ai.projection.LogProjection;
import com.ai.projection.LogResponseProjection;
import com.ai.projection.RiskFlagProjection;
import com.ai.projection.UserCodeProjection;
import com.ai.projection.WorkDateListProjection;

// log 테이블
public interface LogRepository extends JpaRepository<Log, Integer> {
	
	// 해당 일자의 사용자별 위험빈도 관련 데이터 가져오기(그래프 그리기용)
	@Query
	(value = "SELECT vital_date, risk_flag "
			+ "FROM log "
			+ "WHERE user_code = ? AND work_date = ? AND risk_flag >= 1",
	nativeQuery = true)
	List<RiskFlagProjection> findRiskFlag(String user_code, LocalDate workDate);

	// 일자별, userCode별 이전 데이터 조회 (최근 60개 데이터)
	@Query
	(value = "SELECT l.no, l.work_date, l.risk_flag, " +
             "l.heartbeat, l.temperature, l.outside_temperature, " +
             "l.latitude, l.longitude, l.activity, l.vital_date, u.user_code " +
             "FROM log l " +
             "JOIN user u ON l.user_code = u.user_code " +
             "WHERE u.user_code = ? AND l.work_date = ? " +
             "ORDER BY l.no DESC LIMIT 60",
    nativeQuery = true) 
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
	
	
	// 일자별 user_code 목록 조회
	@Query
	(value = "SELECT DISTINCT user_code "
			+ "FROM log "
			+ "WHERE work_date = ?",
	nativeQuery = true)
	List<UserCodeProjection> findUserCodeByWorkDate(LocalDate workDate);
	
	// 과거부터 현재까지 기록된 일자들 전부 가져오기
	@Query
	(value = "SELECT DISTINCT work_date "
			+ "FROM log ",
	nativeQuery = true)
	List<WorkDateListProjection> findWorkDateList();
	
	@Query
	(value = "SELECT activity, COUNT(*) as COUNT "
			+ "FROM Log "
			+ "WHERE user_code = ? AND work_date = ? AND risk_flag > 1 "
			+ "GROUP BY activity, risk_flag "
			+ "ORDER BY activity",
	nativeQuery = true)
	List<ActivityProjection> findActivityCount(String userCode, LocalDate workDate);
}
