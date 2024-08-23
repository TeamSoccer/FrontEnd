import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/JoinLogin.css';
import '../css/CommonStyle.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:8080/login?username=${username}&password=${password}`, {
        username,
        password,
      }, { withCredentials: true });

      localStorage.setItem('token', response.headers.getAuthorization);
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="joinlogin-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID를 입력하세요."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="패스워드를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="로그인" className="btn-joinlogin" />
      </form>
      <div className="join-link-container">
        <span className="join-link-text">계정이 없으신가요?</span>
        <button className="btn-join-link" onClick={() => navigate('/join')}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
