package com.ai.domain;

// Role은 스프링시큐리티 표준에 따라 ROLE_ADMIN 이렇게 DB에 저장된다
// 나머지 사용자 정의 ENUM은 값 그대로 저장됨
public enum Role {
	ROLE_ADMIN, ROLE_USER
}
