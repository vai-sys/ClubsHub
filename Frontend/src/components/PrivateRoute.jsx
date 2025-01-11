import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  
  if (loading) {
    return <div>Loading...</div>;
  }

  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (roles && !roles.includes(user.role)) {
 
    const currentPath = location.pathname;
    if (user.role === 'student' && currentPath !== '/student-dashboard') {
      return <Navigate to="/student-dashboard" replace />;
    }
    if (user.role === 'clubAdmin' && currentPath !== '/admin-dashboard') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if(user.role==='facultyCoordinator' && currentPath!=='/faculty-coordinater-dashboard')
    return <Navigate to="/faculty-coordinater-dashboard" replace />;
  }

  
  return children;
};

export default PrivateRoute;