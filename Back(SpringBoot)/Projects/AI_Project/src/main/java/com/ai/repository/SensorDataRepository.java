package com.ai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.domain.SensorData;

// sensor_data 테이블
public interface SensorDataRepository extends JpaRepository<SensorData, Integer> {
	Optional<SensorData> findById(int no);
}
