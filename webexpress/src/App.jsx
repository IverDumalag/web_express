import LandingPage from './Guest/LandingPage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './user/UserLogin';
import UserRegister from './user/UserRegister';
import TempAdminPage from './admin/TempAdminPage';
import TempUserPage from './user/TempUserPage';
import { UserProtectedRoute, AdminProtectedRoute } from './utils/ProtectedRoute';
import UserHome from './user/UserHome';
import UserSettings from './user/UserSettings';
import UserProfile from './user/UserProfile';
import UserArchived from './user/UserArchived';
import AdminHome from './admin/AdminHome';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminLogs from './admin/AdminLogs';
import UserCardsPage from './user/UserCardsPage';
import AdminMainConcern from './admin/AdminMainConcern';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/" element={<LandingPage />} />

        {/* User Protected Routes */}
        <Route element={<UserProtectedRoute />}>  
          <Route path="/tempuser" element={<TempUserPage />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/usersettings" element={<UserSettings />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/userarchived" element={<UserArchived />} />
          <Route path="/usercards" element={<UserCardsPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
           <Route path="/tempadmin" element={<TempAdminPage />} />
           <Route path="/adminhome" element={<AdminHome />} />
           <Route path="/adminanalytics" element={<AdminAnalytics/>} />
           <Route path="/adminlogs" element={<AdminLogs/>} />
           <Route path="/adminmainconcern" element={<AdminMainConcern/>} />
        </Route>

      </Routes>

    </Router>
  );
}