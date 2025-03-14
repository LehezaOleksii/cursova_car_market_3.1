import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('jwtToken');
    const expirationTime = Date.now();
    localStorage.setItem('jwtTokenExpiration', expirationTime.toString());
    navigate('/login');
  }, [navigate]);

  return null;
};

export default SignOut;
