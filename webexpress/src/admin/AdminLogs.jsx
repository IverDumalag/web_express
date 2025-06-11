import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import '../CSS/AdminLogs.css';

export default function AdminLogs() {
   const [logs, setLogs] = useState([]);
   const [loadingLogs, setLoadingLogs] = useState(true);

   // Fetch logs
   useEffect(() => {
      setLoadingLogs(true);
      fetch(import.meta.env.VITE_LOGS_GET)
         .then(res => res.json())
         .then(json => setLogs(json.data || []))
         .catch(() => setLogs([]))
         .finally(() => setLoadingLogs(false));
   }, []);

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
               <div className="analytics-section" style={{ border: '2px solid #334E7B', borderRadius: 10, width: 'auto', maxWidth: '1200px', margin: '4.5rem auto 2rem auto' }}>
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