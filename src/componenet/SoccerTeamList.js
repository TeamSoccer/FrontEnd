import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/ScoccerTeamList.css';
import '../css/CommonStyle.css';

const SoccerTeamList = () => {
  const [teams, setTeams] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('Fetching teams with token:', token);
        const response = await axios.get('http://localhost:8080/api/soccerTeam', { headers: { Authorization: token } });
        console.log('Response data:', response.data);
        setTeams(response.data.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };
  
    fetchTeams();
  }, []);

  console.log('Current teams state:', teams);

  return (
    <div className="list-container">
      <div className="header-container">

        <div className="search-actions">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type"
          >
            <option value="teamName">팀 이름</option>
            <option value="region">운영 지역</option>
          </select>
          <input
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <h2 className="title">팀 게시판</h2>
        <Link to="/login" className="login-btn">로그인</Link>
      </div>
      <div className="table-container">
        <table className="team-list">
          <thead>
            <tr>
              <th>글 번호</th>
              <th>제목</th>
              <th>팀 이름</th>
              <th>지역</th>
              <th>요일</th>
              <th>진행 시간</th>
              <th>등록일</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(teams) && teams.length > 0 ? (
              teams.map(team => (
                <tr key={team.id}>
                  <td>{team.id}</td>
                  <td>
                    <Link to={`/soccerTeam/${team.id}`}>{team.title}</Link>
                  </td>
                  <td>
                    <Link to={`/soccerTeam/${team.id}`}>{team.name}</Link>
                  </td>
                  <td>{team.region}</td>
                  <td>{team.day}</td>
                  <td>{`${team.startTime} - ${team.endTime}`}</td>
                  <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(team.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-teams">등록된 팀이 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link to="/soccerTeam/write" className="BTN">팀 등록</Link>
    </div>
  );
};

export default SoccerTeamList;