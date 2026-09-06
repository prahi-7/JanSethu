import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    const roleMap = {
      citizen: '/citizen/dashboard',
      student: '/student/dashboard',
      admin: '/admin/dashboard',
      mentor: '/mentor/dashboard',
      industry: '/industry/dashboard',
    };
    return <Navigate to={roleMap[user?.role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;