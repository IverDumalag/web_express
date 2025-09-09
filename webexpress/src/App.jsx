import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserLogin from './user/UserLogin';
import UserRegister from './user/UserRegister';
import TempAdminPage from './admin/TempAdminPage';
import TempUserPage from './user/TempUserPage';
import { UserProtectedRoute, AdminProtectedRoute } from './utils/ProtectedRoute';
import UserHome from './user/UserHome';
import UserSettings from './user/UserSettings';
import UserProfile from './user/UserProfile';
import TrySearch from './pages/TrySearch';
import UserArchived from './user/UserArchived';
import AdminHome from './admin/AdminHome';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminLogs from './admin/AdminLogs';
import UserCardsPage from './user/UserCardsPage';
import UserMenuPage from './user/UserMenuPage';
import UserAboutPage from './user/UserAboutPage'; 
import UserHelpPage from './user/UserHelpPage';   
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/trysearch" element={<TrySearch />} />

        {/* User Protected Routes */}
        <Route element={<UserProtectedRoute />}>  
          <Route path="/tempuser" element={<TempUserPage />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/usersettings" element={<UserSettings />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/userarchived" element={<UserArchived />} />
          <Route path="/usercards" element={<UserCardsPage />} />
          <Route path="/usermenu" element={<UserMenuPage />} />
          <Route path="/userabout" element={<UserAboutPage />} />
          <Route path="/userhelp" element={<UserHelpPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
           <Route path="/tempadmin" element={<TempAdminPage />} />
           <Route path="/adminhome" element={<AdminHome />} />
           <Route path="/adminanalytics" element={<AdminAnalytics/>} />
           <Route path="/adminlogs" element={<AdminLogs/>} />
        </Route>
      </Routes>
    </Router>
  );
}
