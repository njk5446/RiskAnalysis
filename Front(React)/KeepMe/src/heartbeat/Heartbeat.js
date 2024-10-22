import { useRecoilValue, useSetRecoilState } from "recoil";
import { socketDataState, userNameState } from "../recoil/Atoms";
import { Line } from 'react-chartjs-2';
import styles from './Heartbeat.module.css';
import {
    Chart,
    CategoryScale, // 여기에 'category' 스케일 추가
    LinearScale,    // y축에 필요한 'linear' 스케일
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect } from "react";
import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;

// 필요한 컴포넌트와 스케일을 등록
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
export default function HeartbeatGraph({ userCode, workDate, onClose }) {
    const socketData = useRecoilValue(socketDataState);
    const userName = useRecoilValue(userNameState);
    const userData = socketData[userCode] || { heartbeat: [], temperature: [], activity: [], outsideTemperature: [] };
    const setUserName = useSetRecoilState(userNameState);
    

    useEffect(() => {
        async function fetchUserName() {
            try {
                const resp = await axios.get(`${url}userinfo/username?userCode=${userCode}`);
                setUserName(resp.data);
                console.log("내가 setUserName 밑에 찍은거 " + userName);
            }  catch (error) {
                console.error('사용자 이름을 요청하는데 실패했습니다.' + error);
            }
        }
        fetchUserName();
    }, [userCode]);

    // 최고 심박수와 최저 심박수 계산
    const maxHeartbeat = Math.max(...userData.heartbeat);
    console.log('userData', userData)
    const heartbeatData = {
        labels: userData.heartbeat.map((_, index) => index + 1),
        datasets: [{
            label: 'Heartbeat',
            data: userData.heartbeat,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const temperatureData = {
        labels: userData.temperature.map((_, index) => index + 1),
        datasets: [{
            label: 'Temperature',
            data: userData.temperature,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const heartbeatOptions = {
        scales: {
            y: {
                beginAtZero: false,
                suggestedMin: Math.min(...userData.heartbeat) - 1,
                suggestedMax: Math.max(...userData.heartbeat) + 1
            },
            x: {
                display: false
            }
        },
        animation: {
            duration: 1500,
            easing: 'linear',
        },
        responsive: true,
        maintainAspectRatio: false
    };
    const temperatureOptions = {
        scales: {
            y: {
                beginAtZero: false,
                suggestedMin: Math.min(...userData.temperature) - 1,
                suggestedMax: Math.max(...userData.temperature) + 1
            },
            x: {
                display: false
            }
        },
        animation: {
            duration: 1500,
            easing: 'linear',
        },
        responsive: true,
        maintainAspectRatio: false
    };
    const riskLevelMap = {
        0: '정상',
        1: '주의',
        2: '위험',
    };
    const activity = (activity) => {
        switch(activity){
            case 'Walking':
                return '걷기';
            case 'Standing':
                return '서있기';
            case 'Sitting':
                return '앉아있기';
            case 'Laying':
                return '누워있기';
            case 'Walking Downstairs':
                return '계단 내려가기';
            case 'Walking Upstairs':
                return '계단 오르기';
            default:
                return '알 수 없음';
        }
    };
    console.log('workDate', workDate);
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.container1} onClick={e => e.stopPropagation()}>
                <div className={styles.container2}>
                    <div className={styles.infoTitleContainer}>
                        <p className={styles.infoTitle}>
                            작업자 : {userName}({userCode})
                        </p>
                    <p className={styles.infoCondition}>{riskLevelMap[userData.riskFlag] || '알 수 없음'}</p>
                    <span className={styles.workDate}>작업일자: {workDate}</span>
                    </div>
                    
                    <div className={styles.container3}>
                        <div className={styles.GraphContainer}>
                            <div className={styles.HeartbeatgraphSection}>
                                <Line data={heartbeatData} options={heartbeatOptions} />
                            </div>
                            <div className={styles.TemperaturegraphSection}>
                                <Line data={temperatureData} options={temperatureOptions} />
                            </div>
                        </div>
                        <div className={styles.infoSection}>
                            <div className={styles.heartbeat}>
                                <p className={styles.infoMaxHeartbeat}><h3>최고 심박수</h3><span>{maxHeartbeat.toFixed(0)} bpm</span></p>
                                <p className={styles.infoHeartbeat}><h3>현재 심박수</h3><span>{userData.heartbeat[userData.heartbeat.length - 1].toFixed(0)} bpm</span></p>

                            </div>
                            <div className={styles.temperatureAction}>
                                <p className={styles.infoTemperature}><h2>체온</h2><span>{userData.temperature[userData.temperature.length - 1].toFixed(1)}°C</span></p>
                                <p className={styles.infoAction}><h2>활동</h2><h3 className={styles.infoActionText}>{activity(userData.activity) || '알 수 없음'}</h3></p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className={styles.closeButton} onClick={onClose}>닫기</button>
            </div>
        </div>


    )
}