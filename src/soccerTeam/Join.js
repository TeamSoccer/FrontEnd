import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Join() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    <div className="container">
      <h2>환영합니다! </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="ID를 입력하세요."
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="패스워드를 입력하세요."
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="passwordConfirm"
          placeholder="패스워드를 다시 입력하세요."
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="이름을 입력하세요."
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="이메일을 입력하세요."
          value={formData.email}
          onChange={handleChange}
        />
        <input type="submit" value="회원가입" />
      </form>
    </div>
  );
}

export default Join;
