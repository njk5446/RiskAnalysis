import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            const response = (await axios.get(`${url}board/getUserInfo`, { headers: headers }
            )).data;
            setUserName(response.userName)
            setDept(response.dept)
        } catch (error) {
            console.error('Error fetching posts:', error);
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
        // 제출 후 게시판 목록 페이지로 이동


    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-40" onClick={onClose}>
            <div
                className="relative w-full max-w-[90vw] md:max-w-[600px] h-[55vh] bg-white shadow-2xl rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 bg-slate-500">
                    <h3 className="text-lg font-semibold text-center">게시물 작성</h3> {/* 제목 추가 */}
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                    {/* 에러 메시지 */}
                    {/* {error && <p className="text-red-500 mb-2">{error}</p>} */}

                    <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                            <label htmlFor="dept" className="mr-6">부서: {deptLabels[dept] || '미정'}</label>
                            <label htmlFor="userName">작성자: {userName}</label>
                        </div>
                        <div className="flex flex-col mb-1 mt-6">
                            <label htmlFor="title" className="text-sm font-semibold mb-1">
                                제목
                            </label>

                        </div>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>


                    <label htmlFor="title" className="text-sm font-semibold mb-1">
                        내용
                    </label>
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