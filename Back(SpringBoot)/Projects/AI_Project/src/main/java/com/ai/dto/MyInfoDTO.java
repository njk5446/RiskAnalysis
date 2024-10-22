package com.ai.dto;

import java.time.LocalDate;

import com.ai.domain.Dept;
import com.ai.domain.Gender;
import com.ai.domain.Region;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// 마이페이지 DTO
@Getter @Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyInfoDTO {
	private String userId;
	private String userName;
	private Dept dept;
	private Region region;
	private Gender gender;
	private LocalDate createDate;
}

