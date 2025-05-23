import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getUserData } from '../data/UserData';

export const UserProtectedRoute = () => {
   const user = getUserData();
   return user && user.role === 'user' ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminProtectedRoute = () => {
   const user = getUserData();
   return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" />;
};
