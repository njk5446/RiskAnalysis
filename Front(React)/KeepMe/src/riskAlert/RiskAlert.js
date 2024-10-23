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
        <div className="fixed top-0 left-0 w-full h-full bg-red-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white w-full sm:w-2/5 md:w-1/4 h-auto p-5 rounded-lg shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col">
                    <div className="flex items-center justify-center mb-5 mt-0 font-nanum">
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 850" width="40px" fill="#e32b2b">
                            <path d="M7.17-94.79 480-910.83 952.83-94.79H7.17Zm150.14-86.47h645.38L480-738.04 157.31-181.26Zm326.02-43.7q17.12 0 29.01-11.98 11.88-11.99 11.88-28.91 0-16.68-12-28.9-12-12.21-29.12-12.21-16.88 0-29 12.18-12.13 12.18-12.13 29.15 0 16.93 12.24 28.8 12.24 11.87 29.12 11.87Zm-40.32-124.85h80.17v-216.04h-80.17v216.04ZM480-459.99Z" />
                        </svg>
                        <h3 className="text-2xl font-semibold mx-2">위험 알림</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 850" width="40px" fill="#e32b2b">
                            <path d="M7.17-94.79 480-910.83 952.83-94.79H7.17Zm150.14-86.47h645.38L480-738.04 157.31-181.26Zm326.02-43.7q17.12 0 29.01-11.98 11.88-11.99 11.88-28.91 0-16.68-12-28.9-12-12.21-29.12-12.21-16.88 0-29 12.18-12.13 12.18-12.13 29.15 0 16.93 12.24 28.8 12.24 11.87 29.12 11.87Zm-40.32-124.85h80.17v-216.04h-80.17v216.04ZM480-459.99Z" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold mb-2 text-red-600 border-b border-black border-opacity-50 w-full">작업자 {userName}({riskUserCode})가 위험 상태입니다.</span>
                    <p className="text-base font-normal mt-0 mb-0 font-nanum">심박수: {riskUserHeartbeat} bpm</p>
                    <p className="text-base font-normal mt-0 mb-0 font-nanum">체온: {riskUserTemperature} ℃</p>
                    <p className="text-base font-normal mt-0 mb-0 font-nanum">위치: {riskUserLatitude}, {riskUserLongitude}</p>
                    <p className="text-base font-normal mt-0 mb-0 font-nanum">작업일자: {riskUserWorkDate}</p>
                    <p className="text-base font-normal mt-0 mb-0 font-nanum">활동: {activity(riskUserActivity)}</p>
                    <button className="self-end mr-1 mb-5 p-1.5 bg-gray-200 rounded cursor-pointer" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>

    )
}
