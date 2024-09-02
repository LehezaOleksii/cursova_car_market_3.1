import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {      
      const response = await axios.post('/auth/authenticate', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const { userId, jwt, role } = response.data;
      localStorage.setItem('jwtToken', jwt);
      localStorage.setItem('id', userId);
      switch (role) {
        case 'ROLE_CLIENT':
          window.location.href = '/client';
          break;
        case 'ROLE_MANAGER':
          window.location.href = '/manager';
          break;
        case 'ROLE_ADMIN':
          window.location.href = '/admin';
          break;
        default:
          window.location.href = '/login';
          break;
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card mt-5 shadow" style={{ borderRadius: '20px' }}>
            <div className="card-header text-center">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{ borderRadius: '25px' }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ borderRadius: '25px' }}
                />
              </div>
              <div className="d-flex justify-content-between mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="remember-me"
                  />
                  <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
                </div>
                <div>
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              </div>
              <div className="d-grid mb-3">
                <button onClick={handleLogin} className="btn btn-primary btn-pill" style={{ borderRadius: '25px' }}>Login</button>
              </div>
              {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="card-footer text-center">
              <small className="text-muted">Don't have an account? <a href="/signup">Sign up</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
