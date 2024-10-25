package com.ai.projection;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public interface WorkDateListProjection {
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	LocalDate getWorkDate();
}
