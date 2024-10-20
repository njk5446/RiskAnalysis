import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js의 필수 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RiskBarChart({ groupedData }) {
  // x축에 표시할 날짜 레이블
  const labels = Object.keys(groupedData); 

  // riskFlag가 1과 2인 데이터를 각각 배열로 추출
  const risk1Data = labels.map(date => groupedData[date].risk1);
  const risk2Data = labels.map(date => groupedData[date].risk2);

  // 차트에 표시할 데이터 구성
  const data = {
    labels,
    datasets: [
      {
        label: '위험',
        backgroundColor:  'rgba(255, 99, 132, 0.5)',
        data: risk2Data,
      },
      {
        label: '주의',
        backgroundColor: 'rgba(54, 162, 235, 0.5)' ,
        data: risk1Data,
      },
    ],
  };

  // 차트 옵션
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        
      },
    },
    scales: {
      x: { title: { display: true, text: 'Work Date' } },
      y: { title: { display: false }, beginAtZero: true },
    },
  };

  return (
  <div style={{width: '100%', height: '100%'}}> 
  <Bar data={data} options={options} />
  </div>
  );
}
