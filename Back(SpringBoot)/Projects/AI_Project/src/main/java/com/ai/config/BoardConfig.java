package com.ai.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class BoardConfig {
// @EnableSpringDataWebSupport의 pageSerializationMode를 사용하면,
// 페이지네이션의 직렬화 방식을 지정할 수 있다.
// VIA_DTO: Page와 연동된 DTO를 사용해서 지정한 필드 데이터들만 직렬화함
// VIA_PAGE: Page 객체를 직접 직렬화. 기본적인 페이지네이션 메타데이터(CurrentPage, PAgeSie, Total Page, ...)를 포함한 모든 데이터를 직렬화
}
