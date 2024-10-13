import React from 'react';
import { useRecoilValue } from 'recoil';
import { socketDataState } from '../recoil/Atoms';

export default function TemperatureDisplay({ userCode }) {
  const socketData = useRecoilValue(socketDataState);
  const temperature = socketData[userCode]?.temperature;

  return (
    <div>
      <h3>Temperature</h3>
      <p>{temperature ? temperature.toFixed(1) : 'N/A'}°C</p>
    </div>
  );
}