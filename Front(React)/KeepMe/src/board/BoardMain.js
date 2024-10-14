import React, { useState, useEffect, useRef } from 'react';
import styles from './BoardMain.module.css';
import Pagination from '../pagination/Pagination';
import axios from 'axios';
import BoardWrite from './BoardWrite';
import BoardDetail from './BoardDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function BoardMain({ onClose }) {
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentBoardPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [dataBoard, setDataBoard] = useState([]);
  const [postsPerPage] = useState(10);
  const [page, setPage] = useState({
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  });

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDetail, setIsDetail] = useState(false);
  const [isWrite, setIsWrite] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const inputRef = useRef();
  const selectRef = useRef();

  const url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const response = (await axios.get(`${url}boards`, {
          params: {
            page: currentPage - 1,
            size: postsPerPage,
          },
          headers: { 'Authorization': sessionStorage.getItem('token') }
        })).data;
        console.log(response.content);
        setDataBoard(response.content);
        setPage({
          size: response.pagesize,
          number: response.pageNumber,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (searchMode) {
      return; // 검색 모드일 경우, 게시물 로드하지 않음
    }

    loadBoard();
    localStorage.setItem('currentBoardPage', currentPage.toString());
  }, [currentPage, url, postsPerPage, searchMode]);

  const searchBoard = async (pageNumber = 0) => {
    let keyword = inputRef.current.value.trim();
    const selectedType = selectRef.current.value; // 선택한 타입

    if (keyword.length < 2) {
      alert("2글자 이상 입력해주세요.");
      inputRef.current.focus();
      return;
    }
    try {
      const resp = await axios.get(`${url}boards/search`, {
        params: {
          type: selectedType,
          keyword: keyword,
          page: pageNumber,
          size: postsPerPage,
        },
        headers: {
          'Authorization': sessionStorage.getItem('token')
        }
      });

      console.log('Response:', resp.data);  // 응답 데이터를 확인
      const results = resp.data.content;
      const pageInfo = resp.data.page || {};  // page 객체가 없으면 빈 객체로 처리

      setDataBoard(results);
      setPage({
        size: pageInfo.size || 10,  // page.size가 undefined일 경우 기본값 10
        number: pageInfo.number || 0,
        totalElements: pageInfo.totalElements || 0,
        totalPages: pageInfo.totalPages || 0
      });

      setSearchMode(true);
    } catch (error) {
      console.error("게시판 자료를 가져오는데 실패했습니다.", error.response ? error.response.data : error);
      alert("게시판 자료를 가져오는데 실패했습니다.");
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    searchBoard(currentPage - 1); // 현재 페이지 번호를 전달
  };

  const handleWrite = (e) => {
    e.preventDefault();
    setIsWrite(true);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('currentBoardPage', pageNumber.toString());
    if (searchMode) {
      searchBoard(pageNumber - 1); // 검색 모드일 경우 검색 실행
    }
  };

  const dept = {
    HR: '인사',
    IT: '전산관리',
    QM: '품질관리',
  };

  const formatDate = (createDateArray) => {
    const [year, month, day, hours, minutes, seconds] = createDateArray;
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const handleRowClick = (idx) => {
    setSelectedPostId(idx);
    setIsDetail(true);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.boardMain} onClick={e => e.stopPropagation()}>
        {/* 검색 기능을 좌측 상단에 배치 */}
        <form onSubmit={handleSearch} className={`${styles.searchForm} flex items-center space-x-3`}>
          <select ref={selectRef} className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="userName">이름</option>
          </select>
          <input
            type="text"
            ref={inputRef}
            placeholder="검색어 입력"
            className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="flex items-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>

        <table className={styles.boardTable}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>부서</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody className={styles.body}>
            {dataBoard.length > 0 ? (
              dataBoard.map((post) => (
                <tr key={post.idx} onClick={() => handleRowClick(post.idx)}>
                  <td>{post.idx}</td>
                  <td>{post.title}</td>
                  <td>{dept[post.dept]}</td>
                  <td>{post.userName}</td>
                  <td className={styles.createDate}>{formatDate(post.createDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noDataMessage}>
                  해당하는 결과를 찾을 수 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isDetail && selectedPostId && <BoardDetail postId={selectedPostId} onClose={onClose} />}

        <button onClick={handleWrite} className={styles.writeButton}>작성</button>
        {isWrite && <BoardWrite onClose={onClose} />}
        <button onClick={onClose} className={styles.homeButton}>닫기</button>

        {/* 페이지네이션 컴포넌트 */}
        <div className={styles.paginationContainer}>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={page.totalElements}
            paginate={paginate}
            currentPage={currentPage}
            totalPages={page.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
