import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export default function RegisterForm() {
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [idChecked, setIdChecked] = useState(false);
    const [department, setDepartment] = useState('');
    const url = process.env.REACT_APP_BACKEND_URL;
    const [selectedGender, setSelectedGender] = useState('');
    const [Region, setRegion] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const headers = {
        'Content-Type': 'application/json',
    };

    const idRef = useRef("");

    const MAX_LENGTH = 16;
    const MIN_LENGTH = 6;

    useEffect(() => {
        setIdChecked(false)
    }, [userId])

    const checkUserid = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}signup/checkId`, {
                userId: userId
            });
            console.log(response.data);
            if (userId === '') {
                alert('아이디를 입력해주세요.');
                return;
            }
            if (response.data === '사용 가능한 아이디') {//백엔드에서 true, false받아옴
                alert('사용 가능한 아이디입니다.');
                setIdChecked(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('이미 사용 중인 아이디입니다.');
                setUserId('');
            } else {
                alert('오류', '중복 확인 중 문제가 발생했습니다. 다시 시도해주세요.');
                setUserId('');
            }
        }
    }
    const genderOption = {
        M: '남',
        F: '여',
    }
    const handleChange = (event) => {
        const { value } = event.target;
        setSelectedGender(value); // 선택된 성별로 상태를 업데이트
    };

    const region = {
        HQ: '본사',
        BOS: '지사',
    }

    const dept = {
        HR: '인사부',
        IT: '개발부',
        QM: '품질관리부'
    }

    const register = async (e) => {
        e.preventDefault();//기본 동작(페이지 새로고침)을 막음

        if (!userName) {
            alert('이름을 입력하세요.');
            return;
        }
        if (!selectedGender) {
            alert('성별을 선택하세요.');
            return;
        }
        if (!Region) {
            alert('지역을 선택하세요.');
            return;
        }
        if (!department) {
            alert('부서를 선택해주세요.');
            return;
        }
        if (!userId.trim()) {
            alert("아이디를 입력하세요.");
            return;
        }
        if (!password.trim()) {
            alert("비밀번호를 입력하세요");
            return;
        }

        if (!password.trim()) {
            alert("비밀번호를 입력하세요.");
            return;
        }
        if (!confirmPassword.trim()) {
            alert("비밀번호 확인을 입력하세요.");
            return;
        }
        if (!idChecked) {
            alert('아이디 중복 확인을 해주세요.');
            return;
        }
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            setPassword('');
            setConfirmPassword('');
            return;
        }

        if (confirmPassword.length < MIN_LENGTH) {
            alert("비밀번호를 6자 이상 입력해주세요.");
            return;
        } else if (confirmPassword.length > MAX_LENGTH) {
            alert("비밀번호를 16자 이내로 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(`${url}signup`, {
                userName: userName,
                userId: userId,
                dept: department,
                password: password,
                region: Region,
                gender: selectedGender,
            },
                { headers: headers }
            );
            console.log(response.data);
            if (response.status === 200) {
                alert('회원가입이 완료되었습니다.');
                navigate('/')
            }
        } catch (error) {
            console.error('회원가입 실패:', error)
            console.log(error.response.data);
        };
    };


    return (
        <div className="bg-cover bg-center w-screen h-screen" style={{ backgroundImage: `url(/img/construction1.jpg)` }}>
            <h1 className="absolute top-12 left-1/2 transform -translate-x-1/2 font-inter font-bold text-4xl text-black text-center">
                작업자 위험 예측 분석
            </h1>
            <div className="fixed w-[90%] max-w-[400px] h-[50vh] min-h-[520px] top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ecf2f4c7] rounded-lg shadow-lg z-10 flex flex-col items-center p-4">
                <h1 className="text-white text-4xl font-bold mb-10 text-center">회원가입</h1>
                <form onSubmit={register} className="flex flex-col items-center">
                    <div className="flex items-center mb-4 w-full max-w-[300px]">
                        <input
                            type="username"
                            className="flex-grow-0 w-[160px] h-12 p-2 bg-white rounded-md text-lg mr-4"
                            placeholder="이름"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <div className="flex items-center">
                            <label className="flex items-center mr-4">
                                <input
                                    type="radio"
                                    value="M"
                                    checked={selectedGender === 'M'}
                                    onChange={handleChange}
                                    className="mr-2 h-6 w-6"
                                />
                                남
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="F"
                                    checked={selectedGender === 'F'}
                                    onChange={handleChange}
                                    className="mr-2 h-6 w-6"
                                />
                                여
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-between w-full max-w-[300px] mb-4">
                        <select
                            className="w-full h-12 p-2 rounded-md bg-white text-lg mr-2"
                            value={Region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <option value="" disabled>
                                지역
                            </option>
                            <option value="HQ">{region.HQ}</option>
                            <option value="BOS">{region.BOS}</option>
                        </select>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full h-12 p-2 rounded-md bg-white text-lg"
                        >
                            <option value="" disabled>
                                부서
                            </option>
                            <option value="HR">{dept.HR}</option>
                            <option value="IT">{dept.IT}</option>
                            <option value="QM">{dept.QM}</option>
                        </select>
                    </div>
                    <div className="w-full max-w-[300px] flex mb-4">
                        <input
                            type="userid"
                            className="w-full h-12 p-2 bg-white rounded-md text-lg"
                            placeholder="아이디"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <button
                            type="button"
                            className="ml-1 h-12 w-[100px] bg-[#143A52] text-white rounded-md" // 버튼 너비를 100px로 설정
                            onClick={checkUserid}
                        >
                            중복확인
                        </button>
                    </div>
                    <input
                        type="password"
                        className="w-full max-w-[300px] h-12 mb-4 p-2 bg-white rounded-md text-lg"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full max-w-[300px] h-12 mb-4 p-2 bg-white rounded-md text-lg"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="flex justify-between w-full max-w-[300px]">
                        <button
                            className="w-[140px] h-12 bg-[#143A52] text-white rounded-md"
                            type="submit"
                        >
                            확인
                        </button>
                        <button
                            className="w-[140px] h-12 bg-[#143A52] text-white rounded-md"
                            onClick={() => navigate('/')}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );



};