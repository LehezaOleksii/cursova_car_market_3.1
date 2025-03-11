import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (firstName.length < 1 || firstName.length > 100) {
      setError('First name must be between 1 and 100 characters.');
      return false;
    }
    if (lastName.length < 1 || lastName.length > 100) {
      setError('Last name must be between 1 and 100 characters.');
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(firstName)) {
      setError("First name should contain only letters.");
      return false;
    }
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      setError("Last name should contain only letters.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    const passwordUppercase = /[A-Z]/;
    const passwordLowercase = /[a-z]/;
    const passwordDigit = /\d/;
    const passwordSpecialChar = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/;

    if (!passwordUppercase.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return false;
    }
    if (!passwordLowercase.test(password)) {
      setError('Password must contain at least one lowercase letter.');
      return false;
    }
    if (!passwordDigit.test(password)) {
      setError('Password must contain at least one digit.');
      return false;
    }
    if (!passwordSpecialChar.test(password)) {
      setError('Password must contain at least one special character.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/signup', {
        firstName,
        lastName,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("1111111111111111");
      console.log(response);

      if (response.status === 409) {
        setError(response.data);
      } else if (response.status === 201) {
        window.location.href = '/signup-success';
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(err.response.data.message || "This email already taken.");
      } else {
        console.log(err);
        setError("Failed to create account. Please try again.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card mt-5 shadow" style={{ borderRadius: '20px' }}>
            <div className="card-header text-center">
              <h3>Sign Up</h3>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                  style={{ borderRadius: '25px' }}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                  style={{ borderRadius: '25px' }}
                />
              </div>
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
              <div className="mb-2">
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
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  style={{ borderRadius: '25px' }}
                />
              </div>
              <div className="d-grid mb-3">
                <button onClick={handleSignup} className="btn btn-primary btn-pill" style={{ borderRadius: '25px' }}>
                  {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Sign Up'}
                </button>
              </div>
              {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="card-footer text-center">
              <small className="text-muted">Already have an account? <a href="/login">Login</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
