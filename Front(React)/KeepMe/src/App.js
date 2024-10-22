import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil';
import { authState } from './recoil/Atoms';
import styles from './App.module.css'
import MainPage from './main/MainPage';
import LoginForm from './login/LoginForm';
import RegisterForm from './register/RegisterForm';
import UserMainPage from './user/UserMainPage';

function App() {
  const setAuth = useRecoilValue(authState);
  console.log('setAuth', setAuth)

  
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} className={styles.LoginForm} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/user" element={<UserMainPage />} />
          <Route path="/main" element={<MainPage/>} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
