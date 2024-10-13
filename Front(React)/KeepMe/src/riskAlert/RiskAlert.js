import React from 'react'
import styles from './RiskAlert.module.css'
export default function RiskAlert({ onClose, riskUserCode, riskUserHeartbeat, riskUserTemperature, riskUserLatitude, riskUserLongitude, riskUserWorkDate, riskUserActivity }) {
    const activity = (activity) => {
        switch(activity){
            case 'Walking':
                return '걷는 중';
            case 'Standing':
                return '서있음';
            case 'Sitting':
                return '앉아있음';
            case 'Laying':
                return '누워있음';
            case 'Walking Downstairs':
                return '계단 내려가는 중';
            case 'Walking Upstairs':
                return '계단 오르는 중';
            default:
                return '알 수 없음';
        }
    };
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    <h3><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 850" width="40px" fill="#e32b2b"><path d="M7.17-94.79 480-910.83 952.83-94.79H7.17Zm150.14-86.47h645.38L480-738.04 157.31-181.26Zm326.02-43.7q17.12 0 29.01-11.98 11.88-11.99 11.88-28.91 0-16.68-12-28.9-12-12.21-29.12-12.21-16.88 0-29 12.18-12.13 12.18-12.13 29.15 0 16.93 12.24 28.8 12.24 11.87 29.12 11.87Zm-40.32-124.85h80.17v-216.04h-80.17v216.04ZM480-459.99Z"/></svg>위험 알림<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 850" width="40px" fill="#e32b2b"><path d="M7.17-94.79 480-910.83 952.83-94.79H7.17Zm150.14-86.47h645.38L480-738.04 157.31-181.26Zm326.02-43.7q17.12 0 29.01-11.98 11.88-11.99 11.88-28.91 0-16.68-12-28.9-12-12.21-29.12-12.21-16.88 0-29 12.18-12.13 12.18-12.13 29.15 0 16.93 12.24 28.8 12.24 11.87 29.12 11.87Zm-40.32-124.85h80.17v-216.04h-80.17v216.04ZM480-459.99Z"/></svg></h3>
                    <span>작업자 {riskUserCode}(이)가 위험 상태입니다.</span>
                    <p>심박수: {riskUserHeartbeat} bpm</p>
                    <p>체온: {riskUserTemperature} ℃</p>
                    <p>위치: {riskUserLatitude}, {riskUserLongitude}</p>
                    <p>작업일: {riskUserWorkDate}</p>
                    <p>활동: {activity(riskUserActivity)}</p>
                    <button className={styles.closeButton} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    )
}
