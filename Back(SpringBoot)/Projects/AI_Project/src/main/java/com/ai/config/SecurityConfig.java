package com.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import com.ai.config.filter.JWTAuthenFilter;
import com.ai.config.filter.JWTAuthorFilter;
import com.ai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final AuthenticationConfiguration authConfig;
	private final UserRepository userRepo;
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(); // 비밀번호 해싱 암호화 객체
	}
	
	// Bean 어노테이션으로 등록된 함수들은 ioc컨테이너라는 중간 매개체에 함수들이 저장되어
	@Bean // 서로 다른 클래스에서 자유롭게 사용이 가능하게 만든다..
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		http.authorizeHttpRequests(security->security
				.requestMatchers("/user/**").authenticated()
				// authenticated(): 인증된 사용자면 해당 경로에 접근 가능
//				.requestMatchers("/main/**").hasRole("ADMIN") 
//				.requestMatchers("/main/**").authenticated()
				// hasRole: 해당 경로로 시작하는 모든 요청은 ADMIN 역할을 가진 사용자만 접근 가능
				// 주의: hasRole, hasAnyRole은 ADMIN이면 ROLE_ADMIN으로 앞에 접두사 "ROLE_ADMIN"을 추가한다
				// 그래서 DB에도 ROLE_"권한이름" 이런식으로 지정해야됨
				.requestMatchers("/boards/**").authenticated()
				.requestMatchers("/boardlist/**").authenticated()
				.requestMatchers("/board/**").authenticated()
				.requestMatchers("/mypage/**").authenticated()
				.anyRequest().permitAll() // 위 지정한 경로말고 모든 경로는 누구나 접근 가능
				);
		
//        http.authorizeHttpRequests(security -> security
//                .requestMatchers("/user/**").authenticated()
//                .requestMatchers("/main/**").hasRole("ADMIN") 
//                .requestMatchers("/boards/**").authenticated()
//                .requestMatchers("/boardlist/**").authenticated()
//                .requestMatchers("/board/**").authenticated()
//                .requestMatchers("/mypage/**").authenticated()
//                .anyRequest().permitAll()
//        );
		
		http.csrf(cf->cf.disable()); // CSRF 보호 비활성화
				
		http.formLogin(fm->fm.loginPage("/login").permitAll());
		
		http.httpBasic(basic->basic.disable());
		// HTTP Basic 인증 사용안함
		
		http.sessionManagement(sm->sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		// 세션이 응답할때까지만 유지되고 삭제됨(주로 JWT 토큰방식에서 사용)

		http.cors(c->{});
		
		
		// addFilterBefore: JWTAuthorFilter가 AuthorizationFilter보다 먼저 실행됨
		http.addFilterBefore(new JWTAuthorFilter(userRepo), AuthorizationFilter.class);
		http.addFilter(new JWTAuthenFilter(authConfig.getAuthenticationManager()));
		// 중요: 로그인시 JWTAuthenFilter가 필요한데 필터체인 순서상,
		// JWTAuthorFilter가 먼저 실행되는데 헤더에 토큰이 없으니까
		// doFilterChain으로 다음 필터인 JWTAuthentication으로 가서
		// JWTAuthenFilter가 실행되어 로그인 시도 후 토큰 발행
		
		return http.build(); // 보안 구성 설정 완료
	}
	
	
	
	
}
