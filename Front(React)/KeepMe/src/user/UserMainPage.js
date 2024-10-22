import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { socketDataState, userIdState, wsState, authState } from '../recoil/Atoms'; // WebSocket에서 가져온 심박수 데이터
import styles from './UserMainPage.module.css';

export default function UserMainPage() {
  const [socketData, setSocketData] = useRecoilState(socketDataState);
  const userRole = useRecoilValue(userIdState) || sessionStorage.getItem('userId');
  const [ws, setWs] = useRecoilState(wsState); // WebSocket 상태
  const setAuth = useRecoilValue(authState);

  // userData를 비어있는 배열 또는 초기값으로 정의하여 에러 방지


  useEffect(() => {
    if (!ws && userRole) {

      const url = process.env.REACT_APP_BACKEND_URL;
      const newWs = new WebSocket(`${url}pushservice?userId=${userRole}`);
      setWs(newWs);

      newWs.onopen = () => {
        console.log('WebSocket 연결 성공');
      };

      newWs.onmessage = (e) => {
        const newData = JSON.parse(e.data);
        console.log('newData', newData);
        setSocketData((prevData) => ({
          ...prevData,
          heartbeat: [...(prevData.heartbeat || []), newData.heartbeat].slice(-60),
          temperature: [...(prevData.temperature || []), Number(newData.temperature.toFixed(1))].slice(-60),
          latitude: newData.latitude,
          longitude: newData.longitude,
          timestamp: new Date().getTime(),
          riskFlag: newData.riskFlag,
        }));

      };
    }
    return () => {
      if (ws) {
        ws.onclose = () => {
          console.log('WebSocket 연결 종료');
        };
      }
    };
  }, [setSocketData, userRole, setAuth, ws]);
  const userData = socketData || { heartbeat: [89], temperature: [36.5] };
  console.log('socket data:', socketData); // temperature 배열의 내용을 출력
  console.log('User data:', userData); // temperature 배열의 내용을 출력
  const handleLogout = () => {
    if (window.confirm('정말로 로그아웃 하시겠습니까?')) {
      window.location.href = '/';
      sessionStorage.clear();
      localStorage.removeItem('auth');
    }
  };
  const getRiskFlagText = (riskFlag) => {
    switch (riskFlag) {
      case 0:
        return '정상';
      case 1:
        return '주의';
      case 2:
        return '위험';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}><svg xmlns="http://www.w3.org/2000/svg" height="68px" viewBox="0 -960 960 960" width="70px" fill="#000000"><path d="M626-533q22.5 0 38.25-15.75T680-587q0-22.5-15.75-38.25T626-641q-22.5 0-38.25 15.75T572-587q0 22.5 15.75 38.25T626-533Zm-292 0q22.5 0 38.25-15.75T388-587q0-22.5-15.75-38.25T334-641q-22.5 0-38.25 15.75T280-587q0 22.5 15.75 38.25T334-533Zm146 272q66 0 121.5-35.5T682-393h-52q-23 40-63 61.5T480.5-310q-46.5 0-87-21T331-393h-53q26 61 81 96.5T480-261Zm0 181q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 340q142.38 0 241.19-98.81Q820-337.63 820-480q0-142.38-98.81-241.19T480-820q-142.37 0-241.19 98.81Q140-622.38 140-480q0 142.37 98.81 241.19Q337.63-140 480-140Z"/></svg></div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>홍길동
                <span className={styles.userRole}>도금</span>
              </div>
              <div className={styles.userCompany}>강남건설</div>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
          </button>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.card}>
            <h3>상태</h3>
            {/* <p className={styles.riskFlag}>{getRiskFlagText(userData.riskFlag)}</p> */}
            <p className={styles.riskFlag}>정상</p>
          </div>
          <div className={styles.card}>
            <h3>기기</h3>
            <p className={styles.device}>83%</p>
          </div>
          <div className={`${styles.card} ${styles.fullWidthCard}`}>
            <h3>알림</h3>
            <p className={styles.alarm}>알림이 없습니다.</p>
          </div>
          <div className={`${styles.card} ${styles.fullWidthCard}`}>
            <h3>심박수</h3>
            <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="50px" fill="#c70000"className={styles.heartbeatsvg}><path d="M290-840q57 0 105.5 27t84.5 78q42-54 89-79.5T670-840q89 0 149.5 60.5T880-629q0 15-1.5 29.5T873-570h-62q5-15 7-29.5t2-29.5q0-66-42-108.5T670-780q-51 0-95 31.5T504-660h-49q-26-56-70-88t-95-32q-66 0-108 42.5T140-629q0 15 2 29.5t7 29.5H87q-4-15-5.5-29.5T80-629q0-90 60.5-150.5T290-840Zm-98 450h78q38 42 89.5 91.5T480-186q69-63 120-112.5t89-91.5h79q-42 49-102 108.5T521-144l-41 37-41-37q-85-78-145-137.5T192-390Zm250 60q9 0 16-5.5t10-14.5l61-181 46 68q5 6 11 9.5t14 3.5h310v-60H617l-72-106q-5-7-12-10t-15-3q-9 0-16.5 5.5T491-609l-60 181-47-69q-5-6-10.5-9.5T360-510H50v60h292l72 107q5 7 12.5 10t15.5 3Zm38-153Z"/></svg>
            <p className={styles.heartbeat}>
              {/* {userData.heartbeat && userData.heartbeat.length > 0
                ? `${userData.heartbeat[userData.heartbeat.length - 1]} bpm`
                : 'N/A'} */}
                122 bpm
            </p>
          </div>

          <div className={`${styles.card} ${styles.fullWidthCard}`}>
            {/* 온도 데이터가 있을 때만 출력 */}
            <h3>체온</h3>
            <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#000000"className={styles.temperaturesvg}><path d="M480-120q-75.53 0-128.77-53.24Q298-226.47 298-302q0-49.1 24-91.55Q346-436 388-462v-286q0-38.33 26.76-65.17 26.77-26.83 65-26.83Q518-840 545-813.17q27 26.84 27 65.17v286q42 26 66 68.45T662-302q0 75.53-53.23 128.76Q555.53-120 480-120Zm.12-59q50.88 0 86.38-35.88Q602-250.75 602-302q0-37.81-18-70.41Q566-405 532-420l-20-9v-319q0-13.6-9.2-22.8-9.2-9.2-22.8-9.2-13.6 0-22.8 9.2-9.2 9.2-9.2 22.8v319l-20 9q-34 15-52 47.59-18 32.6-18 70.41 0 51.25 35.62 87.12Q429.24-179 480.12-179ZM480-302Z"/></svg>
            <p className={styles.temperature}>
              {/* {userData.temperature && userData.temperature.length > 0
                ? `${userData.temperature[userData.temperature.length - 1].toFixed(1)} °C`
                : 'N/A'} */}
                36.6 °C
            </p>
            {/* <p>체온 : {userData.temperature}°C</p> */}
          </div>
        </main>

        <footer className={styles.footer}>
          <p>COPYRIGHTⒸ K-Digital7 Project 5Team</p>
        </footer>
      </div>
    </div>
  );
}
