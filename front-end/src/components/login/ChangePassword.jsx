import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ChangePassword = () => {
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { email } = location.state || {};

  const validatePassword = () => {
    const passwordUppercase = /[A-Z]/;
    const passwordLowercase = /[a-z]/;
    const passwordDigit = /\d/;
    const passwordSpecialChar = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/;

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return false;
    }
    if (!passwordUppercase.test(newPassword)) {
      setErrorMessage('Password must contain at least one uppercase letter.');
      return false;
    }
    if (!passwordLowercase.test(newPassword)) {
      setErrorMessage('Password must contain at least one lowercase letter.');
      return false;
    }
    if (!passwordDigit.test(newPassword)) {
      setErrorMessage('Password must contain at least one digit.');
      return false;
    }
    if (!passwordSpecialChar.test(newPassword)) {
      setErrorMessage('Password must contain at least one special character.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await axios.post('/auth/change-password', { newPassword, email });
      if (response.status === 200) {
        window.location.href = '/login';
      }
    } catch (error) {
      setErrorMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card mt-5" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-header text-center">
              <h3>Reset Password</h3>
            </div>
            <div className="card-body">
              {errorMessage && (
                <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>
                  <p>{errorMessage}</p>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <input type="hidden" id="email" name="email" value={email} />
                <div className="d-grid mb-2">
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '10px' }}>
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
