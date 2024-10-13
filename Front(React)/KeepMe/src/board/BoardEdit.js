import React from 'react'
import styles from './BoardEdit.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
export default function BoardEdit({onClose,postId}) {
  // const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [userName, setUserName] = useState('');
  const [dept, setDept] = useState('');
  // const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const url = process.env.REACT_APP_BACKEND_URL;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': sessionStorage.getItem('token')
  };
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idx = query.get('idx');

  useEffect(() => { 
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${url}board?idx=${postId}`,{headers:headers});
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

  const handleSubmit = async (e) => {
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
      onClose();
    } catch (error) {
      if(error.response.status===401){
        console.error('Error editing the post:', error);
        alert('권한이 없는 사용자입니다.');
        onClose();
      }else{
        console.error('Error editing the post:', error);
        alert('알 수 없는 오류가 발생했습니다.');
        onClose();
      }
    }
    
  };

  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.boardEditContainer} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* {error && <p className={styles.error}>{error}</p>} */}
          <div className={styles.postEditContainer}>
            <label htmlFor="title" className={styles.title}>제목</label>
            <input className={styles.writeTitle}
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              required
            />
            <div className={styles.writeEtcContainer}>
              <label htmlFor="dept">부서: {dept}</label>
              <label htmlFor="userName">작성자: {userName}</label>
            </div>
          </div>
          <div>
            <textarea
              id="content"
              className={styles.writeContent}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className={styles.submitButton}>확인</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
          </div>
        </form>
      </div>
    </div>
  )
}
