
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminDashboard from "./Pages/AdminDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./Pages/Profile";
import Clubs from "./Pages/Clubs";
import ClubDetails from "./Pages/ClubDetails";
import Events from "./Pages/Events";
import EventInfo from "./Pages/EventInfo";
import Navbar from "./components/Navbar";
import FacultyDashboard from "./Pages/FacultyDashboard";
import SuperAdminDashboard from "./Pages/SuperAdminDashboard"
import CreateEvent from "./components/CreateEvent";
import Calendar from "./components/Calender";

import CreateAnnouncement from "./Pages/CreateAnnouncement";
import EditAnnouncement from "./Pages/EditAnnouncement";
import ListAnnouncement from "./Pages/ListAnnouncements";



const AppContent = () => {
  const location = useLocation();
  const showNavbar = !['/login', '/'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />




        <Route
          path="/create-event"
          element={
            <PrivateRoute roles={["clubAdmin"]}>
              <CreateEvent />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute roles={["clubAdmin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-dashboard"
          element={
            <PrivateRoute roles={["member"]}>
              <StudentDashboard />
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

           <Route  path='/superAdmin-dashboard' 
          element={
            <PrivateRoute roles={['superAdmin']}>
              <SuperAdminDashboard/>
            </PrivateRoute>
          }
          />


        <Route
          path="/profile"
          element={
            <PrivateRoute roles={["superAdmin", "member", "clubAdmin","facultyCoordinator"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route  path="/calender" element={
          <PrivateRoute roles={["superAdmin", "facultyCoordinator", "clubAdmin",]}>
            <Calendar/>
          </PrivateRoute>
        }  />


          
           
<Route
  path="/create-announcement"
  element={
    <PrivateRoute roles={["clubAdmin", "superAdmin"]}>
      <CreateAnnouncement />
    </PrivateRoute>
  }
/>


<Route
  path="/announcements"
  element={
    <PrivateRoute roles={["clubAdmin", "superAdmin", "facultyCoordinator", "member"]}>
      <ListAnnouncement />
    </PrivateRoute>
  }
/>
{/* 

<Route
  path="/edit-announcement/:id"
  element={
    <PrivateRoute roles={["clubAdmin", "superAdmin"]}>
      <EditAnnouncement />
    </PrivateRoute>
  }
/> */}








        <Route path="/clubs" element={<Clubs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventInfo />} />
        <Route path="/club/:id" element={<ClubDetails />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;