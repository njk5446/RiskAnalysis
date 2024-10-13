package com.ai.dto;

import java.time.LocalDateTime;

import com.ai.domain.Dept;


// 프로젝션 인터페이스: 해당 인터페이스는 DB SQL 쿼리의 결과를 매핑할때 사용하는 DTO 
// 해당 메서드들은 쿼리에서 정의한 컬럼과 일치해야 매핑된다.
// 
public interface GetBoardsDTO {
	int getIdx();
	String getTitle();
	String getContent();
	Dept getDept();
	String getUserId();
	String getUserName();
	LocalDateTime getCreateDate();
}

//DTO는 필요한 데이터들만 정의해서 쓸수있음