import React from "react";
import AdminNavBar from '../components/AdminNavBar';
import '../CSS/AdminHome.css';

export default function AdminHome() {
  return (
    <>
      <AdminNavBar>
        <div className="dashboard-cards-container">
          <div className="dashboard-card">
            Latest Logs
          </div>
          <div className="dashboard-card">
            Latest Logs
          </div>
        </div>
      </AdminNavBar>
    </>
  );
}