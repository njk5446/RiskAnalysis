import React, { useRef, useEffect, useState } from 'react';
import styles from './NaverMap.module.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { socketDataState } from '../recoil/Atoms';
import HeartbeatGraph from '../heartbeat/Heartbeat';
import axios from 'axios';

export default function NaverMap({ onLocationClick }) {
  const [mapsocketData, setMapsocketData] = useRecoilState(socketDataState); // WebSocket 데이터를 가져옴
  const mapRef = useRef(null); // 맵 인스턴스를 저장할 참조 변수
  const markersRef = useRef({}); // 마커 인스턴스를 저장할 객체
  const [selectedUserCode, setSelectedUserCode] = useState(null); // 선택된 사용자 코드 상태
  const [selectedWorkDate, setSelectedWorkDate] = useState(null); // 선택된 사용자 코드 상태
  const { naver } = window; // naver 객체는 Naver Maps API가 로드된 후 접근 가능
  const url = process.env.REACT_APP_BACKEND_URL;

  const socketData = useRecoilValue(socketDataState);
  
  // riskFlag에 따라 CSS 필터를 적용하는 함수
  const getIconStyle = (riskFlag) => {
    switch (riskFlag) {
      case 0: // 정상 상태
        return { filter: 'hue-rotate(0deg) brightness(1.5)' }; // 원래 색상
      case 1: // 경고 상태 (노란색)
        return { filter: 'hue-rotate(280deg) brightness(2.0)' }; // 노란색으로 조정
      case 2: // 위험 상태 (빨간색)
        return { filter: 'hue-rotate(1300deg) brightness(1.0)' }; // 빨간색으로 조정
      default:
        return { filter: 'none' }; // 기본 색상
    }
  };

  // 마커를 생성하는 함수
  const createMarker = (userCode, position, riskFlag, workDate) => {
    // 마커 생성
    const marker = new naver.maps.Marker({
      position,
      icon: {
        url: '/img/worker_normal.png'
      },
      title: `User ${userCode}`,
      workDate: workDate,
    });
    // 마커 클릭 이벤트 등록
    naver.maps.Event.addListener(marker, 'click', (e) => {
      e.domEvent.stopPropagation();
      console.log('Marker clicked:', userCode);
      setSelectedUserCode(userCode); // 선택된 사용자 코드 업데이트
      setSelectedWorkDate(workDate);
      if (onLocationClick) {
        onLocationClick(userCode); // 외부 클릭 처리 함수 호출
      }
    });

    // 마커에 필터 스타일을 적용 (색상 변화를 위해)
    const markerElement = marker.getElement(); // DOM 요소 가져오기
    if (markerElement) {
      Object.assign(markerElement.style, getIconStyle(riskFlag)); // 필터 적용
    }

    return marker;
  };

  // useEffect(() => {
  //   if (selectedUserCode && selectedWorkDate) {
  //     // selectedUserCode와 selectedWorkDate를 기준으로 socketData에서 데이터를 필터링
  //     const userData = socketData[selectedUserCode];

  //     if (userData && userData.workDate === selectedWorkDate) {
  //       // 선택된 유저와 작업일에 맞는 데이터를 찾음
  //       console.log('필터된 데이터: ', userData);

  //       // 여기서 필터된 데이터를 기반으로 그래프나 상태 처리
  //     } else {
  //       console.log('해당 날짜와 유저에 대한 데이터가 없습니다.');
  //     }
  //   }
  // }, [selectedUserCode, selectedWorkDate, socketData]);

  // 맵 초기화
  useEffect(() => {
    const initializeMap = () => {
      const { naver } = window; // naver 객체는 Naver Maps API가 로드된 후 접근 가능
      const mapOptions = {
        center: new naver.maps.LatLng(35.1690556955069, 129.0572919426662), // 맵의 중심 좌표
        zoom: 17, // 줌 레벨
      };
      // 맵을 생성하여 mapRef에 저장
      mapRef.current = new naver.maps.Map('map', mapOptions);
    };

    // 맵이 이미 초기화되지 않았을 경우 초기화
    if (!mapRef.current) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
  }, [mapsocketData]);
  useEffect(() => {
    let animationFrameId;

    const updateMarkers = () => {
      Object.entries(mapsocketData).forEach(([userCode, data]) => {
        if (!userCode || !data.latitude || !data.longitude) {
          console.error(`Invalid position data for user ${userCode}`);
          return;
        }

        const workDate = mapsocketData[userCode].workDate;
        const position = new naver.maps.LatLng(data.latitude, data.longitude);
        const riskFlag = mapsocketData[userCode].riskFlag;

        // 이미 있는 마커를 업데이트하거나 새로운 마커 생성
        if (markersRef.current[userCode]) {
          const marker = markersRef.current[userCode];
          marker.setPosition(position);

          // 아이콘 필터 업데이트
          const markerElement = marker.getElement();
          if (markerElement) {
            Object.assign(markerElement.style, getIconStyle(riskFlag)); // 필터 적용
          }
        } else {
          const newMarker = createMarker(userCode, position, riskFlag, workDate);
          markersRef.current[userCode] = newMarker;
          newMarker.setMap(mapRef.current);
        }
      });
    };

    const animate = () => {
      updateMarkers();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mapsocketData]);

  // 모달 닫기 핸들러
  const handleClose = () => {
    setSelectedUserCode(null);
    setSelectedWorkDate(null);
  };

  return (
    <div>
      <div id="map" className={styles.map} />
      {selectedUserCode && selectedWorkDate && <HeartbeatGraph userCode={selectedUserCode} workDate={selectedWorkDate} onClose={handleClose} />}
    </div>
  );
}
