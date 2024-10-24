import React, { useEffect } from 'react'
import axios from 'axios';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { userNameState } from "../recoil/Atoms";
import { riskUserCodeState } from '../Atoms';
export default function RiskAlert({ onClose, riskUserHeartbeat, riskUserTemperature, riskUserLatitude, riskUserLongitude, riskUserWorkDate, riskUserActivity }) {
    const userName = useRecoilValue(userNameState);
    const setUserName = useSetRecoilState(userNameState);
    const url = process.env.REACT_APP_BACKEND_URL;
    const [riskUserCode, setRiskUserCode] = useRecoilState(riskUserCodeState);

    // 이름 가져오기
    useEffect(() => {
        async function fetchUserName() {
            try {
                console.log("** riskUserCode 확인용 **: " + riskUserCode);
                const resp = await axios.get(`${url}userinfo/username?userCode=${riskUserCode}`);
                setUserName(resp.data);
                console.log("내가 setUserName 밑에 찍은거 " + userName);
            } catch (error) {
                console.error('사용자 이름을 요청하는데 실패했습니다.' + error);
            }
        }
        fetchUserName();
    }, [riskUserCode]);

    const activity = (activity) => {
        switch (activity) {
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
        <div className="fixed top-0 left-0 w-full h-full bg-red-500 bg-opacity-30 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white w-full sm:w-3/4 md:w-1/3 lg:w-1/4 p-6 rounded-lg shadow-xl overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center">
                    {/* 헤더 아이콘과 타이틀 */}
                    <div className="flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 850" width="40px" fill="#e32b2b">
                            <path d="M7.17-94.79 480-910.83 952.83-94.79H7.17Zm150.14-86.47h645.38L480-738.04 157.31-181.26Zm326.02-43.7q17.12 0 29.01-11.98 11.88-11.99 11.88-28.91 0-16.68-12-28.9-12-12.21-29.12-12.21-16.88 0-29 12.18-12.13 12.18-12.13 29.15 0 16.93 12.24 28.8 12.24 11.87 29.12 11.87Zm-40.32-124.85h80.17v-216.04h-80.17v216.04ZM480-459.99Z" />
                        </svg>
                        <h3 className="text-3xl font-bold mx-3 text-red-600">위험 알림</h3>
                    </div>

                    {/* 내용 */}
                    <span className="text-lg font-semibold text-red-600 border-b border-red-300 w-full pb-2 mb-4 text-center">작업자 {userName} ({riskUserCode}) 위험 상태입니다.</span>

                    <div className="w-full text-gray-700 space-y-2 mb-6">
                        <p className="text-base"><span className="font-semibold">심박수:</span> {riskUserHeartbeat} bpm</p>
                        <p className="text-base"><span className="font-semibold">체온:</span> {riskUserTemperature} ℃</p>
                        <p className="text-base"><span className="font-semibold">위치:</span> {riskUserLatitude}, {riskUserLongitude}</p>
                        <p className="text-base"><span className="font-semibold">작업일자:</span> {riskUserWorkDate}</p>
                        <p className="text-base"><span className="font-semibold">활동:</span> {activity(riskUserActivity)}</p>
                    </div>

                    {/* 닫기 버튼 */}
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>

    )
}
