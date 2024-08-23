import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/CommonStyle.css';
import '../css/SoccerTeamWrite.css';

function SoccerTeamModify() {
  const { teamIdx } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    teamName: '',
    region: '',
    teamDay: [], // 요일을 배열로 관리
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

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handlePhoneInput = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    const formattedPhoneNumber = input.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    setFormData({
      ...formData,
      teamNumber: formattedPhoneNumber
    });
  };

  const handleDayClick = (day) => {
    setFormData(prevState => {
      const { teamDay } = prevState;
      if (teamDay.includes(day)) {
        return {
          ...prevState,
          teamDay: teamDay.filter(d => d !== day)
        };
      } else {
        return {
          ...prevState,
          teamDay: [...teamDay, day]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('data', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
    Array.from(files).forEach(file => {
      data.append('files', file);
    });
    
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
    <div className="write-container">
      <h2>팀 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <table className="soccerTeam_write">
          <tbody>
            <tr>
              <td>팀 로고 / 팀 홍보물</td>
              <td><input type="file" multiple onChange={handleFileChange} /></td>
            </tr>
            <tr>
              <td>제목</td>
              <td><input type="text" name="title" value={formData.title} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>팀 이름</td>
              <td><input type="text" name="teamName" value={formData.teamName} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>지역</td>
              <td><input type="text" name="region" value={formData.region} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>요일</td>
              <td>
                <div className="day-buttons">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`day-button ${formData.teamDay.includes(day) ? 'selected' : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>진행 시간</td>
              <td><input type="number" name="teamTime" value={formData.teamTime} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>운영 기간</td>
              <td><input type="number" name="teamPeriod" value={formData.teamPeriod} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>휴대전화 (숫자만 입력)</td>
              <td>
                <input
                  type="text"
                  name="teamNumber"
                  value={formData.teamNumber}
                  onChange={handlePhoneInput}
                  maxLength="13"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>팀 연령대</td>
              <td><input type="number" name="teamOld" value={formData.teamOld} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>필요 포지션</td>
              <td><input type="text" name="needPosition" value={formData.needPosition} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>필요 포지션 수</td>
              <td><input type="number" name="needPositionNumber" value={formData.needPositionNumber} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>선출 수</td>
              <td><input type="number" name="athleteNumber" value={formData.athleteNumber} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>팀 소개</td>
              <td><textarea name="contents" value={formData.contents} onChange={handleChange} required></textarea></td>
            </tr>
          </tbody>
        </table>
        <div className="btn-container-SC">
          <input type="submit" value="저장" className="BTN" />
          <button type="button" className="BTN" onClick={() => navigate(`/soccerTeam/${teamIdx}`)}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default SoccerTeamModify;
