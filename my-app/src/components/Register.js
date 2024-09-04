// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', { firstName, lastName, email, password });
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="register-input"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <button onClick={handleRegister} className="register-button">Register</button>
        <button onClick={() => navigate('/login')} className="login-button">Go to Login</button>
      </div>
    </div>
  );
};

export default Register;
