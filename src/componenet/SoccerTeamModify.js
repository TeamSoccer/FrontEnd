import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/CommonStyle.css';
import '../css/SoccerTeamWrite.css';

function SoccerTeamModify() {
  const { teamIdx } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [teamData, setTeamData] = useState();
  const location = useLocation();

  useEffect(() => {
    console.log(location.state.soccerTeam);
    setTeamData(location.state.soccerTeam);
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({
      ...teamData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handlePhoneInput = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    const formattedPhoneNumber = input.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    setTeamData({
      ...teamData,
      phoneNumber: formattedPhoneNumber
    });
  };

  const handleDayClick = (teamDay) => {
    console.log(teamDay.day)
    setTeamData(prevState => {
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
    data.append('data', new Blob([JSON.stringify(teamData)], { type: 'application/json' }));
    Array.from(files).forEach(file => {
      data.append('files', file);
    });

    try {
      const token = localStorage.getItem("token");
      const result = await axios.put(`http://localhost:8080/api/soccerTeam`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      });
      if(result.data != null && result.data.status == 200) {
        navigate('/');
      } else {
        alert(`[${result.code}] ${result.message}`);
        navigate("/");
      }
    } catch (error) {
      console.error('Error updating soccer team:', error);
    }
  };

  if(!teamData) return <div>Loading...</div>;

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
              <td><input type="text" name="title" value={teamData.title} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>팀 이름</td>
              <td><input type="text" name="name" value={teamData.name} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>지역</td>
              <td><input type="text" name="region" value={teamData.region} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>요일</td>
              <td>
                <div className="day-buttons">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`day-button ${teamData.day.includes(day) ? 'selected' : ''}`}
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
              <td><input type="time" name="startTime" value={teamData.startTime} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>진행 종료 시간</td>
              <td><input type="time" name="endTime" value={teamData.endTime} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>운영 기간</td>
              <td><input type="number" name="period" value={teamData.period} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>휴대전화 (숫자만 입력)</td>
              <td>
                <input
                  type="text"
                  name="phoneNumber"
                  value={teamData.phoneNumber}
                  onChange={handlePhoneInput}
                  maxLength="13"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>팀 연령대</td>
              <td><input type="number" name="ageAverage" value={teamData.ageAverage} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>필요 포지션</td>
              <td><input type="text" name="needPosition" value={teamData.needPosition} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>필요 포지션 수</td>
              <td><input type="number" name="needPositionCnt" value={teamData.needPositionCnt} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>선출 수</td>
              <td><input type="number" name="athleteCnt" value={teamData.athleteCnt} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>팀 소개</td>
              <td><textarea name="contents" value={teamData.contents} onChange={handleChange}></textarea></td>
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
