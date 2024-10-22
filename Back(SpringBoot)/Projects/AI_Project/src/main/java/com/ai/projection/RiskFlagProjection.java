package com.ai.projection;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public interface RiskFlagProjection {
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
	LocalDateTime getVitalDate();
	
	int getRiskFlag();
}
