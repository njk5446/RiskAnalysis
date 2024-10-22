package com.ai.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
public class SensorData {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int no;
	
	@Column(nullable = false)
	@JsonSerialize(using = LocalDateSerializer.class)
	@JsonDeserialize(using = LocalDateDeserializer.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate workDate;
	
	@Column(length = 8, nullable = false)
	private String userCode;
	
	@Column(nullable = false)
	private int heartbeat;
	
	@Column(nullable = false, precision = 3, scale = 1)
	private BigDecimal temperature;
	
	@Column(nullable = false, precision = 3, scale = 1)
	private BigDecimal outsideTemperature;
	
	@Column(nullable = false)
	private double latitude;
	
	@Column(nullable = false)
	private double longitude;
	
	@Column(nullable = false, columnDefinition = "DATETIME(3)")
	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS")
	private LocalDateTime vitalDate;
	
	@Column(nullable = false)
	private float x;
	
	@Column(nullable = false)
	private float y;
	
	@Column(nullable = false)
	private float z;
}
