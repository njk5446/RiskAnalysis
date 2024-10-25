//package com.ai;
//
////import java.util.Optional;
//
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Component;
//
//import com.ai.domain.Board;
//import com.ai.domain.User;
//import com.ai.repository.BoardRepository;
//import com.ai.repository.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Component
//@RequiredArgsConstructor
//public class BoardInit implements ApplicationRunner {
//
//    private final UserRepository userRepo;
//    private final BoardRepository boardRepo;
//
//    @Override
//    public void run(ApplicationArguments args) throws Exception {
//
//        // 관리자 사용자 검색
//        User admin = userRepo.findByUserId("admin1")
//                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
//        
//        User manager1 = userRepo.findByUserId("admin2")
//                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
//
//        User manager2 = userRepo.findByUserId("admin3")
//        		.orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
//        
//        User manager3 = userRepo.findByUserId("admin4")
//        		.orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
//        
//        
//        for (int i = 1; i <= 26; i++) {
//            boardRepo.save(Board.builder()
//                    .user(admin)
//                    .title(admin.getUserName() + "의 공지사항")
//                    .content(admin.getUserName() + "의 공지사항 내용")
//                    .userId(admin.getUserId())
//                    .userName(admin.getUserName())
//                    .dept(admin.getDept())
//                    .build());
//            
//            boardRepo.save(Board.builder()
//            		.user(manager1)
//                    .title(manager1.getUserName() + "의 공지사항")
//                    .content(manager1.getUserName() + "의 공지사항 내용")
//                    .userId(manager1.getUserId())
//                    .userName(manager1.getUserName())
//                    .dept(manager1.getDept())
//                    .build());
//            
//            boardRepo.save(Board.builder()
//            		.user(manager2)
//                    .title(manager2.getUserName() + "의 공지사항")
//                    .content(manager2.getUserName() + "의 공지사항 내용")
//                    .userId(manager2.getUserId())
//                    .userName(manager2.getUserName())
//                    .dept(manager2.getDept())
//                    .build());
//            
//            boardRepo.save(Board.builder()
//            		.user(manager3)
//                    .title(manager3.getUserName() + "의 공지사항")
//                    .content(manager3.getUserName() + "의 공지사항 내용")
//                    .userId(manager3.getUserId())
//                    .userName(manager3.getUserName())
//                    .dept(manager3.getDept())
//                    .build());
//        }
//
//        
//        
////      // numbers 배열에 해당하는 사용자 검색 및 게시물 생성
////      String[] numbers = {"1", "12", "13", "14", "15", "16", "17", "18", "19", 
////              "20", "21", "22", "23", "24", "25", "26", "27", 
////              "29", "30", "31", "32", "33", "34", "35", "36", 
////              "37", "38", "39", "40", "41", "42", "43", "44", 
////              "45", "46", "47", "48", "49"};
//        
//
////        // numbers 배열에 해당하는 사용자들 게시물 추가
////        for (String userCode : numbers) {
////            Optional<User> userOptional = userRepo.findByUserCode(userCode);
////            if (userOptional.isPresent()) {
////                User user = userOptional.get();
////                for (int i = 1; i <= 3; i++) {
////                    boardRepo.save(Board.builder()
////                            .user(user)
////                            .title(user.getUserName() + "의 글")
////                            .content(user.getUserName() + "의 내용")
////                            .userId(user.getUserId())
////                            .userName(user.getUserName())
////                            .dept(user.getDept())
////                            .build());
////                }
////            } else {
////                System.out.println("User with code " + userCode + " not found");
////            }
////        }
//    }
//}
//
