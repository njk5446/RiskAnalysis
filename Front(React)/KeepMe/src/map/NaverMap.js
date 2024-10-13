import React, { useRef, useEffect, useState } from 'react';
import styles from './NaverMap.module.css';
import { useRecoilState } from 'recoil';
import { socketDataState } from '../recoil/Atoms';
import HeartbeatGraph from '../heartbeat/Heartbeat';
import axios from 'axios';

export default function NaverMap({ onLocationClick }) {
  const [mapsocketData, setMapsocketData] = useRecoilState(socketDataState); // WebSocket 데이터를 가져옴
  console.log('지도에서 받아온 데이터', mapsocketData);
  const mapRef = useRef(null); // 맵 인스턴스를 저장할 참조 변수
  const markersRef = useRef({}); // 마커 인스턴스를 저장할 객체
  const [selectedUserCode, setSelectedUserCode] = useState(null); // 선택된 사용자 코드 상태
  const [selectedWorkDate, setSelectedWorkDate] = useState(null); // 선택된 사용자 코드 상태
  const { naver } = window; // naver 객체는 Naver Maps API가 로드된 후 접근 가능
  const url = process.env.REACT_APP_BACKEND_URL;

  const getIconUrl = (riskFlag) => {
    switch (riskFlag) {
      case 0:
        return '/img/normal.png'; // 정상 상태일 때
      case 1:
        return '/img/caution (2).png'; // 위험 상태일 때
      case 2:
        return '/img/danger.png'; // 경고 상태일 때 (필요에 따라 이미지 변경)
      default:
        return '/img/normal.png'; // 기본 이미지 (예외 처리용)
    }
  };

  const fetchUserdata = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    console.log('selectedUserCode', selectedUserCode); 
    
    try {
      const response = await axios.get(`${url}userlog?`, {
        params: {
          userCode: selectedUserCode,
          workDate: selectedWorkDate
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });    
      console.log('백엔드에서 받은거', response);
      const userCodedata = response.data;
      console.log('userCodedata', userCodedata);
      if (!userCodedata) {
        console.error('No data found for user');
        return;
      }
      const userdata = userCodedata.map(item =>({
        userCode: item.userCode,
        heartbeat: item.heartbeat,
        temperature: item.temperature,
        latitude: item.latitude,
        longitude: item.longitude,
        timestamp: item.timestamp,
        riskFlag: item.riskFlag,
        vitalDate: item.vitalDate,
        workDate: item.workDate,
        activity: item.activity,
        outsideTemperature: item.outsideTemperature,
      }))
      setMapsocketData(prevData => {
        const newData = {...prevData};
        console.log('userCodedata', userCodedata);
        userdata.forEach(item => {
          const existingData = newData[item.userCode] || {};
          newData[item.userCode] = {
            ...existingData,
            heartbeat: [...(existingData.heartbeat || []), item.heartbeat].slice(-60),
            temperature: [...(existingData.temperature || []), Number(item.temperature)].slice(-60),
            latitude: item.latitude,
            longitude: item.longitude,
            timestamp: new Date().getTime(),
            riskFlag: item.riskFlag,
            vitalDate: item.vitalDate,
            workDate: item.workDate,
            activity: item.activity,
            outsideTemperature: item.outsideTemperature,
          };
        });
        return newData;
      });
  
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  // 마커를 생성하는 함수
  const createMarker = (userCode, position, riskFlag, workDate) => {
    // 마커 생성
    const marker = new naver.maps.Marker({
      position,
      icon: {
        url: getIconUrl(riskFlag),
      },
      title: `User ${userCode}`,
      workDate: workDate,
    });
    console.log('marker' , marker);
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
    return marker;
  };
  
  useEffect(() => {
    if (selectedUserCode && selectedWorkDate) {
      fetchUserdata();
    }
  }, [selectedUserCode, selectedWorkDate]);
  
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

  // useEffect(() => {
  //   const refreshInterval = setInterval(() => {
  //     window.location.reload();
  //   }, 60000); // 60000ms = 1분
  //   console.log('refreshInterval', refreshInterval);
  //   // 컴포넌트가 언마운트될 때 인터벌 클리어
  //   return () => clearInterval(refreshInterval);
  // }, []);
  useEffect(() => {
    console.log('mapsocketData가 변했을떼', mapsocketData); // 데이터 확인용 로그
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
        const iconUrl = getIconUrl(riskFlag);
  
        // 이미 있는 마커를 업데이트하거나 새로운 마커 생성
        if (markersRef.current[userCode]) {
          const marker = markersRef.current[userCode];
          marker.setPosition(position);
  
          // 기존 아이콘과 riskFlag를 비교하고, 다르면 아이콘을 업데이트
          if (marker.customIcon !== iconUrl) {
            marker.setIcon({
              url: iconUrl,
            });
  
            // 새로운 아이콘 URL 저장
            marker.customIcon = iconUrl;
          }
        } else {
          const newMarker = createMarker(userCode, position, riskFlag, workDate);
          markersRef.current[userCode] = newMarker;
  
          // 마커에 새 아이콘 정보 저장
          newMarker.customIcon = iconUrl;
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
      {selectedUserCode && selectedWorkDate && <HeartbeatGraph userCode={selectedUserCode} workDate={selectedWorkDate} onClose={handleClose}/>}
    </div>
  );
}
