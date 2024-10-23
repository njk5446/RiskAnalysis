import React, { useState, useEffect, useRef } from 'react';
import styles from './BoardMain.module.css';
import Pagination from '../pagination/Pagination';
import axios from 'axios';
import BoardWrite from './BoardWrite';
import BoardDetail from './BoardDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isBoardDetailOpenState, isBoardEditOpenState, isBoardWriteOpenState, refreshState, selectedPostIdState } from '../ModalAtom';

export default function BoardMain({ onClose }) {

  const [refresh, setRefresh] = useRecoilState(refreshState); // setRefresh 추가

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem('currentBoardPage');
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

  // const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDetail, setIsDetail] = useState(false);
  const [isWrite, setIsWrite] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [isBoardDetailOpen, setIsBoardDetailOpen] = useRecoilState(isBoardDetailOpenState);
  const [isBoardWriteOpen, setIsBoardWriteOpen] = useRecoilState(isBoardWriteOpenState);
  const [selectedPostId, setSelectedPostId] = useRecoilState(selectedPostIdState);
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
        setSearchMode(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (searchMode) {
      return; // 검색 모드일 경우, 게시물 로드하지 않음
    }

    loadBoard();
    sessionStorage.setItem('currentBoardPage', currentPage.toString());
  }, [currentPage, url, postsPerPage, searchMode]);

  // 새로고침시
  useEffect(() => {
    if (refresh) {
      refreshBoardData();
      setRefresh();
    }

  }, [refresh]);

  const refreshBoardData = async () => {
    try {
        const response = await axios.get(`${url}boards`, {
            params: {
                page: currentPage - 1,
                size: postsPerPage,
            },
            headers: { 'Authorization': sessionStorage.getItem('token') }
        });

        setDataBoard(response.data.content);
        setPage({
            size: response.data.pagesize,
            number: response.data.pageNumber,
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
        });
    } catch (error) {
        console.error('Error refreshing posts:', error);
    }
};

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

      const results = resp.data.content;
      console.log(resp.data.totalPages);
      // const pageInfo = resp.data.page || {};  // page 객체가 없으면 빈 객체로 처리
      setDataBoard(results);
      setPage({
        size: resp.data.size || postsPerPage,
        number: resp.data.number,
        totalElements: resp.data.totalElements,
        totalPages: resp.data.totalPages,
      });

      setSearchMode(true);
    } catch (error) {
      console.error("게시판 자료를 가져오는데 실패했습니다.", error.response ? error.response.data : error);
      alert("게시판 자료를 가져오는데 실패했습니다.");
    }
  };

  const handleClose = () => {
    setCurrentPage(1); // 현재 페이지를 1로 초기화
    sessionStorage.setItem('currentBoardPage', '1');
    setIsBoardWriteOpen(false);
    // onClose();
  };


  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    sessionStorage.setItem('currentBoardPage', '1');
    searchBoard(currentPage - 1); // 현재 페이지 번호를 전달
  };

  const handleWrite = (e) => {
    e.preventDefault();
    setIsBoardWriteOpen(true);
  };



  const paginate = (pageNumber) => {
    if (searchMode && pageNumber > page.totalPages) {
      return;
    }

    setCurrentPage(pageNumber);
    sessionStorage.setItem('currentBoardPage', pageNumber.toString());
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
    setIsBoardDetailOpen(true);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="relative w-full max-w-[90vw] md:max-w-[900px] h-full max-h-[80vh] md:max-h-[550px] bg-white shadow-2xl rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 상단 제목 및 검색 기능 */}
        <div className="flex items-center justify-between p-4 bg-gray-100">
          <h2 className="text-lg font-semibold ml-10">공지사항</h2>
          {/* 검색 기능 */}
          <form onSubmit={handleSearch} className="flex items-center space-x-3">
            <select
              ref={selectRef}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="userName">이름</option>
            </select>
            <input
              type="text"
              ref={inputRef}
              placeholder="검색어 입력"
              className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm"
            />
            <button
              type="submit"
              className="flex items-center p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition duration-300"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
        </div>

        {/* 테이블 고정 */}
        <div className="flex-1 p-4">
          <table className="table-fixed min-w-full border-collapse">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 text-center font-semibold text-sm w-[10%]">번호</th>
                <th className="border px-4 py-2 text-center font-semibold text-sm w-[40%]">제목</th>
                <th className="border px-4 py-2 text-center font-semibold text-sm w-[15%]">부서</th>
                <th className="border px-4 py-2 text-center font-semibold text-sm w-[15%]">작성자</th>
                <th className="border px-4 py-2 text-center font-semibold text-sm w-[20%]">작성일</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {dataBoard.length > 0 ? (
                dataBoard.map((post) => (
                  <tr key={post.idx} onClick={() => handleRowClick(post.idx)} className="hover:bg-gray-100 cursor-pointer transition duration-200">
                    <td className='text-center'>{post.idx}</td>
                    <td className='text-center'>{post.title}</td>
                    <td className='text-center'>{dept[post.dept]}</td>
                    <td className='text-center'>{post.userName}</td>
                    <td className='text-center'>{formatDate(post.createDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    해당하는 결과를 찾을 수 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isBoardDetailOpen && selectedPostId && <BoardDetail postId={selectedPostId} onClose={handleClose} />}

        {/* 페이지네이션 및 버튼들 레이아웃 수정 */}
        <div className="flex-shrink-0 flex items-center p-4 bg-white border-t">
          {/* 왼쪽 여백 */}
          <div className="w-[150px]"></div>

          {/* 페이지네이션 */}
          <div className="flex-1 flex justify-center">
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={page.totalElements}
              paginate={paginate}
              currentPage={currentPage}
              totalPages={page.totalPages}
            />
          </div>
          {isBoardWriteOpen && <BoardWrite onClose={handleClose} />}
          {/* 버튼 그룹 */}
          <div className="w-[150px] flex justify-end space-x-2">
            <button
              onClick={handleWrite}
              className="bg-slate-800 text-white rounded-lg px-4 py-2 hover:bg-slate-900 transition duration-300"
            >
              작성
            </button>
            <button
              onClick={onClose}
              className="bg-slate-700 text-white rounded-lg px-4 py-2 hover:bg-slate-800 transition duration-300"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
