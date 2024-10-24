import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil';
import { authState } from './recoil/Atoms';
import styles from './App.module.css'
import MainPage from './main/MainPage';
import LoginForm from './login/LoginForm';
import RegisterForm from './login/RegisterForm';
import BoardMain from './board/BoardMain';
import BoardDetail from './board/BoardDetail';
import BoardWrite from './board/BoardWrite';
import BoardEdit from './board/BoardEdit';

function App() {
  const setAuth = useRecoilValue(authState);
  console.log('setAuth', setAuth)

  
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} className={styles.LoginForm} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/main" element={<MainPage/>} />
          <Route path="/boards" element={<BoardMain />} />
          <Route path="/board/detail" element={<BoardDetail />} />
          <Route path="/board/write" element={<BoardWrite />} />
          <Route path="/board/edit" element={<BoardEdit />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
