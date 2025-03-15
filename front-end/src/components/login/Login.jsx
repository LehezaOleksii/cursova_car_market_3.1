import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('manager@gmail.com');
  const [password, setPassword] = useState('12345678_Password');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (emailValue === 'client@gmail.com' || emailValue === 'manager@gmail.com') {
      setPassword('12345678_Password');
    } else {
      setPassword('');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/authenticate', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { userId, jwt, role } = response.data;
      localStorage.setItem('jwtToken', jwt);
      const expirationTime = Date.now() + 12 * 60 * 60 * 1000;
      localStorage.setItem('jwtTokenExpiration', expirationTime.toString());
      localStorage.setItem('role', role);
      localStorage.setItem('id', userId);

      switch (role) {
        case 'ROLE_CLIENT':
          window.location.href = '/dashboard';
          break;
        case 'ROLE_MANAGER':
          window.location.href = '/dashboard';
          break;
        default:
          window.location.href = '/login';
          break;
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Your account is not activated. Please verify your email account.');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center" >
        <div style={{width:"30vw"}}>
          <div className="card mt-5 shadow" style={{ borderRadius: '20px', }}>
            <div className="card-header text-center">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control box-shadow-06"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                  style={{ borderRadius: '25px' }}
                  list="emailSuggestions"
                />
                <datalist id="emailSuggestions">
                  <option value="client@gmail.com" />
                  <option value="manager@gmail.com" />
                </datalist>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control box-shadow-06"
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
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
                </div>
                <div>
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              </div>
              <div className="d-grid mb-3">
                <button onClick={handleLogin} className="btn btn-primary btn-pill box-shadow-12" style={{ borderRadius: '25px' }}>
                  Login
                </button>
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
