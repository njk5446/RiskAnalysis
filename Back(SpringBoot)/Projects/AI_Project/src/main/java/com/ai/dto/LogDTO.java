package com.ai.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LogDTO {
	private int no;
    private LocalDate workDate;
    private int riskFlag;
    private int heartbeat;
    private BigDecimal temperature;
    private BigDecimal outsideTemperature;
    private double latitude;
    private double longitude;
    private String activity;
    private LocalDateTime vitalDate;
    private String userCode; // User 테이블에서 가져오는 user_code
}
