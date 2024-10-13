import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardWrite.module.css';
import axios from 'axios';

export default function BoardWrite({ onClose }) {
    const [title, setTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [dept, setDept] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const url = process.env.REACT_APP_BACKEND_URL;
    const token = sessionStorage.getItem('token');
    
    useEffect(() => {
        getUserInfo();
    }, []);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
      };

      const getUserInfo = async () => {
        try {
          const response = (await axios.get(`${url}getUserInfo`,{headers:headers}
          )).data;
          console.log(response);
          setUserName(response.userName)
          setDept(response.dept)
        } catch (error) {
          console.log('Error fetching posts:', error);
        }
      }

    const handleSubmit = async(e) => {
        e.preventDefault();
        // 여기에 게시글 제출 로직을 구현합니다.
        // 예: API 호출을 통해 서버에 데이터를 전송
        if (title.trim() === '' || content.trim() === '') {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }
        try{
            await axios.post(`${url}board/write`, { title:title, content:content},{ headers: headers });
            alert("성공적으로 게시글을 등록하였습니다.");
            navigate("/main");
        }catch(error){
            setError("게시글 등록에 실패하였습니다.");
        }
        console.log({ title, userName, dept, content });
        // 제출 후 게시판 목록 페이지로 이동
        

    };


    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.boardWriteContainer} onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    {/* {error && <p className={styles.error}>{error}</p>} */}
                    <div className={styles.postWriteContainer}>
                        <label htmlFor="title"className={styles.title}>제목</label>
                        <input className={styles.writeTitle}
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.submitButton} >확인</button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}