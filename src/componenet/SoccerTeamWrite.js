import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/SoccerTeamWrite.css';
import '../css/CommonStyle.css';

function SoccerTeamWrite() {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    region: '',
    phoneNumber: '',
    period: '',
    day: [], // 요일을 배열로 관리
    startTime: '',
    endTime: '',
    ageAverage: '',
    needPosition: '',
    needPositionCnt: '',
    athleteCnt: '',
    contents: ''
  });
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      phoneNumber: formattedPhoneNumber
    });
  };

  const handleDayClick = (teamDay) => {
    setFormData(prevState => {
      const { day } = prevState;
      if (day.includes(teamDay)) {
        return {
          ...prevState,
          day: day.filter(d => d !== teamDay)
        };
      } else {
        return {
          ...prevState,
          day: [...day, teamDay]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('data', (JSON.stringify(formData), { type: 'application/json' }));
    Array.from(files).forEach(file => {
      data.append('files', file);
    });

    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      await axios.post('http://localhost:8080/api/soccerTeam/write', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token // Add the token here
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save the post. Please try again.');
    }
  };

  return (
    <div className="write-container">
      <h2>팀 등록</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              <td><input type="text" name="name" value={formData.name} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>운영 지역</td>
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
                      className={`day-button ${formData.day.includes(day) ? 'selected' : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td>진행 시작 시간</td>
              <td><input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>진행 종료 시간</td>
              <td><input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>운영 기간</td>
              <td><input type="number" name="period" value={formData.period} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>휴대전화 (숫자만 입력)</td>
              <td>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneInput}
                  maxLength="13"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>팀 연령대</td>
              <td><input type="number" name="ageAverage" value={formData.ageAverage} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>필요 포지션</td>
              <td><input type="text" name="needPosition" value={formData.needPosition} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>필요 포지션 수</td>
              <td><input type="number" name="needPositionCnt" value={formData.needPositionCnt} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>선출 수</td>
              <td><input type="number" name="athleteCnt" value={formData.athleteCnt} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>팀 소개</td>
              <td><textarea name="contents" value={formData.contents} onChange={handleChange} required></textarea></td>
            </tr>
          </tbody>
        </table>
        <div className="btn-container-SC">
          <input type="submit" value="저장" className="BTN" />
          <button type="button" className="BTN" onClick={() => navigate('/')}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default SoccerTeamWrite;