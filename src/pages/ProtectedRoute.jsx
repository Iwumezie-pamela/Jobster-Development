import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  if (!user) {
    return navigate('/landing');
  }
  return children;
};

export default ProtectedRoute;
