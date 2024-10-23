import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const NivoLine = ({ data }) => {
    return (
        <div style={{ height: '400px' }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'X Axis Label',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Y Axis Label',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                enablePoints={true}
                pointSize={10}
                pointColor={{ from: 'color', modifiers: [['brighter', 0.3]] }}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabel="y"
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 40,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.85,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
};

export default NivoLine;