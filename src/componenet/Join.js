import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/JoinLogin.css';
import '../css/CommonStyle.css';

function Join() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    period: '',
    athlete: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.type === 'checkbox') {
      value = e.target.checked;
    } else if (e.target.name === 'phoneNumber') {
      const input = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
      value = input.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/join', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        navigate('/login');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="joinlogin-container">
      <h2>환영합니다!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>계정 정보</h3>
          <input
            type="text"
            name="username"
            placeholder="ID를 입력하세요."
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="패스워드를 입력하세요."
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="패스워드를 다시 입력하세요."
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-section">
          <h3>개인 정보</h3>
          <input
            type="text"
            name="name"
            placeholder="이름을 입력하세요."
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요."
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="전화번호를 입력하세요."
            value={formData.phoneNumber}
            maxLength="13"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="나이를 입력하세요."
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <h3>추가 정보</h3>
          <input
            type="text"
            name="period"
            placeholder="구력을 입력하세요."
            value={formData.period}
            onChange={handleChange}
            // required
          />
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                name="athlete"
                checked={formData.athlete}
                onChange={handleChange}
              />
              선출 여부
            </label>
          </div>
        </div>
        <input type="submit" value="회원가입" className="btn-joinlogin" />
      </form>
    </div>
  );
}

export default Join;