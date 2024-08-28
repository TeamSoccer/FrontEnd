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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);  // 토큰을 localStorage에 저장
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // localStorage에서 토큰 삭제
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<SoccerTeamList isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
        <Route path="/soccerTeam/write" element={<SoccerTeamWrite />} />
        <Route path="/soccerTeam/:teamIdx" element={<SoccerTeamDetail isLoggedIn={isLoggedIn}/>} />
        <Route path="/soccerTeamModify/:teamIdx" element={<SoccerTeamModify />} />
        <Route path="/playerWrite/:teamIdx" element={<PlayerWrite />} />
        <Route path="/playerDetail/:playerIdx" element={<PlayerDetail />} />
        <Route path="/playerModify/:playerIdx" element={<PlayerModify />} />
      </Routes>
    </Router>
  );
}

export default App;