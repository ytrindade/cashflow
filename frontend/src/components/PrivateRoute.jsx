import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authSession';

export default function PrivateRoute({ Component }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
}
