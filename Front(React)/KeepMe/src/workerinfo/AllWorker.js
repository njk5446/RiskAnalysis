import React, { act, useEffect, useState } from 'react';
import axios from 'axios';
import Heat from '../chart/Heat';
import RiskActivityBar from '../chart/RiskActivityBar';


export default function ShowGraph({ onClose }) {
  const [sortedTimes, setSortedTimes] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [userCodes, setUserCodes] = useState([]);
  const [selectedWorkDate, setSelectedWorkDate] = useState('');
  const [selectedUserCode, setSelectedUserCode] = useState('');
  const url = process.env.REACT_APP_BACKEND_URL;
  const token = sessionStorage.getItem('token');

  // userCode 슬롯박스 값 불러오기
  const getUsercodes = async () => {
    const resp = await axios.get(`${url}showgraph/userlist?workDate=${selectedWorkDate}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });
    const userList = resp.data;
    setUserCodes(userList);
  };

  const fetchRiskData = async () => {
    try {
      const resp = await axios.get(`${url}showgraph/risk?userCode=${selectedUserCode}&workDate=${selectedWorkDate}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
      const riskData = resp.data;
      setRiskData(riskData);
      processRiskData(riskData);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const fetchActivityData = async () => {
    try {
      const resp = await axios.get(`${url}showgraph/activity?userCode=${selectedUserCode}&workDate=${selectedWorkDate}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
      const activityData = resp.data;
      setActivityData(activityData);
      processActivityData(activityData);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생: ", error);
    }
  }

  // 위험 및 주의 빈도 조회
  const processRiskData = (data = []) => {
    const timeSlots = {};
    data.forEach(item => {
      const timeKey = item.vitalDate.split(' ')[1].split(':').slice(0, 2).join(':');
      if (!timeSlots[timeKey]) {
        timeSlots[timeKey] = { flag1: 0, flag2: 0 };
      }
      if (item.riskFlag === 1) {
        timeSlots[timeKey].flag1 += 1;
      } else if (item.riskFlag === 2) {
        timeSlots[timeKey].flag2 += 1;
      }
    });

    // 시간대 정렬
    const sortedTimes = Object.keys(timeSlots).sort();
    setSortedTimes(sortedTimes);
    // Nivo 히트맵 형식에 맞게 데이터 변환
    const formattedData = [
      {
        id: "위험", // "위험"을 먼저 배치
        data: sortedTimes.map(time => ({
          x: time,
          y: timeSlots[time].flag2 // "위험" 데이터를 먼저 표시
        }))
      },
      {
        id: "주의", // "주의"를 그 다음에 배치
        data: sortedTimes.map(time => ({
          x: time,
          y: timeSlots[time].flag1 // "주의" 데이터를 다음에 표시
        }))
      }
    ];
    console.log(JSON.stringify(formattedData, null, 2));
    setHeatmapData(formattedData);
    return heatmapData;
  };

  // 활동별 위험 빈도수 조회
  const processActivityData = (data) => {
    const activityMap = {
      'Laying': '누워있기',
      'Sitting': '앉아있기',
      'Standing': '서있기',
      'Walking': '걷기',
      'Walking Upstairs': '계단 오르기',
      'Walking Downstairs': '계단 내려가기',
    }
    const formattedData = data.map(item => ({
      count: item.count,
      activity: activityMap[item.activity] || item.activity,
    }));
    setBarData(formattedData);
    return barData;
  }

  // 작업일자 변경 시 작업자 코드 불러오기
  useEffect(() => {
    if (selectedWorkDate) {
      getUsercodes();
    }
  }, [selectedWorkDate]);

  const handleFetchData = () => {
    if (!selectedWorkDate) {
      alert("작업일자를 먼저 선택해주세요.");
      return;
    }
    if (selectedUserCode) {
      fetchRiskData();
      fetchActivityData();
    } else {
      alert("사번을 선택해주세요.");
    }
  };


  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-40" onClick={onClose}>
      <div className="flex flex-col rounded-lg w-4/5 max-h-full bg-white overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="text-2xl font-bold text-gray-700 text-center mt-5">위험 분석</div>
        <div className="my-5 flex justify-center items-center gap-2">
          {/* 작업일자 슬롯 박스 */}
          <select
            className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#c7722c] focus:border-[#c7722c] transition duration-200"
            value={selectedWorkDate}
            onChange={(e) => setSelectedWorkDate(e.target.value)}
          >
            <option value="">작업일자 선택</option>
            {Array.from({ length: 26 }, (_, i) => {
              const date = new Date(2024, 7, i + 2);
              const formattedDate = date.toISOString().split('T')[0];
              return <option key={formattedDate} value={formattedDate}>{formattedDate}</option>
            })}
          </select>

          <select
            className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#c7722c] focus:border-[#c7722c] transition duration-200"
            value={selectedUserCode}
            onChange={(e) => setSelectedUserCode(e.target.value)}
          >
            <option value="">사번 선택</option>
            {userCodes.map((codeObj, index) => (
              <option key={index} value={codeObj.userCode}>
                {codeObj.userCode}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-[#c7722c] text-white rounded-md hover:bg-[#7e4211] transition duration-300" onClick={handleFetchData}>확인</button>
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto px-4" style={{ maxHeight: 'calc(100% - 180px)' }}>
          <style>
            {`
          /* 스크롤바 숨기기 */
          .hidden-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari 및 Opera에서 스크롤바 숨김 */
          }

          .hidden-scrollbar {
            -ms-overflow-style: none;  /* IE 및 Edge에서 스크롤바 숨김 */
            scrollbar-width: none;  /* Firefox에서 스크롤바 숨김 */
          }
        `}
          </style>
          <div className="hidden-scrollbar overflow-y-auto" style={{ maxHeight: '100%' }}>
            <Heat heatmapData={heatmapData} />
            <RiskActivityBar barData={barData} />
          </div>
        </div>
      </div>
    </div>
  );
}