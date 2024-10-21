import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ShowGraph.module.css';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';


export default function ShowGraph({ onClose }) {
  const [riskData, setRiskData] = useState([]);
  const [scatterData, setScatterData] = useState([]); // heatmapData 상태 추가
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
      setScatterData(processedData);  // heatmapData 업데이트
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const processRiskData = (data = []) => {
    const scatterData = [
      {
        id: 'RiskFlag 1',
        data: [],
      },
      {
        id: 'RiskFlag 2',
        data: [],
      }
    ];

    data.forEach(item => {
      const date = new Date(item.vitalDate);
      const minutes = date.getMinutes(); // 분 단위로 추출
      const hour = date.getHours(); // 시간 단위로 추출
      const time = `${hour}:${minutes < 10 ? '0' : ''}${minutes}`; // HH:mm 형식으로 시간 변환

      // 해당 riskFlag의 데이터 배열에 추가
      if (item.riskFlag === 1) {
        scatterData[0].data.push({ x: time, y: 1 });
      } else if (item.riskFlag === 2) {
        scatterData[1].data.push({ x: time, y: 2 });
      }
    });

    return scatterData;
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
          <ResponsiveScatterPlot
            data={scatterData} // 가공된 데이터를 전달
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }} // x축을 점 단위로 표시 (시간대별)
            yScale={{ type: 'linear', min: 0, max: 2 }} // y축은 riskFlag 1과 2를 표현
            axisBottom={{
              orient: 'bottom',
              legend: 'Time',
              legendPosition: 'middle',
              legendOffset: 40,
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
            }}
            axisLeft={{
              orient: 'left',
              legend: 'Risk Flag',
              legendPosition: 'middle',
              legendOffset: -40,
              tickSize: 5,
              tickPadding: 5,
            }}
            colors={{ scheme: 'nivo' }} // 색상 스킴
            pointSize={10} // 점 크기
            pointColor={{ from: 'serieColor' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableGridX={false} // x축 그리드 비활성화
            enableGridY={true} // y축 그리드 활성화
            animate={true}
          />
        </div>
      </div>
    </div>
  );
}
