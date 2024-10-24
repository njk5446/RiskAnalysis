import React, { useState } from 'react';
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
        const response = await axios.post(`${url}mypage/deleteacc`, {}, {
          headers: {
            'authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
          }
        });
        console.log('회원 탈퇴 처리:', response);
        alert('회원 탈퇴가 완료되었습니다.');
        sessionStorage.removeItem('token');
        navigation('/');
      } catch (error) {
        console.log('회원 탈퇴 중 오류가 발생했습니다.');
      }
    } else {
      console.log('회원 탈퇴가 취소되었습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}>
      <div className="relative bg-[#ffffff] rounded-lg w-[450px] h-[600px] p-6 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {/* 타이틀 추가 */}
        <h2 className="text-xl font-bold mb-4 text-left font-sans">마이페이지</h2>
        <div className="justify-center items-center border-b border-black border-opacity-30 w-full h-[210px] mb-4">
          <button className="absolute top-3 right-3 text-[#143A52]" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143A52">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold mb-5 text-left ml-2">비밀번호 변경</h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
            className="w-[250px] h-8 rounded border px-2 mb-2 mx-6"
          />
          <input
            type="password"
            value={checkNewPassword}
            onChange={(e) => setCheckNewPassword(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="w-[250px] h-8 rounded border px-2 mb-4 mx-6"
          />
          <button onClick={handlePasswordChange} className="ml-6 absolute left-[310px] top-[155px] w-[70px] h-[35px] bg-[#4DA6D1] text-white rounded hover:bg-[#143A52] font-bold transition duration-300">
            변경
          </button>
        </div>
        <div className="w-full border-b border-black border-opacity-30 mb-4">
          <h3 className="text-lg font-semibold mb-5 text-left">부서 변경</h3>
          <select value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} className="w-[265px] h-8 rounded border px-2 mb-2 mx-6">
            <option value="HR">{dept.HR}</option>
            <option value="IT">{dept.IT}</option>
            <option value="QM">{dept.QM}</option>
          </select>
          <button
            onClick={handleDepartmentChange}
            className="w-[70px] h-[35px] bg-[#4DA6D1] text-white rounded hover:bg-[#143A52] font-bold transition duration-300">
            변경
          </button>
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-5 text-left">회원 탈퇴</h3>
          <div className="w-full flex justify-center items-center">
            <button onClick={handleDeleteAccount} className="text-white w-[100px] h-[33px] border bg-red-500 rounded hover:bg-red-600 hover:text-white text-opacity-80 font-bold transition duration-300">
              탈퇴하기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyPage;
