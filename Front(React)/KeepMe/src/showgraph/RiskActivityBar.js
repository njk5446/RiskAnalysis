import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import styles from './RiskActivity.module.css'

export default function RiskActivityBar({ barData }) {
    // 색상 배열 정의 (빨주노초파남보)
    const colors = [
        '#5C6BC0', // Soft Indigo
        '#FFAB40', // Soft Orange
        '#66BB6A', // Fresh Green
        '#FF7043', // Soft Red-Orange
        '#42A5F5', // Sky Blue
        '#AB47BC', // Light Purple
        '#FFD54F'  // Light Yellow
    ];

    // 색상을 barData에 추가하는 함수
    const enhancedBarData = barData.map((item, index) => ({
        ...item,
        color: colors[index % colors.length] // 색상 매핑
    }));

    return (
        <div style={{ height: 400 }}>
            <h3 className={styles.title}>활동별 위험 빈도</h3>
            <ResponsiveBar
                data={enhancedBarData}
                keys={['count']}
                indexBy="activity"
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                padding={0.6}
                // 색상 매핑을 위해 바 데이터에서 color 속성을 사용
                colors={d => d.data.color}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '활동',
                    legendPosition: 'middle',
                    legendOffset: 40,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '활동별 위험 빈도수',
                    legendPosition: 'middle',
                    legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#fff"
            />
        </div>
    );
}
