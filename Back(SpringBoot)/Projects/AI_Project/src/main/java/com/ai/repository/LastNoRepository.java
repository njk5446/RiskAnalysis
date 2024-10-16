package com.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.LastNo;

import jakarta.transaction.Transactional;

// last_no 테이블 (서버 시작, 종료시 마지막 읽은 행 기록 테이블)
public interface LastNoRepository extends JpaRepository<LastNo, Integer>{
	
	@Modifying
	@Transactional
	@Query(value = "UPDATE last_no SET last_no = ?1 WHERE id = 1;", nativeQuery = true)
	void updateLastNo(int lastNo);
}
