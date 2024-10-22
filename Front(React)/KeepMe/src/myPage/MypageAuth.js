import React, { useState } from 'react';
import axios from 'axios';
import styles from './MypageAuth.module.css';
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
      if(error.response.status === 401){
        alert('비밀번호가 올바르지 않습니다.');
        setPassword('');
      }
      else{
        alert('비밀번호 확인 중 오류가 발생했습니다.');
        setPassword('');
      }
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.mypageAuth} onClick={e => e.stopPropagation()}>
        <h3>비밀번호 확인</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
          <button type="submit" className={styles.checkButton}>확인</button>
        </form>
          <button className={styles.closeButton} onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143A52"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
      </div>
    </div>
  );
}

export default MyPageAuth;