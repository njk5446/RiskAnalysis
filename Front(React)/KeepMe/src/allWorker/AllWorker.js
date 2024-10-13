import React, { useEffect, useState } from 'react';
import styles from './AllWorker.module.css';
import axios from 'axios';
import RiskBarChart from './RiskBarChart';

export default function AllWorker({ onClose }) {
  const [allWorkerdata, setAllWorkerdata] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const url = process.env.REACT_APP_BACKEND_URL;

  // 데이터를 백엔드에서 가져와서 상태에 저장
  const fetchUserdata = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.get(`${url}alllog`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
      const allWorkerdata = response.data;
      setAllWorkerdata(allWorkerdata);
      console.log('allWorkerdata', allWorkerdata);
      // 데이터를 그룹화하여 가공
      const processedData = processData(allWorkerdata);
      setGroupedData(processedData);
    } catch (error) {
      console.error('Error fetching all worker data:', error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchUserdata();
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M590.51-75.09q-55.75 0-96.16-40.41-40.42-40.41-40.42-96.16t40.48-96.17q40.47-40.41 95.98-40.41 55.87 0 96.28 40.41 40.42 40.42 40.42 96.17t-40.42 96.16q-40.41 40.41-96.16 40.41Zm-.14-99.56q15.79 0 26.47-10.56t10.68-26.59q0-15.79-10.68-26.45t-26.47-10.66q-15.78 0-26.33 10.68-10.54 10.68-10.54 26.46 0 16.03 10.54 26.57 10.55 10.55 26.33 10.55Zm86.69-233.83q-99.56 0-168.97-69.3-69.42-69.31-69.42-168.94 0-99.37 69.36-168.78 69.35-69.41 169.05-69.41 99.44 0 168.85 69.36 69.42 69.36 69.42 168.92 0 99.56-69.37 168.86-69.36 69.29-168.92 69.29Zm.19-99.56q58.68 0 98.61-40.15 39.92-40.14 39.92-98.62 0-58.68-40.04-98.61-40.05-39.93-98.73-39.93-58.68 0-98.73 40.05-40.04 40.04-40.04 98.72 0 58.69 40.21 98.61 40.22 39.93 98.8 39.93Zm-428.32 281q-72.69 0-123.27-50.58-50.57-50.58-50.57-123.13t50.59-123.13q50.59-50.58 123.13-50.58 72.54 0 122.99 50.64 50.46 50.63 50.46 123.01t-50.48 123.07q-50.47 50.7-122.85 50.7Zm-.15-99.57q30.74 0 52.45-21.81 21.7-21.81 21.7-52.43 0-30.63-21.87-52.33-21.88-21.71-52.2-21.71-30.79 0-52.5 21.64t-21.71 52.31q0 30.68 21.69 52.51 21.69 21.82 52.44 21.82Zm341.85 114.83Zm86.5-435.15ZM248.91-400.87Z" /></svg> 일별 위험 및 주의 빈도</div>
        {/* 막대그래프를 표시 */}
        <div className={styles.chartContainer}>
          <RiskBarChart groupedData={groupedData} />
          <div className={styles.closeButton} onClick={onClose}>닫기</div>
        </div>
      </div>
    </div>
  )
}

// 데이터 가공 함수
const processData = (allWorkerdata) => {
  const groupedData = {};

  allWorkerdata.forEach(worker => {
    const { workDate, riskFlag } = worker;
    if (!groupedData[workDate]) {
      groupedData[workDate] = { risk1: 0, risk2: 0 };
    }
    if (riskFlag === 1) {
      groupedData[workDate].risk1 += 1;
    } else if (riskFlag === 2) {
      groupedData[workDate].risk2 += 1;
    }
  });

  return groupedData;
};
