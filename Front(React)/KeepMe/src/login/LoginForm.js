import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './LoginForm.module.css'
import { useRecoilState } from 'recoil';

import { userIdState, authState} from '../recoil/Atoms';
export default function LoginForm() {
    const [userRole, setUserRole] = useRecoilState(userIdState);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [auth, setAuth] = useRecoilState(authState);
    const url = process.env.REACT_APP_BACKEND_URL;
    console.log(url)
    
    useEffect(() => {
        const logged = sessionStorage.getItem('userId');
        if(logged){
            navigate('/');
        }
    }, [navigate]);

    let token = "";
    const login = async (e) => {
        e.preventDefault();//폼 제출 시 기본 동작을 막음
        try {
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
                if(userId === 'admin1' || userId === 'admin2'){
                    console.log('setauth',setAuth)
                    setUserRole(userId);
                    navigate('/main');
                }else{
                    setUserRole(userId);
                    console.log('userrole',userId)
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
        <div className={styles.bg}>
            <div className={styles.LoginForm}>
                <h1 className={styles.name}>Login</h1>
                <form onSubmit={login}>
                    <div>
                        <input type='userId' className={styles.id} placeholder='아이디' value={userId} onChange={(e) => setUserId(e.target.value)} />
                    </div>
                    <div>
                        <input type='password' className={styles.password} placeholder='비밀번호' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <button className={styles.login} type="submit">
                            로그인 
                        </button>
                    </div>
                    <div>
                        <button className={styles.join} onClick={joinclick} >
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}