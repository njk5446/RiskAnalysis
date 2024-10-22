import React, { useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ open, onClose, children }) => {
  const [pressing, setPressing] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  if (!open) return null;

  const handleMouseDown = () => {
    setPressing(true);
    const click = setTimeout(() => {
      setPressing(false); // 0.5초 이상 눌러졌을 때 pressing을 false로 설정
    }, 500);
    setTimeoutId(click);
  };

  const handleMouseUp = () => {
    clearTimeout(timeoutId); // 타이머 지우기
    if (pressing) {
      setPressing(false); // 누름 해제
    } else {
      onClose(); // 누르고 있지 않으면 모달 닫기
    }
  };

  const handleOverlayClick = () => {
    // pressing이 false일 때만 모달을 닫음
    if (!pressing) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick} 
      onMouseDown={handleMouseDown} 
      onMouseUp={handleMouseUp}
    >
      <div 
        className={styles.modalContent} 
        onClick={e => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
      >
        {children}
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default Modal;
