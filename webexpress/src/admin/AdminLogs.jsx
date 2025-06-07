import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import { Bar } from "react-chartjs-2";
import '../CSS/AdminLogs.css';
import {
   Chart as ChartJS,
   BarElement,
   CategoryScale,
   LinearScale,
   Tooltip,
   Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// API URLs
const API_MAIN_CONCERN = import.meta.env.VITE_ANALYTICS_MAINCONCERN;
const API_LOGS = import.meta.env.VITE_LOGS_GET;
const API_FEEDBACK = import.meta.env.VITE_FEEDBACK_GET;

function Modal({ open, onClose, children }) {
   if (!open) return null;
   return (
      <div className="modal-overlay" onClick={onClose}>
         <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">&times;</button>
            {children}
         </div>
      </div>
   );
}

export default function AdminLogs() {
   const [mainConcerns, setMainConcerns] = useState([]);
   const [logs, setLogs] = useState([]);
   const [feedback, setFeedback] = useState([]);
   const [loadingMain, setLoadingMain] = useState(true);
   const [loadingLogs, setLoadingLogs] = useState(true);
   const [loadingFeedback, setLoadingFeedback] = useState(false);
   const [showFeedbackModal, setShowFeedbackModal] = useState(false);

   // Fetch main concerns
   useEffect(() => {
      setLoadingMain(true);
      fetch(API_MAIN_CONCERN)
         .then(res => res.json())
         .then(json => setMainConcerns(json.data || []))
         .catch(() => setMainConcerns([]))
         .finally(() => setLoadingMain(false));
   }, []);

   // Fetch logs
   useEffect(() => {
      setLoadingLogs(true);
      fetch(API_LOGS)
         .then(res => res.json())
         .then(json => setLogs(json.data || []))
         .catch(() => setLogs([]))
         .finally(() => setLoadingLogs(false));
   }, []);

   // Fetch feedback when modal is opened
   useEffect(() => {
      if (!showFeedbackModal) return;
      setLoadingFeedback(true);
      fetch(API_FEEDBACK)
         .then(res => res.json())
         .then(json => setFeedback(json.data || []))
         .catch(() => setFeedback([]))
         .finally(() => setLoadingFeedback(false));
   }, [showFeedbackModal]);

   // Bar chart data for main concerns
   const barData = {
      labels: mainConcerns.map(c => c.main_concern),
      datasets: [
         {
            label: "Count",
            data: mainConcerns.map(c => c.concern_count),
            backgroundColor: "#2563eb",
         },
      ],
   };

   const barOptions = {
      responsive: true,
      plugins: {
         legend: { display: false },
         tooltip: {
            callbacks: {
               label: ctx => ` ${ctx.raw} feedbacks`,
            },
         },
      },
      scales: {
         x: {
            ticks: { color: "#2563eb", font: { size: 14 } },
            grid: { color: "rgba(37,99,235,0.08)" },
         },
         y: {
            beginAtZero: true,
            ticks: { color: "#2563eb", font: { size: 14 } },
            grid: { color: "rgba(37,99,235,0.08)" },
         },
      },
      onClick: () => setShowFeedbackModal(true),
   };

   // Define the columns you want to display for logs
   const desiredLogColumns = [
      "user_id",
      "email",
      "user_role",
      "action_type",
      "object_type",
      "created_at",
   ];

   return (
      <>
         <AdminNavBar>
            <div className="admin-logs-container">
               {/* Section 1: Main Concern Bar Chart */}
               <div className="analytics-section">
                  <h2 className="section-title">Main Concerns (Feedback)</h2>
                  <div
                     className="bar-chart-box"
                     title="Click to view all feedback"
                     onClick={() => setShowFeedbackModal(true)}
                  >
                     {loadingMain ? (
                        <div className="admin-logs-loading">Loading...</div>
                     ) : (
                        <Bar data={barData} options={barOptions} />
                     )}
                  </div>
                  <Modal open={showFeedbackModal} onClose={() => setShowFeedbackModal(false)}>
                     <AdminTable
                        title="All Feedback"
                        data={feedback.map(row => ({
                           label: row.main_concern,
                           count: row.details,
                           percent: null,
                           email: row.email,
                           created_at: row.created_at,
                        }))}
                        labelName="Main Concern"
                        countName="Details"
                        percentName={null}
                     />
                     {loadingFeedback && (
                        <div className="admin-logs-loading">Loading...</div>
                     )}
                  </Modal>
               </div>

               {/* Section 2: Logs Table */}
               <div className="analytics-section">
                  <h2 className="section-title">Logs</h2>
                  {loadingLogs ? (
                     <div className="admin-logs-loading">Loading...</div>
                  ) : (
                     <div className="admin-logs-table-wrapper">
                        <table className="admin-logs-table">
                           <thead>
                              <tr>
                                 {desiredLogColumns.map(col => (
                                    <th className="admin-logs-th" key={col}>
                                       {col.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                    </th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody>
                              {logs.map((row, idx) => (
                                 <tr key={row.log_id || idx}>
                                    {desiredLogColumns.map(col => (
                                       <td
                                          className={`admin-logs-td${idx % 2 === 0 ? '' : ' alt'}`}
                                          key={col}
                                       >
                                          {row[col]}
                                       </td>
                                    ))}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
         </AdminNavBar>
      </>
   );
}