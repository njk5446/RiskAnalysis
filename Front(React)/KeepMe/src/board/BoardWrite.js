import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardWrite.module.css';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { refreshState } from '../ModalAtom';

export default function BoardWrite({ onClose }) {
    const [title, setTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [dept, setDept] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const url = process.env.REACT_APP_BACKEND_URL;
    const token = sessionStorage.getItem('token');
    const [refresh, setRefresh] = useRecoilState(refreshState);

    useEffect(() => {
        getUserInfo();
    }, []);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
    };

    const getUserInfo = async () => {
        try {
            const response = (await axios.get(`${url}getUserInfo`, { headers: headers }
            )).data;
            console.log(response);
            setUserName(response.userName)
            setDept(response.dept)
        } catch (error) {
            console.log('Error fetching posts:', error);
        }
    }

    const deptLabels = {
        HR: '인사',
        IT: '전산관리',
        QM: '품질관리',
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // 여기에 게시글 제출 로직을 구현합니다.
        // 예: API 호출을 통해 서버에 데이터를 전송
        if (title.trim() === '' || content.trim() === '') {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }
        try {
            await axios.post(`${url}board/write`, { title: title, content: content }, { headers: headers });
            setRefresh(true);
            alert("성공적으로 게시글을 등록하였습니다.");
            onClose();
        } catch (error) {
            setError("게시글 등록에 실패하였습니다.");
        }
        console.log({ title, userName, dept, content });
        // 제출 후 게시판 목록 페이지로 이동


    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="relative w-full max-w-[90vw] md:max-w-[600px] bg-white shadow-2xl rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="p-4">
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <label htmlFor="dept">부서: {deptLabels[dept] || '미정'}</label>
                        <label htmlFor="userName">작성자: {userName}</label>
                    </div>

                    <div className="mb-4">
                        <textarea
                            id="content"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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
                            onClick={onClose}
                            className="bg-slate-400 text-white rounded-lg px-4 py-2 hover:bg-slate-300 transition duration-300"
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}