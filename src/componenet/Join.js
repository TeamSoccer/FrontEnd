import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/JoinLogin.css';
import '../css/CommonStyle.css';

function Join() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    age: '',
    period: '',
    region: '',
    athlete: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'ID를 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '전화번호는 000-0000-0000 형식이어야 합니다.';
    }
    if (!formData.age || formData.age < 10 || formData.age > 100) {
      newErrors.age = '유효한 나이를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    if (!validate()) {
      return;
    }

    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) =>
        [key, typeof value === 'string' ? value.trim() : value]
      )
    );

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/join`, trimmedData, {
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
          {errors.username && <p className="error">{errors.username}</p>}
          <input
            type="password"
            name="password"
            placeholder="패스워드를 입력하세요."
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <input
            type="password"
            name="passwordConfirm"
            placeholder="패스워드를 다시 입력하세요."
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
          {errors.passwordConfirm && <p className="error">{errors.passwordConfirm}</p>}
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
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요."
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="text"
            name="phoneNumber"
            placeholder="전화번호를 입력하세요."
            value={formData.phoneNumber}
            maxLength="13"
            onChange={handleChange}
            required
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          <input
            type="number"
            name="age"
            placeholder="나이를 입력하세요."
            value={formData.age}
            onChange={handleChange}
            required
          />
          {errors.age && <p className="error">{errors.age}</p>}
        </div>

        <div className="form-section">
          <h3>추가 정보</h3>
          <input
            type="text"
            name="period"
            placeholder="구력을 입력하세요."
            value={formData.period}
            onChange={handleChange}
          />
          <input
            type="text"
            name="region"
            placeholder="지역을 입력하세요."
            value={formData.region}
            onChange={handleChange}
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
