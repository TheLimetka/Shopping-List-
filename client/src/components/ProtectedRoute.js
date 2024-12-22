import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Users/UserProvider';

const ProtectedRoute = ({ children }) => {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;