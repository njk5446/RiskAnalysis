import React, { useState } from 'react';
import styles from './Mypage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function MyPage({ onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const url = process.env.REACT_APP_BACKEND_URL;
  const navigation = useNavigate();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': sessionStorage.getItem('token')
  };
  const dept = {
    HR: '인사',
    IT: '전산관리',
    QM: '품질관리',
  };
  const handlePasswordChange = async () => {
    if (newPassword === checkNewPassword) {
      try {
        const response = await axios.post(`${url}mypage/changepw`, {
          password: newPassword
        }, { headers: headers });
        alert('비밀번호가 변경되었습니다.');
        console.log('비밀번호 변경 완료:', response.data);
        // onClose();
      } catch (error) {
        alert('비밀번호 변경 중 오류가 발생했습니다.');
        setNewPassword('');
        setCheckNewPassword('');
        console.log('비밀번호 변경 중 오류가 발생했습니다.', error);
      }
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setNewPassword('');
      setCheckNewPassword('');
    }
  }
  const handleDepartmentChange = async () => {
    console.log('부서 변경:', newDepartment);
    try {
      const response = await axios.post(`${url}mypage/changedept`, {
        dept: newDepartment
      }, { headers: headers });
      console.log('부서 변경 완료:', response.data);
      alert('부서가 변경되었습니다.');
      // onClose();
    } catch (error) {
      console.log('부서 변경 중 오류가 발생했습니다.', error);
      alert('부서 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 탈퇴하시겠습니까?')) {
      try {
        const response = await axios.post(`${url}mypage/deleteacc`,{},{headers: {
          'authorization': sessionStorage.getItem('token'),
          'Content-Type': 'application/json',
        }});
        console.log('회원 탈퇴 처리:', response);
        alert('회원 탈퇴가 완료되었습니다.');
        sessionStorage.removeItem('token');
        navigation('/');
      } catch (error) {
        console.log('회원 탈퇴 중 오류가 발생했습니다.');
      }
    }else{
      console.log('회원 탈퇴가 취소되었습니다.');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.mypage} onClick={e => e.stopPropagation()}>
        <div className={styles.passwordContainer}>
          <button className={styles.closeButton} onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143A52"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg></button>
          <h3>비밀번호 변경</h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
          />
          <input
            type="password"
            value={checkNewPassword}
            onChange={(e) => setCheckNewPassword(e.target.value)}
            placeholder="새 비밀번호 확인"
          />
          <button onClick={handlePasswordChange} className={styles.passwordChangebutton}>변경</button>
        </div>
        <div className={styles.departmentContainer}>
          <h3>부서 변경</h3>
          <select value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)}>
            <option value="HR">{dept.HR}</option>
            <option value="IT">{dept.IT}</option>
            <option value="QM">{dept.QM}</option>
          </select>
          <button onClick={handleDepartmentChange}>변경</button>
        </div>
        <div className={styles.deleteidContainer}>
          <h3>회원 탈퇴</h3>
          <button onClick={handleDeleteAccount}>탈퇴하기</button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
