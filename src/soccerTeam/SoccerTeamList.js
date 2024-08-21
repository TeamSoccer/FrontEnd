import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';

const SoccerTeamList = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/api/soccerTeam', { headers: { Authorization: 'Bearer ' + token }});
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="container">
      <h2 className="title">팀 게시판</h2>
      <div className="table-container">
        <table className="team-list">
          <thead>
            <tr>
              <th>글 번호</th>
              <th>팀 이름</th>
              <th>제목</th>
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
                <tr key={team.teamIdx}>
                  <td>{team.teamIdx}</td>
                  <td>
                    <Link to={`/soccerTeam/${team.teamIdx}`}>{team.teamName}</Link>
                    </td>
                  <td>
                    <Link to={`/soccerTeam/${team.teamIdx}`}>{team.title}</Link>
                  </td>
                  <td>{team.region}</td>
                  <td>{team.teamDay}</td>
                  <td>{team.teamTime}</td>
                  <td>{team.createdDatetime}</td>
                  <td>{team.updatedDatetime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No teams found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link to="/soccerTeam/write" className="register-button">팀 등록</Link>
    </div>
  );
};

export default SoccerTeamList;
