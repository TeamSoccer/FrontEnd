import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/PlayerWrite.css';

function PlayerWrite() {
  const { teamIdx } = useParams(); 
  const [formData, setFormData] = useState({
    title: '',
    // 혹시 몰라서 주석 처리 해두었습니다. 필요없는게 확실해지면 지우겠습니다.
    // playerName: '',
    // region: '',
    // playerPeriod: '',
    // playerNumber: '',
    // playerOld: '',
    // playerPosition: '',
    // playerAthlete: false,
    contents: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    // if (!formData.playerName.trim()) {
    //   newErrors.playerName = '이름을 입력해주세요.';
    // }
    // if (!formData.region.trim()) {
    //   newErrors.region = '거주 지역을 입력해주세요.';
    // }
    // if (!formData.playerNumber || !/^\d{3}-\d{4}-\d{4}$/.test(formData.playerNumber)) {
    //   newErrors.playerNumber = '전화번호는 000-0000-0000 형식이어야 합니다.';
    // }
    // if (!formData.playerOld || formData.playerOld < 10 || formData.playerOld > 100) {
    //   newErrors.playerOld = '유효한 나이를 입력해주세요.';
    // }
    // if (!formData.playerPosition.trim()) {
    //   newErrors.playerPosition = '포지션을 입력해주세요.';
    // }

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

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/enroll', {
        ...formData,
        teamId: teamIdx,
        title: formData.title,
        content: formData.contents
      }, {
        headers: {
          'Authorization': token
        }
      });
      navigate(`/soccerTeam/${teamIdx}`); 
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
              <td><input type="text" name="title" value={formData.title} onChange={handleChange} required /></td>
            </tr>
            {errors.title && <p className="error">{errors.title}</p>}
            {/* <tr>
              <td>본인 이름</td>
              <td><input type="text" name="playerName" value={formData.playerName} onChange={handleChange} required /></td>
            </tr>
            {errors.playerName && <p className="error">{errors.playerName}</p>}
            <tr>
              <td>거주 지역</td>
              <td><input type="text" name="region" value={formData.region} onChange={handleChange} required /></td>
            </tr>
            {errors.region && <p className="error">{errors.region}</p>}
            <tr>
              <td>구력</td>
              <td><input type="number" name="playerPeriod" value={formData.playerPeriod} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>연락처</td>
              <td><input type="text" name="playerNumber" value={formData.playerNumber} onChange={handleChange} required /></td>
            </tr>
            {errors.playerNumber && <p className="error">{errors.playerNumber}</p>}
            <tr>
              <td>나이</td>
              <td><input type="number" name="playerOld" value={formData.playerOld} onChange={handleChange} required /></td>
            </tr>
            {errors.playerOld && <p className="error">{errors.playerOld}</p>}
            <tr>
              <td>포지션</td>
              <td><input type="text" name="playerPosition" value={formData.playerPosition} onChange={handleChange} required /></td>
            </tr>
            {errors.playerPosition && <p className="error">{errors.playerPosition}</p>}
            <tr>
              <td>선출 여부</td>
              <td><input type="checkbox" name="playerAthlete" checked={formData.playerAthlete} onChange={handleChange} /></td>
            </tr> */}
            <tr>
              <td>자기소개</td>
              <td colSpan="2"><textarea name="contents" value={formData.contents} onChange={handleChange} required></textarea></td>
            </tr>
          </tbody>
        </table>
        <div className="btnP-container">
          <input type="submit" value="저장" className="btnP" />
          <button type="button" className="btnP" onClick={() => navigate(`/soccerTeam/${teamIdx}`)}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default PlayerWrite;
