import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ShowGraph.module.css';
import { ResponsiveHeatMap } from '@nivo/heatmap';

export default function ShowGraph({ onClose }) {
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
      processRiskData(riskData);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const processRiskData = (data = []) => {
    // 시간대별로 데이터 정리
    const timeSlots = {};
    data.forEach(item => {
      const timeKey = item.vitalDate.split(' ')[1].split(':').slice(0, 2).join(':');
      if (!timeSlots[timeKey]) {
        timeSlots[timeKey] = { 주의: 0, 위험: 0 };
      }
      if (item.riskFlag === 1) {
        timeSlots[timeKey].주의 += 1;
      } else if (item.riskFlag === 2) {
        timeSlots[timeKey].위험 += 1;
      }
    });

    // 시간대 정렬
    const sortedTimes = Object.keys(timeSlots).sort();
    
    // Nivo 히트맵 형식에 맞게 데이터 변환
    const formattedData = sortedTimes.map(time => ({
      id: time,
      주의: timeSlots[time].주의,
      위험: timeSlots[time].위험
    }));

    console.log(JSON.stringify(formattedData, null, 2));
    setHeatmapData(formattedData);
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
        <div className={styles.title}>일별 조회</div>
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

        <div style={{ height: '300px' }}>
          <h1>일별 위험 빈도</h1>
          <ResponsiveHeatMap
            data={heatmapData}
            margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
            valueFormat={value => Math.round(value)} //소수점 제거
            axisTop={{ orient: 'top', tickSize: 5, tickPadding: 5, tickRotation: -45, legend: '시간', legendOffset: 36 }}
            axisRight={null}
            axisBottom={null}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '위험단계',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            colors={{
              type: 'sequential',
              scheme: 'blues',
              minValue: 0,
              maxValue: Math.max(...heatmapData.flatMap(d => [d.주의, d.위험]))
            }}
            emptyColor="#555555"
            hoverTarget="cell"
            cellOpacity={1}
            cellBorderWidth={1}
            cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
            legends={[
              {
                anchor: 'bottom',
                translateX: 0,
                translateY: 30,
                length: 400,
                thickness: 8,
                direction: 'row',
                tickPosition: 'after',
                tickSize: 3,
                tickSpacing: 4,
                tickOverlap: false,
                tickFormat: '>-.2s',
                title: '위험 빈도',
                titleAlign: 'start',
                titleOffset: 4
              }
            ]}
            tooltip={({ xKey, yKey, value }) => (
              <div style={{
                background: 'white',
                padding: '9px 12px',
                border: '1px solid #ccc',
              }}>
                <strong>{yKey}</strong>: {value} 건 ({xKey})
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}