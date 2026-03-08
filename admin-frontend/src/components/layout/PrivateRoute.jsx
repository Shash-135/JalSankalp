import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('admin_token');
  const location = useLocation();

  if (!token) {
    // Redirect to login if unauthenticated, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
