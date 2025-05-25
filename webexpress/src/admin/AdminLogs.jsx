import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import { Bar } from "react-chartjs-2";
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
         <style>{`
            .modal-overlay {
               position: fixed;
               z-index: 1000;
               left: 0; top: 0; right: 0; bottom: 0;
               background: rgba(37,99,235,0.18);
               display: flex;
               align-items: center;
               justify-content: center;
            }
            .modal-content {
               background: #fff;
               border-radius: 1vw;
               box-shadow: 0 4px 32px rgba(37,99,235,0.18);
               padding: 2vw;
               max-width: 95vw;
               max-height: 90vh;
               overflow-y: auto;
               position: relative;
            }
            .modal-close-btn {
               position: absolute;
               top: 1vw;
               right: 1vw;
               background: #2563eb;
               color: #fff;
               border: none;
               border-radius: 50%;
               width: 2em;
               height: 2em;
               font-size: 1.2em;
               cursor: pointer;
            }
            @media (max-width: 600px) {
               .modal-content {
                  padding: 3vw 1vw 2vw 1vw;
               }
            }
         `}</style>
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
         <style>{`
            .admin-logs-container {
               padding: 2vw;
            }
            .analytics-section {
               background: #fff;
               border-radius: 1.5vw;
               box-shadow: 0 2px 16px rgba(37,99,235,0.08);
               margin-bottom: 3vw;
               padding: 2vw;
            }
            .section-title {
               color: #2563eb;
               font-size: 1.5em;
               font-weight: 700;
               margin-bottom: 2vw;
               text-align: center;
            }
            .bar-chart-box {
               width: 100%;
               max-width: 700px;
               margin: 0 auto 2vw auto;
               height: 350px;
               background: #fff;
               border-radius: 1vw;
               box-shadow: 0 2px 16px rgba(37,99,235,0.08);
               padding: 2vw 2vw 1vw 2vw;
               box-sizing: border-box;
               cursor: pointer;
               transition: box-shadow 0.2s;
            }
            .bar-chart-box:hover {
               box-shadow: 0 4px 24px rgba(37,99,235,0.18);
            }
            @media (max-width: 600px) {
               .admin-logs-container {
                  padding: 4vw 2vw;
               }
               .analytics-section {
                  padding: 4vw;
                  margin-bottom: 5vw;
               }
               .section-title {
                  font-size: 1.3em;
                  margin-bottom: 4vw;
               }
               .bar-chart-box {
                  height: 60vw;
                  min-height: 180px;
                  padding: 3vw 1vw 2vw 1vw;
                  border-radius: 2vw;
               }
            }
         `}</style>
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
                        <div style={{ color: "#2563eb", textAlign: "center" }}>Loading...</div>
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
                        <div style={{ color: "#2563eb", textAlign: "center" }}>Loading...</div>
                     )}
                  </Modal>
               </div>

               {/* Section 2: Logs Table */}
               <div className="analytics-section">
                  <h2 className="section-title">Logs</h2>
                  {loadingLogs ? (
                     <div style={{ color: "#2563eb", textAlign: "center" }}>Loading...</div>
                  ) : (
                     <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                           <thead>
                              <tr>
                                 {/* Map over desiredLogColumns to create table headers */}
                                 {desiredLogColumns.map(col => (
                                    <th
                                       key={col}
                                       style={{
                                          border: "1px solid #e5e7eb",
                                          padding: "8px",
                                          background: "#f4f6fa",
                                          color: "#2563eb",
                                          fontWeight: 700,
                                          fontSize: "1em",
                                       }}
                                    >
                                       {/* Format column names for display */}
                                       {col.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                    </th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody>
                              {logs.map((row, idx) => (
                                 <tr key={row.log_id || idx}>
                                    {/* Map over desiredLogColumns to display cell data */}
                                    {desiredLogColumns.map(col => (
                                       <td
                                          key={col}
                                          style={{
                                             border: "1px solid #e5e7eb",
                                             padding: "8px",
                                             fontSize: "0.98em",
                                             color: "#22223b",
                                             wordBreak: "break-all",
                                             background: idx % 2 === 0 ? "#fff" : "#f9fafb",
                                          }}
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