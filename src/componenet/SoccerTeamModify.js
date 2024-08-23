import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function SoccerTeamModify() {
  const { teamIdx } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    teamName: '',
    region: '',
    teamDay: '',
    teamTime: '',
    teamPeriod: '',
    teamNumber: '',
    teamOld: '',
    needPosition: '',
    needPositionNumber: '',
    athleteNumber: '',
    contents: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/soccerTeam/${teamIdx}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(response => {
        setFormData(response.data.soccerTeam);
      })
      .catch(error => {
        console.error('Error fetching soccer team details:', error);
      });
  }, [teamIdx]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/api/soccerTeam/${teamIdx}/edit`, formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating soccer team:', error);
    }
  };

  return (
    <div className="container">
      <h2>팀 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <table className="soccerTeam_write">
          <tbody>
            <tr>
              <td>제목</td>
              <td><input type="text" name="title" value={formData.title} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>팀 이름</td>
              <td><input type="text" name="teamName" value={formData.teamName} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>지역</td>
              <td><input type="text" name="region" value={formData.region} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>요일</td>
              <td><input type="text" name="teamDay" value={formData.teamDay} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>진행 시간</td>
              <td><input type="number" name="teamTime" value={formData.teamTime} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>운영 기간</td>
              <td><input type="number" name="teamPeriod" value={formData.teamPeriod} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>연락처</td>
              <td><input type="text" name="teamNumber" value={formData.teamNumber} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>팀 연령대</td>
              <td><input type="number" name="teamOld" value={formData.teamOld} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>필요 포지션</td>
              <td><input type="text" name="needPosition" value={formData.needPosition} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>필요 포지션 수</td>
              <td><input type="number" name="needPositionNumber" value={formData.needPositionNumber} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>선출 수</td>
              <td><input type="number" name="athleteNumber" value={formData.athleteNumber} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td colSpan="4"><textarea name="contents" value={formData.contents} onChange={handleChange}></textarea></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="저장" className="btn" />
        <button type="button" className="btn" onClick={() => navigate(`/soccerTeam/${teamIdx}`)}>취소</button>
      </form>
    </div>
  );
}

export default SoccerTeamModify;
