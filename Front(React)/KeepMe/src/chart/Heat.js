import React, {} from 'react';

import { ResponsiveHeatMap } from '@nivo/heatmap';

export default function Heat({ heatmapData }) {


    return (
        <div className="p-5">
            <h1 className="text-xl font-extrabold text-gray-800 tracking-wide leading-snug">일별 위험 주의 빈도</h1>
            <div className="h-[300px]">
                <ResponsiveHeatMap
                    data={heatmapData}
                    margin={{ top: 15, right: 40, bottom: 100, left: 40 }}
                    valueFormat={value => Math.round(value)} // 소수점 제거
                    indexBy="x"
                    keys={["위험", "주의"]}
                    colors={{
                        type: 'sequential',
                        scheme: 'oranges',
                        minValue: 0,
                        maxValue: Math.max(...heatmapData.flatMap(d => d.data.map(item => item.y)))
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 7,
                        tickRotation: -45,
                        legend: '시간',
                        legendPosition: 'middle',
                        legendOffset: 60
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    hoverTarget="cell"
                    cellOpacity={1}
                    cellBorderWidth={1}
                    cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
                    annotations={[]}
                    // 범례 추가
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            translateX: 550,
                            translateY: 70,
                            length: 300,
                            thickness: 10,
                            tickSize: 5,
                            tickSpacing: 10,
                            tickOverlap: false,
                            tickFormat: value => Math.round(value),
                            title: '일별 위험 및 주의 빈도', // 범례 제목
                            titleAlign: 'start',
                            titleOffset: 4,
                        }
                    ]}
                />

            </div>
        </div>

    );
}