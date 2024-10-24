import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './LoginForm.module.css'
import { useRecoilState } from 'recoil';
import constructionImage from './construction1.jpg'

import { userIdState, authState, userRoleState, wsState} from '../recoil/Atoms';
export default function LoginForm() {
    const [userRole, setUserRole] = useRecoilState(userRoleState);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [ws, setWs] = useRecoilState(wsState);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [auth, setAuth] = useRecoilState(authState);
    const url = process.env.REACT_APP_BACKEND_URL;
    console.log(url)
    
    let token = "";
    const login = async (e) => {
        e.preventDefault();//폼 제출 시 기본 동작을 막음
        try {
            console.log("요청 시작: " + url);
            const response = await axios.post(`${url}login`, 
                {
                  userId,
                  password,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  }
                }
              );
            if (response.status === 200) {//서버가 성공적인 응답을 반환했는지 확인, HTTP 상태 코드 200은 성공을 의미
                token = response.headers.get("Authorization");
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("token", token);
                setAuth(true);
                console.log(response.data.role);
                const role = response.data.role;
                if (role.includes('ROLE_ADMIN')){
                    console.log('userROLE',role)
                    setUserRole(role);
                    navigate('/main');
                }else if (role.includes('ROLE_USER')) {
                    console.log('userRole',userRole)
                    setUserRole(role);
                    navigate('/user');
                }
            } else {
                console.error('Login Failed');
                alert('아이디와 비밀번호를 확인해주세요.')
            }
        } catch (error) {
            console.error('Login Failed');
            alert('아이디와 비밀번호를 확인해주세요.')
        }
    }

   
    const joinclick = () => {
        navigate('/signup')
    }

    return (
        <div className="bg-cover bg-center w-screen h-screen" style={{ backgroundImage: `url(${constructionImage})` }}>
        <h1 className="absolute top-12 left-1/2 transform -translate-x-1/2 font-inter font-bold text-4xl text-black text-center">
            작업자 위험 예측 분석
        </h1>
        <div className="fixed w-[90%] max-w-[400px] h-[50vh] min-h-[500px] top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ecf2f4c7] rounded-lg shadow-lg z-10 flex flex-col items-center p-4">
            <h1 className="text-white text-4xl font-bold mb-6 text-center mt-10">
                Login
            </h1>
            <form onSubmit={login} className="flex flex-col items-center">
                <div className="mt-4">
                    <input
                        type="text"
                        className="w-[300px] h-[50px] rounded-lg border-none bg-white px-2 text-black text-lg placeholder:text-black/60"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div className="mt-4 mb-4">
                    <input
                        type="password"
                        className="w-[300px] h-[50px] rounded-lg border-none bg-white px-2 text-black text-lg placeholder:text-black/60"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mt-8">
                    <button className="w-[140px] h-[50px] bg-[#143A52] rounded-lg border-none text-white text-lg hover:text-white hover:bg-[#0d2a3a] transition-all duration-300 mr-2" type="submit">
                        로그인
                    </button>
                    <button className="w-[140px] h-[50px] bg-[#143A52] rounded-lg border-none text-white text-lg hover:text-white hover:bg-[#0d2a3a] transition-all duration-300 ml-2" onClick={joinclick}>
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}