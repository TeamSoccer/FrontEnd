import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/PlayerWrite.css';

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/soccerTeam/player/${playerIdx}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error('Error fetching player details:', error);
      });
  }, [playerIdx]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.playerName.trim()) {
      newErrors.playerName = '이름을 입력해주세요.';
    }
    if (!formData.region.trim()) {
      newErrors.region = '거주 지역을 입력해주세요.';
    }
    if (!formData.playerNumber || !/^\d{3}-\d{4}-\d{4}$/.test(formData.playerNumber)) {
      newErrors.playerNumber = '전화번호는 000-0000-0000 형식이어야 합니다.';
    }
    if (!formData.playerOld || formData.playerOld < 10 || formData.playerOld > 100) {
      newErrors.playerOld = '유효한 나이를 입력해주세요.';
    }
    if (!formData.playerPosition.trim()) {
      newErrors.playerPosition = '포지션을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/soccerTeam/player/${playerIdx}/edit?teamIdx=${formData.teamIdx}`, formData, {
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
            {errors.title && <p className="error">{errors.title}</p>}
            <tr>
              <td>본인 이름</td>
              <td><input type="text" name="playerName" value={formData.playerName} onChange={handleChange} /></td>
            </tr>
            {errors.playerName && <p className="error">{errors.playerName}</p>}
            <tr>
              <td>거주 지역</td>
              <td><input type="text" name="region" value={formData.region} onChange={handleChange} /></td>
            </tr>
            {errors.region && <p className="error">{errors.region}</p>}
            <tr>
              <td>구력</td>
              <td><input type="number" name="playerPeriod" value={formData.playerPeriod} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>연락처</td>
              <td><input type="text" name="playerNumber" value={formData.playerNumber} onChange={handleChange} /></td>
            </tr>
            {errors.playerNumber && <p className="error">{errors.playerNumber}</p>}
            <tr>
              <td>나이</td>
              <td><input type="number" name="playerOld" value={formData.playerOld} onChange={handleChange} /></td>
            </tr>
            {errors.playerOld && <p className="error">{errors.playerOld}</p>}
            <tr>
              <td>포지션</td>
              <td><input type="text" name="playerPosition" value={formData.playerPosition} onChange={handleChange} /></td>
            </tr>
            {errors.playerPosition && <p className="error">{errors.playerPosition}</p>}
            <tr>
              <td>선출 여부</td>
              <td><input type="checkbox" name="playerAthlete" checked={formData.playerAthlete} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>자기소개</td>
              <td><textarea name="contents" value={formData.contents} onChange={handleChange}></textarea></td>
            </tr>
          </tbody>
        </table>
        <div className="btnP-container">
          <input type="submit" value="저장" className="btnP" />
          <button type="button" className="btnP" onClick={() => navigate(`/playerDetail/${playerIdx}`)}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default PlayerModify;
