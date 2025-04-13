// // import React, { useContext } from 'react';
// // import { Navigate, useLocation } from 'react-router-dom';
// // import { AuthContext } from '../AuthContext';

// // const PrivateRoute = ({ children, roles }) => {
// //   const { user, loading } = useContext(AuthContext);
// //   const location = useLocation();

  
// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

  
// //   if (!user) {
// //     return <Navigate to="/login" state={{ from: location }} replace />;
// //   }


// //   if (roles && !roles.includes(user.role)) {
 
// //     const currentPath = location.pathname;
// //     if (user.role === 'student' && currentPath !== '/student-dashboard') {
// //       return <Navigate to="/student-dashboard" replace />;
// //     }
// //     if (user.role === 'clubAdmin' && currentPath !== '/admin-dashboard') {
// //       return <Navigate to="/admin-dashboard" replace />;
// //     }
// //     if(user.role==='facultyCoordinator' && currentPath!=='/faculty-coordinater-dashboard')
// //     return <Navigate to="/faculty-coordinater-dashboard" replace />;
// //   }

  
// //   return children;
// // };

// // export default PrivateRoute;

// import React, { useContext } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../AuthContext';

// const PrivateRoute = ({ children, roles }) => {
//   const { user, loading } = useContext(AuthContext);
//   const location = useLocation();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (roles && !roles.includes(user.role)) {
//     const currentPath = location.pathname;

//     if (user.role === 'member' && currentPath !== '/member-dashboard') {
//       return <Navigate to="/member-dashboard" replace />;
//     }

//     if (user.role === 'clubAdmin' && currentPath !== '/admin-dashboard') {
//       return <Navigate to="/admin-dashboard" replace />;
//     }

//     if (user.role === 'facultyCoordinator' && currentPath !== '/faculty-coordinater-dashboard') {
//       return <Navigate to="/faculty-coordinater-dashboard" replace />;
//     }

//     if (user.role === 'superAdmin' && currentPath !== '/superAdmin-dashboard') {
//       return <Navigate to="/superAdmin-dashboard" replace />;
//     }

//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;



import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  console.log('PrivateRoute check:');
  console.log('Loading:', loading);
  console.log('User:', user);
  console.log('Required roles:', roles);
  console.log('Current path:', location.pathname);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.warn('User not authenticated. Redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.role) {
    console.warn('User has no role. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    console.warn(`User role "${user.role}" not authorized for path ${location.pathname}`);
    

    switch (user.role) {
      case 'member':
        return <Navigate to="/member-dashboard" replace />;
      case 'clubAdmin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'facultyCoordinator':
        return <Navigate to="/faculty-coordinater-dashboard" replace />;
      case 'superAdmin':
        return <Navigate to="/superAdmin-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
