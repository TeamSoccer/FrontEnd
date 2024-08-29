import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/PlayerWrite.css';

function PlayerWrite() {
  const { teamIdx } = useParams(); 
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    position: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      newErrors.content = '자기소개를 입력해주세요.';
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

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/enroll`, {
        ...formData,
        teamId: teamIdx,
        title: formData.title,
        content: formData.content
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
      <h2>입단 신청</h2>
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
              <td colSpan="2"><textarea name="content" value={formData.content} onChange={handleChange} required></textarea></td>
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
          <button type="button" className="btnP" onClick={() => navigate(`/soccerTeam/${teamIdx}`)}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default PlayerWrite;
