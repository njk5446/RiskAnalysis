package com.ai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// RestController는 Controller에 @ResponseBody가 작동으로 적용되어 return된 값은 JSON 형태로 반환된다
@RestController // JSON 형태로 값을 반환하는데 사용 
public class SecurityController {

	@GetMapping("/user") public String user() { return "user"; }
	@GetMapping("/admin") public String admin() { return "admin"; }
}
