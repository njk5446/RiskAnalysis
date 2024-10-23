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
            } catch (error) {
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
            borderColor: 'rgba(100, 149, 237, 1)',
            backgroundColor: 'rgba(100, 149, 237, 0.2)', 
            tension: 0.1
        }]
    };

    const temperatureData = {
        labels: userData.temperature.map((_, index) => index + 1),
        datasets: [{
            label: 'Temperature',
            data: userData.temperature,
            borderColor: 'rgb(255, 102, 102)',
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

    const riskLevelClass = {
        0: 'bg-green-400 text-white',  // 밝은 초록색
        1: 'bg-orange-400 text-white', // 밝은 오렌지색
        2: 'bg-red-600 text-white',     // 진한 빨간색
    };

    const activity = (activity) => {
        switch (activity) {
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

    const currentRiskLevel = userData.riskFlag || 0; // 기본값 설정

    console.log('workDate', workDate);
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="rounded-lg w-full max-w-xl min-h-[600px] h-3/5 max-h-[500px] overflow-hidden flex flex-col bg-white" onClick={e => e.stopPropagation()}>
                <div className="bg-white p-4 rounded-lg h-full flex flex-col">
                    <div className="flex flex-col mb-2">
                        <p className="text-2xl font-semibold text-gray-800 border-b border-gray-300 text-center pb-1 mb-1">
                            작업자 : <span className="font-bold text-slate-800">{userName}</span> ({userCode})
                        </p>
                        <div className={`flex p-3 rounded-lg ${riskLevelClass[currentRiskLevel]} w-1/6 ml-auto justify-center mt-1 shadow-lg transition-transform `}>
                            <p className="font-sans text-xl font-bold text-white text-center">
                                {riskLevelMap[currentRiskLevel] || '알 수 없음'}
                            </p>
                        </div>
                        <span className="flex items-center text-l mt-1 mb-2 text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 2v2M8 2v2M4 6h16M4 8v12a2 2 0 002 2h12a2 2 0 002-2V8H4z" />
                            </svg>
                            <span className="font-semibold">{`작업일자: ${workDate}`}</span>
                        </span>
                    </div>

                    <div className="flex flex-row mt-2">
                        <div className="flex flex-col flex-1 mr-4">
                            <div className="mb-4">
                                <Line data={heartbeatData} options={heartbeatOptions} />
                            </div>
                            <div>
                                <Line data={temperatureData} options={temperatureOptions} />
                            </div>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="border rounded-lg p-2 mb-3 flex flex-col items-center bg-gray-100 shadow-md">
                                <h3 className="font-sans text-lg font-bold text-gray-800">최고 심박수</h3>
                                <span className="text-xl text-blue-600">{maxHeartbeat.toFixed(0)} bpm</span>
                            </div>
                            <div className="border rounded-lg p-2 mb-3 flex flex-col items-center bg-gray-100 shadow-md">
                                <h3 className="font-sans text-lg font-bold text-gray-800">현재 심박수</h3>
                                <span className="text-xl text-blue-600">{userData.heartbeat.length > 0 ? userData.heartbeat[userData.heartbeat.length - 1].toFixed(0) : 'N/A'} bpm</span>
                            </div>
                            <div className="border rounded-lg p-2 mb-3 flex flex-col items-center bg-gray-100 shadow-md">
                                <h2 className="font-sans text-lg font-bold text-gray-800">체온</h2>
                                <span className="text-xl text-red-600">{userData.temperature.length > 0 ? userData.temperature[userData.temperature.length - 1].toFixed(1) : 'N/A'}°C</span>
                            </div>
                            <div className="border rounded-lg p-2 flex flex-col items-center bg-gray-100 shadow-md">
                                <h2 className="font-sans text-lg font-bold text-gray-800">활동</h2>
                                <h3 className="font-sans text-lg text-gray-600">{activity(userData.activity) || '알 수 없음'}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="self-end mr-2 mb-4 p-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>닫기</button>
            </div>
        </div>


    )
}