import React, { useState } from 'react';
import axios from 'axios';
import styles from './MypageAuth.module.css';


// 마이페이지 접근 시 비밀 번호 검증
function MyPageAuth({ onSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const url = process.env.REACT_APP_BACKEND_URL;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': sessionStorage.getItem('token')
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 비밀번호 확인 로직 구현
    try {
      const response = await axios.post(`${url}mypage/checkpw`, { password: password }, { headers: headers });
      console.log(response.data);
      if (response.data === '비밀번호 검증 성공') {
        onSuccess(); // 인증 성공 시 MyPage 모달 열기
      }
    } catch (error) {
      if (error.response.status === 401) {
        alert('비밀번호가 올바르지 않습니다.');
        setPassword('');
      }
      else {
        alert('비밀번호 확인 중 오류가 발생했습니다.');
        setPassword('');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="flex flex-col items-center fixed w-full max-w-md h-[250px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffffff] rounded-lg shadow-lg z-40 p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-5 mt-8 ml-2 text-center">비밀번호 확인</h3>
        <form onSubmit={handleSubmit} className="flex flex-row items-center w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="flex-1 h-10 pl-2 rounded border border-black mb-2 mt-2 w-2/3"  // 너비 조정
          />
          <button type="submit" className="w-32 h-10 rounded border-none bg-sky-300 text-white font-bold ml-2">
            확인
          </button>
        </form>
        <button className="absolute top-2 right-2 text-[#143A52] cursor-pointer text-2xl" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143A52">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MyPageAuth;