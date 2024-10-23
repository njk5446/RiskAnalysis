import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BoardDetail.module.css';
import axios from 'axios';
import BoardEdit from './BoardEdit';
import { isBoardDetailOpenState, isBoardEditOpenState, refreshState } from '../ModalAtom';
import { useRecoilState } from 'recoil';

export default function BoardDetail({ onClose, postId }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const url = process.env.REACT_APP_BACKEND_URL;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': sessionStorage.getItem('token')
  };
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idx = query.get('idx');
  const [isEdit, setIsEdit] = useState(false);
  const [isBoardDetailOpen, setIsBoardDetailOpen] = useRecoilState(isBoardDetailOpenState);
  const [isBoardEditOpen, setIsBoardEditOpen] = useRecoilState(isBoardEditOpenState);
  const [refresh, setRefresh] = useRecoilState(refreshState);

  const handleClose = () => {
    setIsBoardDetailOpen(false);
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${url}board?idx=${postId}`, { headers: headers });
        setPost(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching the post:', error);
      }
    };
    fetchPost();
  }, [postId, url]);

  if (!post) return <div>로딩 중...</div>;

  const handleEditButton = async () => {
    try {
      const resp = await axios.post(`${url}checkUser?idx=${postId}`, '', {
        headers: headers
      });
      if (resp.status === 200) {
        setIsBoardEditOpen(true);
      }
    } catch (error) {
      if (error.response.status === 401) {
        alert('해당 게시물 작성자가 아니므로 수정 할 수 없습니다.');
      }
    }
  }

  const handleDeleteButton = async () => {
    try {
      const resp = await axios.post(`${url}checkUser?idx=${postId}`, '', {
        headers: headers
      });
      if (resp.status === 200) {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
          const response = await axios.post(`${url}board/delete?idx=${postId}`, '', { headers: headers });
          if (response.status === 200) {
            alert('게시글이 삭제되었습니다.');
            setIsBoardDetailOpen(false);
            setRefresh(true);
          } else {
            alert('알 수 없는 오류가 발생했습니다.');
            setIsBoardDetailOpen(false);
          }
        } else {
          alert('게시글 삭제가 취소되었습니다.');
          setIsBoardDetailOpen(false);
        }
      }
      else {
        alert('해당 게시물 작성자가 아니므로 삭제 할 수 없습니다.');
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.error('Error deleting the post:', error);
        alert('해당 게시물 작성자가 아니므로 삭제 할 수 없습니다.');

      } else {
        console.error('Error deleting the post:', error);
        alert('알 수 없는 오류가 발생했습니다.');

      }
    }
  }
  const dept = {
    HR: '인사',
    IT: '전산관리',
    QM: '품질관리',
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleClose}>
    <div
      className="relative w-full max-w-[90vw] md:max-w-[600px] h-[55vh] bg-white shadow-lg rounded-lg overflow-hidden" // shadow-lg로 변경
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 bg-slate-300">
        <h3 className="text-lg font-semibold text-center">게시물 상세</h3>
      </div>
      <div className="flex text-base text-gray-900 mb-4 mt-2">
        <label htmlFor='dept' className='ml-4 mr-10 font-semibold text-gray-800'>부서: <span className='font-normal text-gray-600'>{dept[post.dept]}</span></label>
        <label htmlFor='userName' className='ml-4 mr-10 font-semibold text-gray-800'>작성자: <span className='font-normal text-gray-600'>{post.userName}</span></label>
      </div>
      <h3 className="text-lg font-semibold mb-2 ml-4">제목: {post.title}</h3>
      <div className="flex text-base text-gray-900 mb-4 mt-2"></div>
  
      <div className="ml-1 p-4 min-h-[150px]">
        <p className="text-gray-800">{post.content}</p>
      </div>
  
      <div className="flex justify-end space-x-2 p-4 border-t">
        <button
          className="bg-slate-600 text-white rounded-lg px-4 py-2 hover:bg-slate-500 transition duration-300"
          onClick={handleEditButton}
        >
          수정
        </button>
        <button
          className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-500 transition duration-300"
          onClick={handleDeleteButton}
        >
          삭제
        </button>
        <button
          className="bg-slate-700 text-white rounded-lg px-4 py-2 hover:bg-slate-600 transition duration-300"
          onClick={handleClose}
        >
          닫기
        </button>
      </div>
      {isBoardEditOpen && <BoardEdit onClose={onClose} postId={postId} />}
    </div>
  </div>
  )
}
