import React from 'react'
import { atom } from 'recoil'

export const socketDataState = atom({
  key: 'socketDataState',
  default: [],
});

export const authState = atom({
  key: 'authState',
  default: false,
});
export const selectedUserCodeState = atom({
  key: 'selectedUserCodeState',
  default: null, // 선택된 usercode
});
export const userIdState = atom({
  key: 'userIdState',
  default: '', // 선택된 usercode
});
export const webSocketState = atom({
  key: 'webSocketState',
  default: null,
});
export const wsState = atom({
  key: 'wsState',
  default: null,
});
export const predictionRiskLevelState = atom({
  key: 'predictionRiskLevelState',
  default: null,
});
export const dangerState = atom({
  key: 'dangerState',
  default: null,
});
export const userRoleState = atom({
  key: 'userRoleState',
  default: null,
});
