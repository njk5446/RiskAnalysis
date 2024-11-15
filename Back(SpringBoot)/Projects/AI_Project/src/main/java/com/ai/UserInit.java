//package com.ai;
//
//import java.util.HashSet;
//import java.util.Random;
//import java.util.Set;
//
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import com.ai.domain.Dept;
//import com.ai.domain.Gender;
//import com.ai.domain.Region;
//import com.ai.domain.Role;
//import com.ai.domain.User;
//import com.ai.repository.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Component
//@RequiredArgsConstructor
//public class UserInit implements ApplicationRunner{
//    private final UserRepository userRepo;
//    private final PasswordEncoder passwordEnc;
//
//    private static final Random RANDOM = new Random();
//    private static final Set<String> GENERATED_NAMES = new HashSet<>(); // 중복 검사를 위한 집합
//
//    // Generate a unique userName with a fixed set of names
//    public static String generateUniqueUserName() {
//        String userName;
//        do {
//            userName = generateRandomUserName();
//        } while (GENERATED_NAMES.contains(userName)); // 중복되는 이름이 있으면 다시 생성
//
//        GENERATED_NAMES.add(userName); // 생성된 이름을 집합에 추가
//        return userName;
//    }
//
//    // Generate a random userName with a fixed set of names
//    private static String generateRandomUserName() {
//        String[] names = {
//            "손흥민", "이강인", "황희찬", "기성용", "정우영",
//            "이청용", "구자철", "이동국", "김신욱", "장현수",
//            "김민재", "김진수", "박지수", "황인범", "정우영",
//            "손준호", "이재성", "김영권", "이용", "박주호",
//            "황재균", "이승우", "김문환", "이기제", "김태환",
//            "황의조", "김호남", "이상호", "이기영", "정승현",
//            "이동현", "문선민", "김보경", "윤석영", "이명주",
//            "김지현", "이호준", "정재용", "이호익", "김보경",
//            "이승우", "조현우", "이광연", "박성배", "김영빈"
//        };
//        return names[RANDOM.nextInt(names.length)];
//    }
//    
//	int[] numbers = {1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
//			23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 
//			39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49};
//
//
//    @Override
//    public void run(ApplicationArguments args) throws Exception {
//        // 현재 날짜를 생년월일로 지정
//        // 실행 시 계정 추가
//
//        // 관리자용
//        userRepo.save(User.builder()
//                  .userCode("5555")
//                  .userId("abcd")
//                  .password(passwordEnc.encode("11"))
//                  .userName("관리자")
//                  .role(Role.ROLE_ADMIN)
//                  .dept(Dept.IT)
//                  .region(Region.HQ)
//                  .gender(Gender.M)
//                  .build()  
//        );
//    	
//        // 관리자용
//        userRepo.save(User.builder()
//                  .userCode("1111")
//                  .userId("admin1")
//                  .password(passwordEnc.encode("111111"))
//                  .userName("이찬희")
//                  .role(Role.ROLE_ADMIN)
//                  .dept(Dept.IT)
//                  .region(Region.HQ)
//                  .gender(Gender.M)
//                  .build()  
//        );
//        
//        userRepo.save(User.builder()
//                .userCode("2222")
//                .userId("김화영")
//                .password(passwordEnc.encode("11"))
//                .userName("관리자2")
//                .role(Role.ROLE_ADMIN)
//                .dept(Dept.IT)
//                .region(Region.HQ)
//                .gender(Gender.M)
//                .build()  
//      );
//        
//        userRepo.save(User.builder()
//                .userCode("3333")
//                .userId("admin3")
//                .password(passwordEnc.encode("11"))
//                .userName("문동윤")
//                .role(Role.ROLE_ADMIN)
//                .dept(Dept.IT)
//                .region(Region.HQ)
//                .gender(Gender.M)
//                .build()  
//      );
//        
//        userRepo.save(User.builder()
//                .userCode("4444")
//                .userId("admin4")
//                .password(passwordEnc.encode("11"))
//                .userName("리버풀")
//                .role(Role.ROLE_ADMIN)
//                .dept(Dept.IT)
//                .region(Region.HQ)
//                .gender(Gender.M)
//                .build()  
//      );
//      
//        for (int i : numbers) {
//            userRepo.save(User.builder()
//                  .userCode(String.valueOf(i))
//                  .userId("u"+i)
//                  .password(passwordEnc.encode("11"))
//                  .userName(generateUniqueUserName()) // Ensure unique user name
//                  .role(Role.ROLE_USER)
//                  .dept(Dept.IT)
//                  .region(Region.HQ)
//                  .gender(Gender.M)
//                  .build()  
//            );
//        }
//    }
//}
