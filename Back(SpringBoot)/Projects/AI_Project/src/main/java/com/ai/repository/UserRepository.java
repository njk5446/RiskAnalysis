package com.ai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ai.domain.Dept;
import com.ai.domain.User;

//JPARepository: CRUD 메서드를 상속해줌
//JPARepository<첫번째인자, 두번째인자>
//첫번째인자: 리포지토리가 관리하는 엔티티클래스
//두번째인자: 엔티티의 기본키 타입
public interface UserRepository extends JpaRepository<User, String>{
	Optional<User> findByUserId(String userId);
	Optional<User> findByUserCode(String userCode);
	
	@Query
	(value = "SELECT user_name FROM user " 
			+ "WHERE user_code = ?",
	nativeQuery = true)
	String searchUserName(String userCode);
	
	@Query
	(value = "SELECT user_name FROM user "
			+ "WHERE user_id = ?",
	nativeQuery = true)
	String searchPersonName(String userId);
	
	// 부서 가져오기
	@Query
	(value = "SELECT dept FROM user "
			+ "WHERE user_id = ?",
	nativeQuery = true)
	Dept findDept(String userId);
}
