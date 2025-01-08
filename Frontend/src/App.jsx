import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminDashboard from './Pages/AdminDashboard';
import StudentDashboard from './Pages/StudentDashboard';
import PrivateRoute from './components/PrivateRoute';
import Profile from './Pages/Profile';
import Clubs from './Pages/Clubs'
import ClubDetails from './Pages/ClubDetails';
import Events from './Pages/Events';
import EventInfo from './Pages/EventInfo'
import SuperAdminDashboard from './Pages/SuperAdminDashboard';
import FacultyDashboard from './Pages/FacultyDashboard';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          <Route
            path="/clubAdmin-dashboard"
            element={
              <PrivateRoute roles={['clubAdmin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route  path='/member-dashboard' 
          element={
            <PrivateRoute roles={['member']}>
              <StudentDashboard/>
            </PrivateRoute>
          }
          />
           <Route  path='/superAdmin-dashboard' 
          element={
            <PrivateRoute roles={['superAdmin']}>
              <SuperAdminDashboard/>
            </PrivateRoute>
          }
          />
           <Route  path='/faculty-coordinater-dashboard' 
          element={
            <PrivateRoute roles={['facultyCoordinator']}>
               <FacultyDashboard/>
            </PrivateRoute>
          }
          />


          <Route path="/profile" element={
<PrivateRoute roles={['superAdmin','member','clubAdmin','facultyCoordinator']}>
<Profile />
</PrivateRoute>

          } />




          
<Route path="/clubs" element={<Clubs/>} />

<Route path="/events" element={<Events/>} />

<Route path="/events/:id" element={<EventInfo/>}/>


<Route path="/club/:id" element={<ClubDetails />} />
        </Routes>




      </Router>


      
    </AuthProvider>
  );
};

export default App;


