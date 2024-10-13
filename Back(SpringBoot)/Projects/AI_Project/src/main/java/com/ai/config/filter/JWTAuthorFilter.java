package com.ai.config.filter;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ai.domain.User;
import com.ai.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

// Authorization: 특정 기능을 권한을 가진 사용자(Admin)만 사용 가능하도록 권한을 부여하는 것
@RequiredArgsConstructor
public class JWTAuthorFilter extends OncePerRequestFilter{
	// OncePerRequestFilter: 하나의 요청은 하나의 필터만 거친다. 	
	// 여러 요청이 들어오는 중복 처리를 방지하기 위해서(보안 취약점 방지)
	// ex) 권한 페이지에 권한 있는 사용자가 처음 접근할때만 해당 필터를 거치고 다시는 이 필터를 거치지않게함
	private final UserRepository userRepo;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, 
			HttpServletResponse response, FilterChain filterChain)
			throws IOException, ServletException {
		// 요청 헤더에 있는 Authorization을 srcToken에 저장
		String srcToken = request.getHeader("Authorization"); 
		if (srcToken == null || !srcToken.startsWith("Bearer ")) {
			// srcToken이 존재하지않거나 Bearer로 시작하지 않으면 해당 필터를 바로 통과
			filterChain.doFilter(request, response);
			// 중요: 로그인시 JWTAuthenFilter가 필요한데 필터체인 순서상,
			// JWTAuthorFilter가 먼저 실행되는데 헤더에 토큰이 없으니까
			// doFilterChain으로 다음 필터인 JWTAuthentication으로 가서
			// JWTAuthenFilter가 실행되어 로그인 시도 후 토큰 발행
			return; // 토큰 없으니까 이후 처리과정 수행하지 않음
		}

		// 토큰이 존재하면 순수한 JWT 토큰만 추출
		String jwtToken = srcToken.replace("Bearer ", ""); // 앞에 Bearer 제거
		
		// 이후부턴 토큰이 존재하니까 토큰 검증 밑 토큰의 정보를 가져오는 과정
		try {
			// 토큰에서 사용자명(아이디) 추출
			String username = JWT.require(Algorithm.HMAC256("com.ai.project"))
								 .build()
								 .verify(jwtToken)
								 .getClaim("userId")
								 .asString();
			
			// 사용자 조회: DB에 해당 사용자 아이디 존재 여부 확인
			// Optional<User> opt: DB의 해당 ID(username)값이 있는 객체를 opt에 저장
			// Optional은 null값도 저장가능
			Optional<User> opt = userRepo.findByUserId(username); 
			// 확인 후 해당 아이디가 존재하지 않으면 다음 필터(로그인 인증)를 진행
			if(!opt.isPresent()) {
				filterChain.doFilter(request, response);
				return; // DB에 해당 아이디 없으니까 이후 처리과정 수행하지 않음
			}
			
			// DB에 토큰에 저장된 아이디가 존재하면 해당 사용자 정보를 findUser에 저장
			User findUser = opt.get();
			
			// 사용자 정보를 UserDetails 타입의 객체로 생성 (해당 User는 스프링시큐리티 내장 객체이며 UserDetails를 상속받음)
			// 인증된 사용자의 정보를 담기 위해서 사용된다
			org.springframework.security.core.userdetails.
			User user = new org.springframework.security.core.userdetails.User(
					findUser.getUserId(), findUser.getPassword(),
					AuthorityUtils.createAuthorityList(findUser.getRole().toString())) ;
			// AuthorityUtils.createAuthorityList: 사용자의 권한을 GrantedAuthoriy 객체로 변환해서 반환 
			
			//Authentication 객체를 생성: 아이디, 비밀번호(null:표시되면안됨), Role(사용자 권한)
			Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
			
			// 세션에 등록
			SecurityContextHolder.getContext().setAuthentication(auth);
		} catch (TokenExpiredException e) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰이 검증 오류.");
		}

			
		// 다음 필터로 요청 전달(SecurityConfig에 addFilter 정의한 순서대로) 
		filterChain.doFilter(request, response);
		// OncePerRequestFilter는 마지막 필터에 doFilter를 적어놔도 이후에 처리할 필터는,
		// 없기 때문에 마지막 필터를 처리하고 응답을 클라이언트에 반환함
	}	
}

// 2단계 검증을 거치는 이유:
// 1. 보안강화: 토큰이 존재해도 잘못된 사용자나 만료된 토큰의 경우를 보호
// 2. 사용자 정보의 일관성 유지: DB와 토큰간의 동기화가 맞지 않을 수 있음, 불일치 문제 해결 
