import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailConfirmation = () => {
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      confirmEmail(token);
    }
  }, [location]);

  const confirmEmail = async (token) => {
    try {
      const response = await axios.get(`auth/confirm-email?token=${token}`);
      if (response.status === 200) {
        window.location.href = '/login';
    }
    } catch (error) {
      alert('Failed to confirm email. Please try again.');
    }
  };

  return (
    <div className="container">
    </div>
  );
};

export default EmailConfirmation;
