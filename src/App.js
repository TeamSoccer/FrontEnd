import './App.css';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Join from './componenet/Join';
import Login from './componenet/Login';
import SoccerTeamList from './componenet/SoccerTeamList';
import SoccerTeamWrite from './componenet/SoccerTeamWrite';
import SoccerTeamDetail from './componenet/SoccerTeamDetail';
import SoccerTeamModify from './componenet/SoccerTeamModify';
import PlayerWrite from './soccerTeam/PlayerWrite';
import PlayerDetail from './soccerTeam/PlayerDetail';
import PlayerModify from './soccerTeam/PlayerModify';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 관리
  const [username, setUsername] = useState('');  // 사용자 이름 관리

  useEffect(() => {
    // 페이지 새로고침 시 로그인 상태 유지
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (storedLoginStatus === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);  // 로그인 상태로 변경
    setUsername(username);  // 사용자 이름 저장
    localStorage.setItem('isLoggedIn', 'true');  // localStorage에 로그인 상태 저장
    localStorage.setItem('username', username);  // localStorage에 사용자 이름 저장
  };

  const handleLogout = () => {
    setIsLoggedIn(false);  // 로그아웃 상태로 변경
    setUsername('');  // 사용자 이름 초기화
    localStorage.removeItem('isLoggedIn');  // localStorage에서 로그인 상태 삭제
    localStorage.removeItem('username');  // localStorage에서 사용자 이름 삭제
  };

  return (
    <Router>
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />  {/* 로그인 시 handleLogin 호출 */}
        <Route path="/" element={<SoccerTeamList isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />  {/* 상태 전달 */}
        <Route path="/soccerTeam/write" element={<SoccerTeamWrite />} />
        <Route path="/soccerTeam/:teamIdx" element={<SoccerTeamDetail />} />
        <Route path="/soccerTeamModify/:teamIdx" element={<SoccerTeamModify />} />
        <Route path="/playerWrite/:teamIdx" element={<PlayerWrite />} />
        <Route path="/playerDetail/:playerIdx" element={<PlayerDetail />} />
        <Route path="/playerModify/:playerIdx" element={<PlayerModify />} />
      </Routes>
    </Router>
  );
}

export default App;