import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ProtectedRoute = ({
  children,
  adminOnly = false,
  technicianOnly = false,
}) => {
  const { isAuthenticated, loading, user } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || !user) return <Navigate to="/" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/403" />;
  if (technicianOnly && user.role !== 'technician')
    return <Navigate to="/403" />;

  return children;
};

export default ProtectedRoute;
