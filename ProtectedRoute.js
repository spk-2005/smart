import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the admin is logged in
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');

  // If not logged in, redirect to the sign-in page
  if (!isAdminLoggedIn) {
    return <Navigate to="/adminsig" />;
  }

  // If logged in, render the protected page
  return children;
};

export default ProtectedRoute;
