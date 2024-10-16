package com.ai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.SensorData;
import com.ai.dto.SensorWorkDateProjection;

// sensor_data 테이블
public interface SensorDataRepository extends JpaRepository<SensorData, Integer> {
	Optional<SensorData> findById(int no);
	
	@Query
	(value = "SELECT work_date FROM sensor_data " +
			 "WHERE no = ?", nativeQuery = true)
	SensorWorkDateProjection findWorkDateById(int no);
}
