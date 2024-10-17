package com.ai.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.CurrentWorkDate;

import jakarta.transaction.Transactional;

// 현재일자 기록 테이블
public interface CurrentWorkDateRepository extends JpaRepository<CurrentWorkDate, Integer> {
	
	@Modifying
	@Transactional
	@Query
	(value = "CALL update_current_work_date(?)", nativeQuery = true)
	void updateCurrentWorkDate(LocalDate workDate);
}
