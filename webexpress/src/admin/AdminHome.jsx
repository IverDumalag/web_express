import React from "react";
import AdminNavBar from '../components/AdminNavBar';

export default function AdminHome() {
  return (
    <>
      <style>{`
        .dashboard-cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2vw;
          justify-content: center;
          padding: 5vw 0 0 0;
        }
        .dashboard-card {
          background: #fff;
          border-radius: 1.5vw;
          box-shadow: 0 2px 16px rgba(37,99,235,0.08);
          min-width: 260px;
          max-width: 340px;
          width: 90vw;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2vw 2vw 2vw 2vw;
          font-size: 1.3em;
          color: #2563eb;
          font-weight: 600;
        }
      `}</style>
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