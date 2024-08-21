import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';

function PlayerModify() {
  const { playerIdx } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    playerName: '',
    region: '',
    playerPeriod: '',
    playerNumber: '',
    playerOld: '',
    playerPosition: '',
    playerAthlete: false,
    contents: '',
    teamIdx: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/soccerTeam/player/${playerIdx}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error('Error fetching player details:', error);
      });
  }, [playerIdx]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/api/soccerTeam/player/${playerIdx}/edit?teamIdx=${formData.teamIdx}`, formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      navigate(`/playerDetail/${playerIdx}`);
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  return (
    <div className="container">
      <h2>선수 정보 수정</h2>
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
              <td>내용</td>
              <td><textarea name="contents" value={formData.contents} onChange={handleChange}></textarea></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="저장" className="btn" />
        <button type="button" className="btn" onClick={() => navigate(`/playerDetail/${playerIdx}`)}>취소</button>
      </form>
    </div>
  );
}

export default PlayerModify;
