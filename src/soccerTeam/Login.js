import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:8080/api/login?username=${username}&password=${password}`, {
        username,
        password,
      }, { withCredentials: true });

      localStorage.setItem('token', response.headers.token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="패스워드"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
