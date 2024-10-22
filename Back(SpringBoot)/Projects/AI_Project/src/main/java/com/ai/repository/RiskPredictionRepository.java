package com.ai.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.RiskPrediction;

import jakarta.transaction.Transactional;

public interface RiskPredictionRepository extends JpaRepository<RiskPrediction, String> {
	

	@Query
	(value = "SELECT * FROM risk_prediction WHERE user_code = ?",
	nativeQuery = true)
	Optional<RiskPrediction> findByUserCode(String userCode);
	
	@Modifying
	@Transactional
	@Query(value = "CALL upsert_risk_prediction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", nativeQuery = true)
	void upsertRiskPrediction(String userCode, LocalDate workDate, int riskFlag,
			int heartbeat, BigDecimal temperature, BigDecimal outsideTemperature,
			double latitude, double longitude, String activity, LocalDateTime vitalDate);
	}

//@Transactional
//@Modifying
//@Query(value = "CALL upsert_risk_prediction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", nativeQuery = true)
//void upsertRiskPrediction(String userCode, LocalDate workDate, int riskFlag,
//		int heartbeat, BigDecimal temperature, BigDecimal outsideTemperature,
//		double latitude, double longitude, String activity, LocalDateTime vitalDate);
//}



