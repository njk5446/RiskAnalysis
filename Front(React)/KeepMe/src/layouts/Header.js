import React, { useState } from 'react';
import Mypage from '../mypage/Mypage';
import MyPageAuth from '../mypage/MypageAuth';
import BoardMain from '../board/BoardList';
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
    window.location.href = '/';
    sessionStorage.clear();
    localStorage.removeItem('auth');
  };
  const openBoard = (e) => {
    e.preventDefault();
    setIsBoardOpen(true);
  };
  const closeBoard = () => {
    setIsBoardOpen(false);
  };
  return (
    <div className="flex flex-col items-center justify-center flex-grow absolute w-screen h-[4vh] top-0 bg-white bg-opacity-80">
      <h1 className="absolute left-[2.5vw] font-jura text-[30px] font-bold text-black">
        작업자 위험 예측 분석
      </h1>
      <button
        className="flex flex-col items-center justify-center w-[12vw] h-[2.5vh] absolute left-[45vw] bg-white border-none cursor-pointer text-[#000000b4] font-semibold hover:text-black transition duration-200 ease-in-out"
        onClick={openBoard}
      >
        <span className="text-sm md:text-base font-semibold tracking-wide text-[0.7rem] sm:text-[1.0rem] md:text-[0.8rem] lg:text-[1.2rem]">
          공지사항
        </span>
      </button>
      {isBoardOpen && <BoardMain onClose={closeBoard} />}

      <button
        className="flex flex-col items-center justify-center w-[12vw] h-[2.5vh] absolute left-[65vw] bg-white border-none cursor-pointer text-[#000000b4] font-semibold hover:text-black transition duration-200 ease-in-out"
        onClick={openMypageAuth}
      >
        <span className="font-semibold tracking-wide text-[0.7rem] sm:text-[1.0rem] md:text-[0.8rem] lg:text-[1.2rem]">
          마이페이지
        </span>
      </button>
      {isMypageAuthOpen && <MyPageAuth onSuccess={openMypage} onClose={closeMypageAuth} />}
      {isMypageOpen && <Mypage onClose={closeMypage} />}

      <button
        className="flex flex-col items-center justify-center w-[12vw] h-[2.5vh] absolute left-[85vw] bg-white border-none cursor-pointer text-[#000000b4] font-semibold hover:text-black transition duration-200 ease-in-out"
        onClick={handleLogout}
      >
        <span className="font-semibold tracking-wide text-[0.7rem] sm:text-[1.0rem] md:text-[0.8rem] lg:text-[1.2rem]">
          로그아웃
        </span>
      </button>
    </div>

  );
}


