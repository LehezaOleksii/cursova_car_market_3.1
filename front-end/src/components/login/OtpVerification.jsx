import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState({ otp1: '', otp2: '', otp3: '', otp4: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const { email } = location.state || {};

  useEffect(() => {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });
  }, []);

  const handleChange = (e) => {
    setOtp({ ...otp, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.otp1 + otp.otp2 + otp.otp3 + otp.otp4;
    try {
      const response = await axios.post('/auth/verify-otp', { otp: enteredOtp, email });
      if (response.status === 200) {
        navigate('/change-password', { state: { email } });
      }
    } catch (err) {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    axios.post(`/auth/resend-otp`, { email })
      .then(response => {
        navigate('/forgot-password-otp', { state: { email } });
      })
      .catch(error => {
        setErrorMessage('Failed to resend OTP. Please try again.');
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-header text-center">
              <h3>OTP Verification</h3>
            </div>
            <div className="card-body">
              {errorMessage && <div className="error-message"><p>{errorMessage}</p></div>}
              <form id="otpForm">
                <div className="otp-input-container mb-3" style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    id="otp1"
                    name="otp1"
                    maxLength="1"
                    value={otp.otp1}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '10px', textAlign: 'center', fontSize: '24px', width: '60px', height: '60px', margin: '0 10px' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    id="otp2"
                    name="otp2"
                    maxLength="1"
                    value={otp.otp2}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '10px', textAlign: 'center', fontSize: '24px', width: '60px', height: '60px', margin: '0 10px' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    id="otp3"
                    name="otp3"
                    maxLength="1"
                    value={otp.otp3}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '10px', textAlign: 'center', fontSize: '24px', width: '60px', height: '60px', margin: '0 10px' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    id="otp4"
                    name="otp4"
                    maxLength="1"
                    value={otp.otp4}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '10px', textAlign: 'center', fontSize: '24px', width: '60px', height: '60px', margin: '0 10px' }}
                  />
                </div>
                <div className="d-grid mb-2 col-4 mx-auto">
                  <button type="button" id="verifyOtpBtn" onClick={handleSubmit} className="btn btn-primary" style={{ borderRadius: '10px' }}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <small className="text-muted">Didn't receive the code? <a href="#" onClick={handleResendOtp}>Resend OTP</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
