import React, { useState } from 'react';
import styles from './HeaderForm.module.css';
import Mypage from '../myPage/Mypage';
import MyPageAuth from '../myPage/MypageAuth';
import BoardMain from '../board/BoardMain';
export default function HeaderForm() {
  const [isMypageOpen, setIsMypageOpen] = useState(false);
  const [isMypageAuthOpen, setIsMypageAuthOpen] = useState(false);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const openMypageAuth = () => {
    setIsMypageAuthOpen(true);
  };

  const closeMypageAuth = () => {
    setIsMypageAuthOpen(false);
  };

  const openMypage = () => {
    setIsMypageAuthOpen(false); // 인증 모달을 닫고 마이페이지 열기
    setIsMypageOpen(true);
  };

  const closeMypage = () => {
    setIsMypageOpen(false);
  };

  const handleLogout = () => {
    if(window.confirm('정말로 로그아웃 하시겠습니까?')){
      window.location.href = '/';
      sessionStorage.clear();
      localStorage.removeItem('auth');
    }
  };
  const openBoard = (e) => {
    e.preventDefault();
    setIsBoardOpen(true);
  };
  const closeBoard = () => {
    setIsBoardOpen(false);
  };
  return (
    <div className={styles.headerbar}>
    <p className={styles.title}>Keep me</p>
    <button className={styles.board} onClick={openBoard}>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#323232"className={styles.icon}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/></svg>
      <span className={styles.buttonText}>공지사항</span> {/* 텍스트 추가 */}
    </button>
    {isBoardOpen && <BoardMain onClose={closeBoard} />}
    <button className={styles.mypage} onClick={openMypageAuth}>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#323232"className={styles.icon}><path d="M400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18h14q6 0 12 2-8 18-13.5 37.5T404-360h-4q-71 0-127.5 18T180-306q-9 5-14.5 14t-5.5 20v32h252q6 21 16 41.5t22 38.5H80Zm560 40-12-60q-12-5-22.5-10.5T584-204l-58 18-40-68 46-40q-2-14-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-460l12-60h80l12 60q12 5 22.5 11t21.5 15l58-20 40 70-46 40q2 12 2 25t-2 25l46 40-40 68-58-18q-11 8-21.5 13.5T732-180l-12 60h-80Zm40-120q33 0 56.5-23.5T760-320q0-33-23.5-56.5T680-400q-33 0-56.5 23.5T600-320q0 33 23.5 56.5T680-240ZM400-560q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Zm12 400Z"/></svg>
      <span className={styles.buttonText}>마이페이지</span> {/* 텍스트 추가 */}
    </button>
    {isMypageAuthOpen && <MyPageAuth onSuccess={openMypage} onClose={closeMypageAuth} />}
    {isMypageOpen && <Mypage onClose={closeMypage} />}
    <button className={styles.logout} onClick={handleLogout}>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#323232"className={styles.icon}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
      <span className={styles.buttonText}>로그아웃</span> {/* 텍스트 추가 */}
    </button>
  </div>
  
  );
}
