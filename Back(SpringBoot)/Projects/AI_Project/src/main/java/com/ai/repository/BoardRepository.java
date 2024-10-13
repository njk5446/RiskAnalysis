package com.ai.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.Board;
import com.ai.domain.User;
import com.ai.dto.GetBoardsDTO;

public interface BoardRepository extends JpaRepository<Board, Integer> {
	Optional<Board> findByUser(User user); // Integer는 null값을 가질수있음
	
	@Query // 데이터 조회 및 전체 데이터 개수를 계산하는 SQL 쿼리문 정의 어노테이션
	(value = "SELECT idx, user_code, title, content, user_id, user_name, dept, create_date FROM board", // db에서 조회할 데이터  
     countQuery = "SELECT count(*) FROM board",  // 해당 테이블 데이터 전체 개수를 계산
     nativeQuery = true) // 해당 쿼리가 실제 SQL 쿼리임을 지정
	Page<GetBoardsDTO> findBoardsDTO(Pageable pageable);
	// 쿼리문을 통해 조회된 데이터와 전체 데이터 개수를 바탕으로 Page 객체를 생성 후 Pageable을 통해 페이지네이션을 수행
	// Pageable: Default 페이지네이션 구성(첫번째 페이지:0, 페이지당 항목수:20개, 정렬기준:DB 저장된 순서)
	// GetBoardsDTO는 프로젝션 인터페이스로서, Page 객체에 대한 getter를 구현해서 페이지네이션된 데이터들을 클라이언트에 반환한다
	
}
