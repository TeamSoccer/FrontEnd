import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css';

function PlayerWrite() {
  const { teamIdx } = useParams(); // teamIdx를 URL에서 받아옴
  const [formData, setFormData] = useState({
    title: '',
    playerName: '',
    region: '',
    playerPeriod: '',
    playerNumber: '',
    playerOld: '',
    playerPosition: '',
    playerAthlete: false,
    contents: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/soccerTeam/player/write', {
        ...formData,
        teamIdx
      }, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      navigate(`/soccerTeam/${teamIdx}`); // 저장 후 팀 상세 페이지로 이동
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  return (
    <div className="container">
      <h2>선수 등록</h2>
      <form onSubmit={handleSubmit}>
        <table className="player_write">
          <tbody>
            <tr>
              <td>제목</td>
              <td><input type="text" name="title" value={formData.title} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>본인 이름</td>
              <td><input type="text" name="playerName" value={formData.playerName} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>거주 지역</td>
              <td><input type="text" name="region" value={formData.region} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>구력</td>
              <td><input type="number" name="playerPeriod" value={formData.playerPeriod} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>연락처</td>
              <td><input type="text" name="playerNumber" value={formData.playerNumber} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>나이</td>
              <td><input type="number" name="playerOld" value={formData.playerOld} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>포지션</td>
              <td><input type="text" name="playerPosition" value={formData.playerPosition} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>선출 여부</td>
              <td><input type="checkbox" name="playerAthlete" checked={formData.playerAthlete} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>자기소개</td>
              <td colSpan="2"><textarea name="contents" value={formData.contents} onChange={handleChange}></textarea></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="저장" className="btn" />
        <button type="button" className="btn" onClick={() => navigate(`/soccerTeam/${teamIdx}`)}>취소</button>
      </form>
    </div>
  );
}

export default PlayerWrite;
