// Pagination.js
import React from 'react';
import styles from './Pagination.module.css';

export default function Pagination({ postsPerPage, totalPosts, paginate, currentPage }) {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // 총 페이지 수에 맞게 페이지 번호 배열 생성
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const pageRange = 5; // 한 번에 표시할 페이지 번호 개수
  // 현재 페이지에 따라 시작 페이지 번호 계산
  const startPage = Math.floor((currentPage - 1) / pageRange) * pageRange + 1;
  // 현재 페이지에 따라 끝 페이지 번호 계산, 총 페이지 수를 넘지 않도록 설정
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  return (
    <nav className="flex justify-center my-4">
      <ul className="flex items-center space-x-2">
        {/* 이전 페이지 버튼 */}
        <li>
          <button
            onClick={() => paginate(Math.max(1, startPage - 1))}
            disabled={startPage === 1}
            className={`h-10 px-4 text-sm font-medium rounded-lg transition duration-300 ${startPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
          >
            이전
          </button>
        </li>

        {/* 페이지 번호 */}
        {pageNumbers.slice(startPage - 1, endPage).map(number => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`h-10 px-4 text-sm font-medium rounded-lg transition duration-300 ${currentPage === number
                ? 'bg-slate-600 text-white'
                : 'bg-white text-slate-600 border border-slate-600 hover:bg-slate-50'
                }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* 다음 페이지 버튼 */}
        <li>
          <button
            onClick={() => paginate(Math.min(totalPages, endPage + 1))}
            disabled={endPage === totalPages || totalPosts === 0}
            className={`h-10 px-4 text-sm font-medium rounded-lg transition duration-300 ${endPage === totalPages || totalPosts === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
          >
            다음
          </button>
        </li>
      </ul>
    </nav>
  );
}
