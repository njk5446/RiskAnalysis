import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '../recoil/Atoms';

export default function Logout({onLogout}) {
    const setAuth = useSetRecoilState(authState);
    const navigate = useNavigate();
    useEffect(() => {
        // 공통 로그아웃 함수를 호출
        if (onLogout) {
          onLogout();
        }
        navigate('/');
    }, [navigate, onLogout]);
    
    useEffect(() => {
      const storedAuth = sessionStorage.getItem('auth');
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
    }, [setAuth]);
  return (
    <div>
     
    </div>
  )
}
