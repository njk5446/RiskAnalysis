import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import styles from './RegisterForm.module.css'

export default function RegisterForm() {
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState(false);
    const [department, setDepartment] = useState('');
    const url = process.env.REACT_APP_BACKEND_URL;
    const [selectedGender, setSelectedGender] = useState('');
    const [Region, setRegion] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const headers = {
        'Content-Type': 'application/json',
    };
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
                setIsIdAvailable(true);
                setIsIdChecked(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('이미 사용 중인 아이디입니다.');
                setUserId('');
                setIsIdAvailable(false);
            } else {
                alert('오류', '중복 확인 중 문제가 발생했습니다. 다시 시도해주세요.');
                setUserId('');
                setIsIdAvailable(false);
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
        HQ: '강남건설 본사',
        BOS: '강남건설 서울지사',
    }

    const dept = {
        HR: '인사부',
        IT: '개발부',
        QM: '품질관리부'
    }

    const register = async (e) => {
        e.preventDefault();//기본 동작(페이지 새로고침)을 막음
        console.log({
            userName,
            userId,
            department,
            password,
            Region,
            selectedGender,
        });
        if (!isIdChecked) {
            alert('아이디 중복 확인을 해주세요.');
            return;
        }
        if (!isIdAvailable) {
            alert('사용 가능한 아이디를 입력해주세요.');
            return;
        }
        if (!department) {
            alert('부서를 선택해주세요.');
            return;
        }
        if (password !== checkPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            setPassword('');
            setCheckPassword('');
            return;
        }
        if (!userName) {
            alert('이름을 입력해주세요.');
            return;
        }
        if (!selectedGender) {
            alert('성별을 선택해주세요.');
            return;
        }
        if (!Region) {
            alert('지역을 선택해주세요.');
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
            console.error('Register failed:', error)
            console.log(error.response.data);
        };
    };

    return (
        <div className={styles.bg}>

            <div className={styles.RegisterForm}>
                <h1 className={styles.name}>Join</h1>
                <form onSubmit={register}>
                    <div>
                        <input type='username' className={styles.username} placeholder='이름' value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className={styles.gender}>
                        <label>
                            <input
                                type="checkbox"
                                name='남'
                                value="M"
                                checked={selectedGender === 'M'}
                                onChange={handleChange}
                            />
                            남
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name='여'
                                value="F"
                                checked={selectedGender === 'F'}
                                onChange={handleChange}
                            />
                            여
                        </label>
                    </div>
                    <div>
                        <input type='userid' className={styles.userid} placeholder='아이디' value={userId} onChange={(e) => { setUserId(e.target.value); }} />
                        <button type="button" className={styles.Idcheckbutton} onClick={checkUserid}>
                            {isIdChecked ? (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>
                            )}


                        </button>
                    </div>
                    <div>
                        <select className={styles.region} value={Region} onChange={(e) => setRegion(e.target.value)}>
                            <option value="" disabled>지역</option>
                            <option value="HQ">{region.HQ}</option>
                            <option value="BOS">{region.BOS}</option>
                        </select>
                    </div>
                    <div>
                        <select value={department} onChange={(e) => setDepartment(e.target.value)} className={styles.department}>
                            <option value="" disabled>부서</option>
                            <option value="HR">{dept.HR}</option>
                            <option value="IT">{dept.IT}</option>
                            <option value="QM">{dept.QM}</option>
                        </select>
                    </div>
                    <div>
                        <input type='password' className={styles.password} placeholder='비밀번호' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <input type='password' className={styles.passwordcheck} placeholder='비밀번호 확인' value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} />
                    </div>
                    <div>
                        <button className={styles.join} type="submit">
                            확인
                        </button>
                    </div>
                    <div>
                        <button className={styles.cancel} onClick={() => navigate('/')}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
