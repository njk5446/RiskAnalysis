import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ShowGraph.module.css';
import { ResponsiveHeatMap } from '@nivo/heatmap';

export default function ShowGraph({ onClose }) {
  const [riskData, setRiskData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]); // heatmapData 상태 추가
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
      console.log("riskData 확인: " + riskData);
      const processedData = processRiskData(riskData);
      console.log("processedData 확인: " + processedData);
      setHeatmapData(processedData);  // heatmapData 업데이트
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    console.log("heatmapData가 업데이트되었습니다:", heatmapData);
  }, [heatmapData]);

  const processRiskData = (data = []) => {
    const timeMap = {};

    data.forEach(({ vitalDate, riskFlag }) => {
      if (riskFlag === 0) return; // riskFlag 0이면 무시
      const formattedDate = vitalDate.replace(' ', 'T');

      const dateObj = new Date(formattedDate + 'Z');
      dateObj.setHours(dateObj.getHours() + 5);
      const hour = dateObj.getHours().toString().padStart(2, '0');
      // const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      const timeKey = `${hour}:00`;

      if (!timeMap[timeKey]) {
        timeMap[timeKey] = { time: timeKey, risk1: 0, risk2: 0 };
      }

      if (riskFlag === 1) {
        timeMap[timeKey].risk1 += 1;
      } else if (riskFlag === 2) {
        timeMap[timeKey].risk2 += 1;
      }
    });

    console.log("최종확인까지도 오면?");
    return Object.values(timeMap);
  };

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
    } else {
      alert("사번을 선택해주세요.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>일별 위험 히트맵</div>
        <div>
          {/* 작업일자 슬롯 박스 */}
          <select
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

          {/* 사용자 코드 슬롯박스 */}
          <select
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
          <button onClick={handleFetchData}>확인</button>
        </div>

        <div style={{ height: '400px' }}>
          <ResponsiveHeatMap
            data={heatmapData}
            keys={['risk1', 'risk2']} // riskFlag 1, 2에 대한 데이터 키
            indexBy="time" // 시간대를 인덱스로 사용
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            colors={{ type: 'sequential', scheme: 'reds' }} // 연속적인 색상 스케일 사용
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              legend: '시간대',
              legendPosition: 'middle',
              legendOffset: 32
            }}
            axisLeft={{
              orient: 'left',
              legend: '리스크 수준',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            cellOpacity={1}
            cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#2c998f',
                size: 4,
                padding: 1,
                stagger: true
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
