import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isBoardDetailOpenState, isBoardEditOpenState, refreshState } from '../ModalAtom';
export default function BoardEdit({ onClose, postId }) {
  // const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [userName, setUserName] = useState('');
  const [dept, setDept] = useState('');
  // const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isBoardEditOpen, setIsBoardEditOpen] = useRecoilState(isBoardEditOpenState);
  const [isBoardDetailOpen, setIsBoardDetailOpen] = useRecoilState(isBoardDetailOpenState);
  const [refresh, setRefresh] = useRecoilState(refreshState);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_BACKEND_URL;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': sessionStorage.getItem('token')
  };
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idx = query.get('idx');

  const handleClose = () => {
    setIsBoardEditOpen(false);
    setIsBoardDetailOpen(false);
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${url}board?idx=${postId}`, { headers: headers });
        console.log('response', response);
        const post = response.data;
        setEditedTitle(post.title);
        setEditedContent(post.content);
        setUserName(post.userName)
        setDept(post.dept)
      } catch (error) {
        console.error('Error fetching the post:', error);
      }
    }
    fetchPost();
  }, [postId, url]);

  const handleEdit = async (e) => {
    e.preventDefault();
    // 여기에 게시글 제출 로직을 구현합니다.
    if (editedTitle.trim() === '' || editedContent.trim() === '') {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      await axios.post(`${url}board/edit?idx=${postId}`,
        {
          title: editedTitle, content: editedContent
        }, { headers: headers }
      );
      alert("성공적으로 게시글을 수정하였습니다.");
      setRefresh(true);
      setIsBoardEditOpen(false);
      setIsBoardDetailOpen(false);
    } catch (error) {
      if (error.response.status === 401) {
        console.error('Error editing the post:', error);
        alert('권한이 없는 사용자입니다.');
        setIsBoardEditOpen(false);
        setIsBoardDetailOpen(false);
      } else {
        console.error('Error editing the post:', error);
        alert('알 수 없는 오류가 발생했습니다.');
        setIsBoardEditOpen(false);
        setIsBoardDetailOpen(false);
      }
    }

  };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-40" onClick={handleClose}>
      <div
        className="relative w-full max-w-[90vw] md:max-w-[600px] h-[55vh] bg-white shadow-2xl rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-slate-400">
          <h3 className="text-lg font-semibold text-center">게시물 수정</h3> {/* 제목 추가 */}
        </div>
        <div className="flex text-base text-gray-900 mb-4 mt-2">
          <label htmlFor="dept" className='ml-4 mr-10 font-semibold text-gray-800'>
            부서: <span className="font-normal text-gray-600">{dept}</span>
          </label>
          <label htmlFor="userName" className='font-semibold text-gray-800'>
            작성자: <span className="font-normal text-gray-600">{userName}</span>
          </label>
        </div>
        <form onSubmit={handleEdit} className="p-4">
          {/* 에러 메시지 */}
          {/* {error && <p className="text-red-500 mb-2">{error}</p>} */}

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-semibold mb-1">
              제목
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              required
            />
          </div>

          {/* <div className="flex justify-between text-sm text-gray-600 mb-4">
            <label htmlFor="dept">부서: {dept}</label>
            <label htmlFor="userName">작성자: {userName}</label>
          </div> */}

          <div className="mb-4 min-h-[150px]">
            <textarea
              id="content"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-slate-600 text-white rounded-lg px-4 py-2 hover:bg-slate-500 transition duration-300"
            >
              확인
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-slate-400 text-white rounded-lg px-4 py-2 hover:bg-slate-300 transition duration-300"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
