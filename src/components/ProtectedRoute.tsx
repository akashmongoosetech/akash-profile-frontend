import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isTokenExpired, removeAuthToken } from '../utils/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page but save the current location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check if token is expired
  if (isTokenExpired()) {
    // Remove expired token
    removeAuthToken();
    // Redirect to login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
