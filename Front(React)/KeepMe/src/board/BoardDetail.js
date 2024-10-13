import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './BoardDetail.module.css';
import axios from 'axios';
import BoardEdit from './BoardEdit';
export default function BoardDetail({onClose, postId}) {
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
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await axios.get(`${url}board?idx=${postId}`,{headers : headers});
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
              setIsEdit(true);   
           }
       } catch (error) {
           if (error.response.status === 401) {
               alert('게시물 작성자가 아니므로 해당 게시물을 수정 할 수 없습니다.');
           }
       }
   }

    const handleDeleteButton = async () => {
          try {
              const resp = await axios.post(`${url}checkUser?idx=${postId}`, '', {
                headers: headers
            });
            if (resp.status === 200) {
              if(window.confirm('정말로 이 게시글을 삭제하시겠습니까?')){
              const response = await axios.post(`${url}board/delete?idx=${postId}`,'',{headers:headers});
              if(response.status===200){
                alert('게시글이 삭제되었습니다.');
                onClose()
              }else{
                alert('알 수 없는 오류가 발생했습니다.');
              }
            }else{
              alert('게시글 삭제가 취소되었습니다.');
            }
            }
            else{
              alert('권한이 없는 사용자입니다.');
            }
           } catch (error) {
              if(error.response.status===401){
                console.error('Error deleting the post:', error);
                alert('권한이 없는 사용자입니다.');
                
              }else{
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
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.boardContainer} onClick={e => e.stopPropagation()}>
                <div className={styles.postContainer}>
                    <h3 className={styles.title}>제목: {post.title}</h3>
                    <div className={styles.etcContainer}>
                        <span>부서: {dept[post.dept]}</span>
                        <span>작성자: {post.userName}</span>
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <p>{post.content}</p>
                </div>
                <button className={styles.BackbuttonContainer} onClick={onClose}>닫기</button>
                <button className={styles.EditbuttonContainer} onClick={handleEditButton}>수정</button>
                {isEdit && <BoardEdit onClose={onClose} postId={postId}/>}
                <button className={styles.DeletebuttonContainer} onClick={handleDeleteButton}>삭제</button>
            </div>

        </div>
    )
}
