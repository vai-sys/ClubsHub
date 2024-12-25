import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminDashboard from './Pages/AdminDashboard';
import StudentDashboard from './Pages/StudentDashboard';
import PrivateRoute from './components/PrivateRoute';
import Profile from './Pages/Profile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute roles={['superAdmin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route  path='/student-dashboard' 
          element={
            <PrivateRoute roles={['student']}>
              <StudentDashboard/>
            </PrivateRoute>
          }
          />

          <Route path="/profile" element={
<PrivateRoute roles={['superAdmin','student','clubAdmin']}>
<Profile />
</PrivateRoute>

          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;