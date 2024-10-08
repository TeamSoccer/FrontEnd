import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/JoinLogin.css';
import '../css/CommonStyle.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'ID를 입력하세요.';
    }
    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login?username=${username}&password=${password}`, {
        username,
        password,
      }, { withCredentials: true });

      // 응답 헤더에서 토큰 추출
      const token = response.headers['authorization'];

      onLogin(token);  // 성공 시 onLogin 호출하여 App.js에서 상태 업데이트
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="joinlogin-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className='JoinLogin-form'>
        <input
          type="text"
          placeholder="ID를 입력하세요."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}
        <input
          type="password"
          placeholder="패스워드를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}
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