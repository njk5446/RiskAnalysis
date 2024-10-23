import React, { useEffect, useState } from 'react'
import styles from './MainPage.module.css'
import NaverMap from '../map/NaverMap'
import PCountBar from '../peopleCountBor/PCountBar'
import HeaderForm from '../header/HeaderForm'
import Footer from '../footer/Footer'
import RiskAlert from '../riskAlert/RiskAlert'
import axios from 'axios'
import { useRecoilState, useRecoilValue } from 'recoil';
import { socketDataState, userIdState, authState, wsState } from '../recoil/Atoms'; // WebSocket에서 가져온 심박수 데이터
import OutsideTemperature from '../outsideTemp/OutsideTemperature';
import ShowGraph from '../showgraph/ShowGraph'

export default function MainPage() {
  const [socketData, setSocketData] = useRecoilState(socketDataState);
  const userId = useRecoilValue(userIdState) || sessionStorage.getItem('userId');
  const setAuth = useRecoilValue(authState);
  const [isRisk, setIsRisk] = useState(false);
  const [riskUserCode, setRiskUserCode] = useState(null);
  const [riskUserHeartbeat, setRiskUserHeartbeat] = useState(null);
  const [riskUserTemperature, setRiskUserTemperature] = useState(null);
  const [riskUserLatitude, setRiskUserLatitude] = useState(null);
  const [riskUserLongitude, setRiskUserLongitude] = useState(null);
  const [riskUserWorkDate, setRiskUserWorkDate] = useState(null);
  const [riskUserActivity, setRiskUserActivity] = useState(null);
  const [ws, setWs] = useRecoilState(wsState); // WebSocket 상태
  const [isChart, setIsChart] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  console.log('socketData', socketData);
  console.log("userId 확인: " + userId);

  const fetchInitialData = async () => {
    const url = process.env.REACT_APP_BACKEND_URL;
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }
    try {
      const response = await axios.get(`${url}alllog/workdate`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
      console.log("왜 다 안나와 새로고침했는데 " + response);

      const userdata = response.data.map(item => ({
        userCode: item.userCode,
        heartbeat: item.heartbeat,
        temperature: item.temperature,
        latitude: item.latitude,
        longitude: item.longitude,
        timestamp: item.timestamp,
        riskFlag: item.riskFlag,
        vitalDate: item.vitalDate,
        workDate: item.workDate,
        activity: item.activity,
        outsideTemperature: item.outsideTemperature,
      }));

      setSocketData(prevData => {
        const newData = { ...prevData };
        userdata.forEach(item => {
          const existingData = newData[item.userCode] || {};
          newData[item.userCode] = {
            ...existingData,
            heartbeat: [...(existingData.heartbeat || []), item.heartbeat].slice(-60),
            temperature: [...(existingData.temperature || []), Number(item.temperature)].slice(-60),
            latitude: item.latitude,
            longitude: item.longitude,
            timestamp: new Date().getTime(),
            riskFlag: item.riskFlag,
            vitalDate: item.vitalDate,
            workDate: item.workDate,
            activity: item.activity,
            outsideTemperature: item.outsideTemperature,
          };
        });
        return newData;
      });
      setInitialDataLoaded(true);
    } catch (error) {
      console.error("요청 실패: " + error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (initialDataLoaded && !ws && userId) {
      console.log("initialDataLoaded 상태가 true로 변경됨, WebSocket 연결 시작");
      const url = process.env.REACT_APP_BACKEND_URL;

      const newWs = new WebSocket(`${url}pushservice?userId=${userId}`);
      setWs(newWs);
      newWs.onopen = () => {
        console.log('WebSocket 연결 성공');
      };
      newWs.onmessage = (e) => {
        const newData = JSON.parse(e.data);

        setSocketData((prevData) => ({
          ...prevData,
          [newData.userCode]: {
            heartbeat: [...(prevData[newData.userCode]?.heartbeat || []), newData.heartbeat].slice(-60),
            temperature: [...(prevData[newData.userCode]?.temperature || []), Number(newData.temperature)].slice(-60),
            latitude: newData.latitude,
            longitude: newData.longitude,
            timestamp: new Date().getTime(),
            riskFlag: newData.riskFlag,
            vitalDate: newData.vitalDate,
            workDate: newData.workDate,
            activity: newData.activity,
            outsideTemperature: newData.outsideTemperature,
          }
        }));

        if (newData.riskFlag === 2) {
          setRiskUserCode(newData.userCode);
          setRiskUserHeartbeat(newData.heartbeat);
          setRiskUserTemperature(newData.temperature);
          setRiskUserLatitude(newData.latitude);
          setRiskUserLongitude(newData.longitude);
          setRiskUserWorkDate(newData.workDate);
          setRiskUserActivity(newData.activity);
        }
      };

      return () => {
        if (ws) {
          newWs.close();
          console.log("WebSocket 연결 종료");
        }
      }
    }
  }, [initialDataLoaded, userId, ws]);

  useEffect(() => {
    if (riskUserCode && riskUserHeartbeat && riskUserTemperature && riskUserLatitude && riskUserLongitude && riskUserWorkDate && riskUserActivity) {
      setIsRisk(true);
    }
  }, [riskUserCode, riskUserHeartbeat, riskUserTemperature, riskUserLatitude, riskUserLongitude, riskUserWorkDate, riskUserActivity]);

  const outsideTemperature = Object.values(socketData).map(data => data.outsideTemperature);

  const userCount = Object.keys(socketData).length;

  const normalCount = Object.values(socketData).filter(data => {
    const normal = data.riskFlag === 0;
    console.log('normal', normal);
    return normal;
  }).length;

  const cautionCount = Object.values(socketData).filter(data => {
    const caution = data.riskFlag === 1;
    console.log('caution', caution);
    return caution;
  }).length;

  const dangerCount = Object.values(socketData).filter(data => {
    const danger = data.riskFlag === 2;
    console.log('danger', danger);
    return danger;
  }).length;
  const onClose = () => {
    setIsRisk(false);
  };
  const openchart = () => {
    setIsChart(true);
  };
  const CloseChart = () => {
    setIsChart(false);
  };
  return (
    <div className="flex fixed w-full h-full bg-[#ECF2F4] overflow-hidden">
      <HeaderForm />
      {isRisk && (
        <RiskAlert
          onClose={onClose}
          riskUserCode={riskUserCode}
          riskUserHeartbeat={riskUserHeartbeat}
          riskUserTemperature={riskUserTemperature}
          riskUserLatitude={riskUserLatitude}
          riskUserLongitude={riskUserLongitude}
          riskUserWorkDate={riskUserWorkDate}
          riskUserActivity={riskUserActivity}
        />
      )}
      <OutsideTemperature outsideTemperature={outsideTemperature} />
      <div
        className="flex flex-wrap items-center justify-around absolute w-[22vw] h-[10.5vh] sm:w-[20vw] sm:h-[9.5vh] lg:w-[18vw] lg:h-[8.5vh] left-[79.5vw] top-[3vw] bg-[#abe7dfdc] rounded-[15px] font-bold text-white text-[20px] sm:text-[18px] lg:text-[16px] leading-tight z-10 hover:scale-105 transition-transform"
        onClick={openchart}
      >
        위험 분석 조회
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="auto"
          viewBox="0 -960 960 960"
          width="auto"
          className="w-[30px] h-[50px] sm:w-[25px] sm:h-[45px] lg:w-[20px] lg:h-[40px]"
          fill="#FFFFFF"
        >
          <path d="M49.7-83.65v-113.18h860.6v113.18H49.7Zm34.95-175.09v-296.61h153.18v296.61H84.65Zm211.76 0v-496.61h153.18v496.61H296.41Zm212.76 0v-376.61h153.18v376.61H509.17Zm213 0v-616.61h153.18v616.61H722.17Z" />
        </svg>
      </div>
      {isChart && <ShowGraph onClose={CloseChart} />}
      <div className="fourcontainer">
        <PCountBar
          userCount={userCount}
          normalCount={normalCount}
          cautionCount={cautionCount}
          dangerCount={dangerCount}
        />
      </div>
      <div>
        <NaverMap />
      </div>
      <Footer />
    </div>
  );
}
