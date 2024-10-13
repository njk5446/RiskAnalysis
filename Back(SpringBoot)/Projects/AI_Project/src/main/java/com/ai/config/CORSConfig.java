

package com.ai.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class CORSConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(@NonNull CorsRegistry registry) {
		
		//헤더란? HTTP 요청과 응답시 메타데이터를 전달하는 필드
		registry.addMapping("/**")
				.allowedMethods("*") // 모든 HTTP 메서드 허용
				.exposedHeaders(HttpHeaders.AUTHORIZATION)
				.allowedHeaders("*") // 모든 헤더 허용
				.allowedOrigins("*"); // 접근 가능 ip 주소
		
		registry.addMapping("/login") // 해당 경로 접근시 CORS 정책 적용
				.allowCredentials(true) // 자격증명(쿠키, Http 인증헤더(토큰),...) 보내는 것을 허용
				.allowedHeaders(HttpHeaders.CONTENT_TYPE) // 클라이언트가 CONTENT_TYPE(JSON형태로반환) 형태만 헤더로 포함할수있음
				.exposedHeaders(HttpHeaders.AUTHORIZATION) // 클라이언트가 응답시 보여지는 헤더
				.allowedMethods( // 해당 메서드 허용
						HttpMethod.POST.name(),
						HttpMethod.OPTIONS.name())
				.allowedOrigins( // 접근 가능한 ip 주소
						"*"
						);	
		
		registry.addMapping("/signup/**")
				.allowedHeaders(HttpHeaders.CONTENT_TYPE) // 사용자 입력값을 
				// CONTENT_TYPE: 사용자가 웹페이지에서 입력한 값을 CONTENT_TYPE을 통해 JSON 형태로 변환해서 서버로 전송 
				.allowedMethods(
						HttpMethod.GET.name(),
						HttpMethod.POST.name())
				.allowedOrigins(
						"*"
						);
		
		registry.addMapping("/boards/**")
				.allowCredentials(true) // 자격증명(쿠키, Http 인증헤더(토큰),...) 보내는 것을 허용
				.allowedHeaders(HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION)
				.allowedMethods(
						HttpMethod.GET.name())
				.allowedOrigins(
						"*"
		);
		
		registry.addMapping("/board/write/**")
				.allowCredentials(true) // 자격증명(쿠키, Http 인증헤더(토큰),...) 보내는 것을 허용
				.allowedHeaders(HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION)
				.allowedMethods(
						HttpMethod.POST.name())
				.allowedOrigins(
						"*"
						);
				
		registry.addMapping("/board/edit/**")
				.allowCredentials(true) // 자격증명(쿠키, Http 인증헤더(토큰),...) 보내는 것을 허용
				.allowedHeaders(HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION)
				.allowedMethods(
						HttpMethod.POST.name())
				.allowedOrigins(
						"*"
						);
				
		registry.addMapping("/board/delete/**")
				.allowCredentials(true) // 자격증명(쿠키, Http 인증헤더(토큰),...) 보내는 것을 허용
				.allowedHeaders(HttpHeaders.AUTHORIZATION)
				.allowedMethods(
						HttpMethod.POST.name())
				.allowedOrigins(
						"*"
						);
				
				
		registry.addMapping("/mypage/checkpw/**")
		.allowCredentials(true) // 자격증명(쿠키, Http 인증헤더(토큰),...) 보내는 것을 허용
		.allowedHeaders(HttpHeaders.AUTHORIZATION)
		.allowedMethods(
				HttpMethod.POST.name())
		.allowedOrigins(
				"*"
				);
		
//        // 메인 경로에 대한 CORS 정책 설정 (특정 IP에서만 접근 가능)
//        registry.addMapping("/main/**")
//                .allowCredentials(true)
//                .allowedHeaders(HttpHeaders.AUTHORIZATION)
//                .allowedMethods(HttpMethod.GET.name(), HttpMethod.POST.name())
//                .allowedOrigins(
//                        "http://192.168.0.143:3000", // 특정 IP로 변경
//                        "http://192.168.0.131:3000"  // 추가적인 특정 IP
//                );
		
		
	}
}