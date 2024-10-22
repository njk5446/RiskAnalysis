import React, { useEffect,useMemo } from "react";
import { Line } from 'react-chartjs-2';
import { useRecoilValue,useSetRecoilState } from "recoil";
import {selectedUserCodeState, socketDataState } from "../recoil/Atoms";
import {
  Chart,
  CategoryScale, // 여기에 'category' 스케일 추가
  LinearScale,    // y축에 필요한 'linear' 스케일
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 필요한 컴포넌트와 스케일을 등록
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const RiskAnalysis = ({}) => {
  const socketData = useRecoilValue(socketDataState); // Recoil 상태 설정
  // const heartbeatData = useRecoilValue(heartbeatState); // 전역 상태에서 데이터 가져오기
  const selectedUserCode = useRecoilValue(selectedUserCodeState);
  const filteredData = useMemo(()=>socketData.filter((data)=>data.usercode === selectedUserCode),[socketData,selectedUserCode]);
  console.log('filteredData',filteredData)
  
  // const userHeartbeat = heartbeatData[selectedUserCode] || []; // 선택된 유저의 데이터
  
  //  // 컴포넌트가 마운트될 때 세션스토리지에서 데이터 읽기
  //  useEffect(() => {
  //   const storedData = sessionStorage.getItem('heartbeatData'); // 세션스토리지에서 데이터 가져오기
  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData); // JSON 문자열을 객체로 변환
  //     setHeartbeatData(parsedData); // Recoil 상태로 설정
  //   }
  // }, [setHeartbeatData]);


  // Recoil에서 가져온 데이터 확인
  // userHeartbeat의 타입과 길이 확인
  // console.log('userHeartbeat:', userHeartbeat, 'Type:', typeof userHeartbeat, 'Length:', userHeartbeat.length);
  // console.log('Recoil 상태 (heartbeatData):', heartbeatData);
  // console.log('선택된 유저 코드 (selectedUserCode):', selectedUserCode);
  // console.log('선택된 유저의 심박수 데이터 (userHeartbeat):', userHeartbeat);

  // 차트가 업데이트될 수 있도록 useEffect로 데이터 변경 감지
  // useEffect(() => {
  //   console.log('차트 데이터 변경 감지 (userHeartbeat):', userHeartbeat);
  //   return
  // }, [userHeartbeat,selectedUserCode]);

  // 데이터가 없는 경우 안내 메시지를 표시하거나, 로딩 상태를 처리
  if (filteredData.length === 0) {
    return <p>데이터가 없습니다. 심박수 데이터를 확인하세요.</p>;
  }
  const chartdata = {
    labels: filteredData.map((item) => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: `User ${selectedUserCode} Heartbeat`,
        data: filteredData.map((item) => item.value),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: '시간',
        },
       
      },
      y: {
        title: {
          display: true,
          text: '심박수',
        },
        min: 0,  // 필요에 따라 최소값 조정
        max: 150, // 필요에 따라 최대값 조정
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `심박수: ${context.raw}`,
        },
      },
    },
  };
  return (
    <Line data={chartdata} options={options} />
  );
};

export default RiskAnalysis;
