import './App.css';

import React from 'react';
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
  return (
    <Router>
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SoccerTeamList />} />
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



