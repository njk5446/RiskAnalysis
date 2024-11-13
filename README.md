<div>
  <h2>작업자 위험 예측 분석 웹 서비스 (2024.08.23 ~ 2024.10.08)</h2>
  <br />
  <img src="./images/로그인.png" alt="Project" width="700px" />
  <br />
  <a href="#">
    <img src="https://img.shields.io/badge/GitHub%20Pages-Active-AEF359?&logo=github&logoColor=white" alt="GitHub-Pages" />
  </a>
  <br />
</div>

## 목차
0. **팀원 구성**
1. **웹 서비스 소개**
2. **시스템 아키텍처**
3. **ERD 설계**
4. **유스케이스 다이어그램**
5. **플로우차트**
6. **기술 스택**
7. **주요 기능**
8. **구현 중 어려웠던 점 및 해결방법** 

<br />

## 🤝 팀원 구성

- **문동윤**: 백엔드 개발
- **이창수**: 프론트엔드 개발
- **박동헌**: 데이터 분석

<br />

## 💁🏻‍♂ 웹 서비스 소개 

- 웨어러블 디바이스를 통해 작업자의 생체 신호 및 환경 데이터 수집 
- 수집된 데이터를 실시간으로 분석해 위험을 예측하는 SPA 웹 서비스 구현

<br />

[**🔗 배포된 웹 서비스로 바로가기 Click !**](http://58.235.21.221:3000/) 👈 <br />
<a>(임시 ID: abcd, PW: 11)</a>

> 새 창 열기 방법 : CTRL+click (on Windows and Linux) | CMD+click (on MacOS)

<br />

## 🏗️ 시스템 아키텍처

![시스템 아키텍처](./images/system_architecture.png)

<br />

## 📈 플로우차트 (Flowchart)

<div>
  <h4>로그인/회원가입</h4>
  <img src="./images/RiskAnalysis_Login.drawio.png" alt="로그인/회원가입" width="700px" />
</div>
<div>
  <h4>메인페이지</h4>
  <img src="./images/RiskAnalysis_Main.drawio.png" alt="메인페이지" width="700px" />
</div>

<br />

## ⚙ ERD 설계

![ERD 설계](./images/Risk_Analysis_ERD.png)

<br />

## 📝 유스케이스 다이어그램

![ERD 설계](./images/UseCase.png)

<br />

## 🛠 기술 스택

**Front-end**

- ![React](https://img.shields.io/badge/-React-61DAFB?&logo=react&logoColor=white) ![Version](https://img.shields.io/badge/React%20v18.3.1-blue)
- ![CSS](https://img.shields.io/badge/-CSS-1572B6?&logo=css3&logoColor=white) ![Version](https://img.shields.io/badge/CSS%20v3-1572B6?style=flat-square)
- ![HTML](https://img.shields.io/badge/-HTML-E34F26?&logo=html5&logoColor=white) ![Version](https://img.shields.io/badge/HTML%20v5-E34F26?style=flat-square)

**Back-end**
- ![Java](https://img.shields.io/badge/-Java-E34F26?&logo=java&logoColor=white) ![Version](https://img.shields.io/badge/Java%20v17.0.10-blue)
- ![Spring Boot](https://img.shields.io/badge/-Spring%20Boot-6DB33F?&logo=spring&logoColor=white) ![Version](https://img.shields.io/badge/Spring%20Boot%20v3.3.5-blue)
- ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?&logo=mysql&logoColor=white) ![Version](https://img.shields.io/badge/MySQL%20v8.0.39-blue)
- ![Python](https://img.shields.io/badge/-Python-3776AB?&logo=python&logoColor=white) ![Version](https://img.shields.io/badge/Python%20v3.12.7-blue)
- ![FastAPI](https://img.shields.io/badge/-FastAPI-005571?&logo=fastapi&logoColor=white) ![Version](https://img.shields.io/badge/FastAPI%20v0.95.2-blue)

**AI/ML**

- ![PyTorch](https://img.shields.io/badge/-PyTorch-EE4C2C?&logo=pytorch&logoColor=white) ![Version](https://img.shields.io/badge/PyTorch%20v1.13.0-blue)
- ![Scikit-learn](https://img.shields.io/badge/-Scikit%20Learn-F7931E?&logo=scikit-learn&logoColor=white) ![Version](https://img.shields.io/badge/Scikit%20Learn%20v1.0.2-blue)

**IDE**
- ![Eclipse](https://img.shields.io/badge/-Eclipse-2C2255?&logo=eclipse&logoColor=white) ![Version](https://img.shields.io/badge/Eclipse%20v4.32-blue)
- ![VS Code](https://img.shields.io/badge/-VS%20Code-007ACC?&logo=visual-studio-code&logoColor=white) ![Version](https://img.shields.io/badge/VS%20Code%20v1.95-blue)

**ETC**

- ![Git](https://img.shields.io/badge/-Git-F05032?&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/-GitHub-181717?&logo=github&logoColor=white)

<br />

## 💡 주요 기능
**👉 이미지를 클릭하면 기능 구현 영상을 볼 수 있습니다.**
<table style="width: 100%;">
  <tr>
    <td align="center">
      <a href="https://youtu.be/dsc7zG2_40g?feature=shared">
        <img src="./images/로그인.png" alt="로그인/회원가입" width="300">
      </a>
      <br />
      <strong style="display: block;">로그인/회원가입</strong>
    </td>
    <td style="vertical-align: top; padding-left: 20px;">
      <ul>
        <li>회원가입 아이디 중복 확인 및 비밀번호 검증</li>
        <li>로그인, 로그아웃 시 JWT 토큰 생성 또는 제거</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://youtu.be/CcyLQtlwfi8?feature=shared">
        <img src="./images/작업자실시간모니터링.png" alt="작업자 실시간 모니터링" width="300">
      </a>
      <br />
      <strong style="display: block;">작업자 실시간 모니터링</strong>
    </td>
    <td style="vertical-align: top; padding-left: 20px;">
      <ul>
        <li>위험 예측, 생체 데이터 및 위치 정보 실시간 수신</li>
        <li>작업자 상태와 위험도를 시각적으로 표시</li>
        <li>외부 온도 정보 실시간 업데이트</li>
        <li>작업자 위치를 지도에 표시</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://youtu.be/Ni84VvYxORA?feature=shared">
        <img src="./images/위험예측분석대시보드.png" alt="위험 예측 분석 대시보드" width="300">
      </a>
      <br />
      <strong style="display: block;">위험 예측 분석 대시보드</strong>
    </td>
    <td style="vertical-align: top; padding-left: 20px;">
      <ul>
        <li>일자별, 작업자별 위험 예측 데이터 시각화</li>
        <li>특정 작업자의 해당일자의 시간대별 위험 주의 빈도</li>
        <li>활동별 위험 빈도</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://youtu.be/ZXVSq8vKsf8?feature=shared">
        <img src="./images/공지사항.png" alt="공지사항" width="300">
      </a>
      <br />
      <strong style="display: block;">공지사항</strong>
    </td>
    <td style="vertical-align: top; padding-left: 20px;">
      <ul>
        <li>게시물 검색, 글쓰기, 수정, 삭제</li>
        <li>게시판 페이지네이션</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://youtu.be/CI-VMvWaQaY?feature=shared">
        <img src="./images/마이페이지.png" alt="마이페이지" width="300">
      </a>
      <br />
      <strong style="display: block;">마이페이지</strong>
    </td>
    <td style="vertical-align: top; padding-left: 20px;">
      <ul>
        <li>마이페이지 접 시 비밀번호 검증</li>
        <li>비밀번호 및 부서 변경 기능</li>
        <li>회원탈퇴 기능</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://youtu.be/WCR1UOIg68c?feature=shared">
        <img src="./images/위험알림.png" alt="위험 알림" width="300">
      </a>
      <br />
      <strong style="display: block;">위험 알림</strong>
    </td>
    <td style="vertical-align: top; padding-left: 20px;">
      <ul>
        <li>실시간 위험 예측 데이터를 기반으로 위험 알림 시각화</li>
      </ul>
    </td>
  </tr>
</table>

<br />

## 🔧 구현 중 어려웠던 점 및 해결방법
**동기→비동기 전환:** 
1. RestTemplate을 사용하여 동기식으로 분석 모델에 데이터를 전송할 때 문제가 발생. 
2. 분석 모델은 일정량의 데이터가 쌓여야만 분석이 가능했지만, 동기식 요청에서는 원하는 결과를 얻을 수 없었음.
3. 이후 WebClient를 사용하여 비동기 방식으로 요청을 전송해 필요한 데이터가 쌓일 수 있게 했고, 분석된 결과는 WebSocket을 통해 실시간으로 프론트엔드에 전달할 수 있었음.
  <br />
