import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/CommonStyle.css';
import '../css/PlayerWrite.css';

function PlayerModify() {
  const { playerIdx } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = location.state || {};
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    position: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state && location.state.enroll) {
      setFormData(location.state.enroll);
    }
  }, [location.state]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '자기소개를 입력해주세요.';
    }
    if (!formData.position.trim()) {
      newErrors.position = '선호 포지션을 입력해주세요.';
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

    const trimmedData = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
      position: formData.position.trim()
  };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/enroll`, trimmedData, {
        headers: { 'Authorization': token }
      });
      navigate(`/playerDetail/${playerIdx}`, { state: { teamId } });
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(errorMessage || '알 수 없는 오류가 발생했습니다.');
      } else {
        console.error('Error updating player:', error);
        alert('서버에 연결할 수 없습니다. 나중에 다시 시도해 주세요.');
      }
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>선수 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <table className="player_write">
          <tbody>
            <tr>
              <td>제목</td>
              <td><input type="text" name="title" value={formData.title} onChange={handleChange} required /></td>
            </tr>
            {errors.title && <p className="error">{errors.title}</p>}
            <tr>
              <td>자기소개</td>
              <td><textarea name="content" value={formData.content} onChange={handleChange} required></textarea></td>
            </tr>
            {errors.content && <p className="error">{errors.content}</p>}
            <tr>
              <td>선호 포지션</td>
              <td colSpan="2"><textarea name="position" value={formData.position} onChange={handleChange} required></textarea></td>
            </tr> 
          </tbody>
        </table>
        <div className="btnP-container">
          <input type="submit" value="저장" className="btnP" />
          <button type="button" className="btnP" onClick={() => navigate(`/playerDetail/${playerIdx}`, { state: { teamId } })}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default PlayerModify;
