<div>
  <h1>👷‍♂️작업자 위험 예측 분석 웹 서비스</h1>
  <br />
  <img src="./images/로그인.png" alt="Project" width="700px" />
  <br />
  <a href="#">
    <img src="https://img.shields.io/badge/GitHub%20Pages-Active-AEF359?&logo=github&logoColor=white" alt="GitHub-Pages" />
  </a>
  <br />
</div>

## 목차

1. **웹 서비스 소개**
2. **기술 스택**
3. **주요 기능**

<br />

## 💁🏻‍♂ 웹 서비스 소개

&nbsp;&nbsp;웨어러블 디바이스를 통해 작업자의 생체 신호 및 환경 데이터를  
&nbsp;&nbsp;실시간으로 분석해 위험을 예측하는 SPA 웹 서비스 구현

<br />

[**🔗 배포된 웹 서비스로 바로가기 Click !**](http://58.235.21.221:3000/) 👈

> 새 창 열기 방법 : CTRL+click (on Windows and Linux) | CMD+click (on MacOS)

<br />

## 🛠 기술 스택

**Front-end**

- ![React](https://img.shields.io/badge/-React-61DAFB?&logo=react&logoColor=white) ![Version](https://img.shields.io/badge/React%20v18.3.1-blue)

**Back-end**

- ![Python](https://img.shields.io/badge/-Python-3776AB?&logo=python&logoColor=white) ![Version](https://img.shields.io/badge/Python%20v3.12.7-blue)
- ![FastAPI](https://img.shields.io/badge/-FastAPI-005571?&logo=fastapi&logoColor=white) ![Version](https://img.shields.io/badge/FastAPI%20v0.95.2-blue)
- ![Spring Boot](https://img.shields.io/badge/-Spring%20Boot-6DB33F?&logo=spring&logoColor=white) ![Version](https://img.shields.io/badge/Spring%20Boot%20v3.3.5-blue)
- ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?&logo=mysql&logoColor=white) ![Version](https://img.shields.io/badge/MySQL%20v8.0.39-blue)
- ![Java](https://img.shields.io/badge/-Java-E34F26?&logo=java&logoColor=white) ![Version](https://img.shields.io/badge/Java%20v17.0.10-blue)

**AI/ML**

- ![PyTorch](https://img.shields.io/badge/-PyTorch-EE4C2C?&logo=pytorch&logoColor=white) ![Version](https://img.shields.io/badge/PyTorch%20v1.13.0-blue)
- ![Scikit-learn](https://img.shields.io/badge/-Scikit%20Learn-F7931E?&logo=scikit-learn&logoColor=white) ![Version](https://img.shields.io/badge/Scikit%20Learn%20v1.0.2-blue)

**ETC**

- ![Git](https://img.shields.io/badge/-Git-F05032?&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/-GitHub-181717?&logo=github&logoColor=white)

<br />

## 💡 주요 기능
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
        <li>웹소켓으로 위험 예측 데이터, 생체 데이터, 위치 데이터를 실시간 수신</li>
        <li>작업자 상태와 위험도 시각화</li>
        <li>외부 온도 업데이트</li>
        <li>네이버맵 API를 활용한 작업자 위치 표시</li>
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
        <li>셀렉트 박스로 작업일자와 작업자 선택</li>
        <li>nivo의 Heatmap, Bar 차트 활용</li>
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
        <li>페이지네이션 기능</li>
        <li>제목, 내용, 이름으로 검색 필터링 제공</li>
        <li>사용자는 자신의 게시물만 수정 및 삭제 가능</li>
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
        <li>마이페이지 접속 시 비밀번호 검증</li>
        <li>비밀번호 및 부서 변경 기능</li>
        <li>회원탈퇴 기능</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://youtu.be/CI-VMvWaQaY?feature=shared">
        <img src="./images/위험알림.png" alt="위험 알림" width="300">
      </a>
      <br />
      <strong style="display: block;">위험 알림</strong>
    </td>
    <td style="vertical-align: top; padding-left: 20px;">
      <ul>
        <li>웹소켓 수신 위험 예측 데이터 기반으로 위험 알림 시각화</li>
      </ul>
    </td>
  </tr>
</table>

<br />
