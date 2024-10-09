import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const roleHierarchy = {
  "ROLE_CLIENT": 1,
  "ROLE_MANAGER": 2,
  "ROLE_ADMIN": 3,
};

const PrivateRoute = ({ children, redirect, requiredRole }) => {
  const authenticate = localStorage.getItem('jwtToken') ? true : false;
  const userRole = localStorage.getItem('role'); // Assume userRole is stored in localStorage
  console.log(userRole);
  console.log(requiredRole);

  const location = useLocation();

  const hasAccess = requiredRole
    ? roleHierarchy[userRole] >= roleHierarchy[requiredRole]
    : true;

  return authenticate && hasAccess ? (
    children
  ) : (
    <Navigate
      to={`/login?redirect=${encodeURIComponent(redirect || location.pathname)}`}
    />
  );
};

export default PrivateRoute;
