import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import '../CSS/AdminLogs.css';
import '../CSS/responsive-utils.css';

export default function AdminLogs() {
   const [logs, setLogs] = useState([]);
   const [loadingLogs, setLoadingLogs] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10); // You can adjust this number

   const desiredLogColumns = [
      "user_id",
      "email",
      "user_role",
      "action_type",
      "created_at",
   ];

   // Filter logs based on search term - search ALL columns
   const filteredLogs = logs.filter(log => {
      const searchLower = searchTerm.toLowerCase().trim();

      if (!searchLower) return true;

      return desiredLogColumns.some(column => {
         let cellValue = log[column];

         if (cellValue === null || cellValue === undefined) return false;

         // Special handling for date column
         if (column === "created_at") {
            try {
               const dateObj = new Date(cellValue);

               const formattedDate = dateObj.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
               }); // e.g. "August 29, 2025"

               const shortDate = dateObj.toISOString().split("T")[0]; // e.g. "2025-08-29"
               const time = dateObj.toLocaleTimeString("en-US"); // e.g. "10:30:15 AM"

               return (
                  formattedDate.toLowerCase().includes(searchLower) ||
                  shortDate.toLowerCase().includes(searchLower) ||
                  time.toLowerCase().includes(searchLower) ||
                  String(cellValue).toLowerCase().includes(searchLower)
               );
            } catch (err) {
               return String(cellValue).toLowerCase().includes(searchLower);
            }
         }

         // For all other columns
         const stringValue = String(cellValue).toLowerCase();
         return stringValue.includes(searchLower);
      });
   });

   // Pagination
   const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentLogs = filteredLogs.slice(startIndex, endIndex);

   useEffect(() => {
      setCurrentPage(1);
   }, [searchTerm]);

   useEffect(() => {
      setLoadingLogs(true);
      fetch(import.meta.env.VITE_LOGS_GET)
         .then(res => res.json())
         .then(json => setLogs(json.data || []))
         .catch(() => setLogs([]))
         .finally(() => setLoadingLogs(false));
   }, []);

   const handleSearchChange = (e) => setSearchTerm(e.target.value);

   const handlePageChange = (page) => setCurrentPage(page);

   const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
   };

   const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
   };

   // Format created_at for table display
   const formatDate = (dateStr) => {
      try {
         const dateObj = new Date(dateStr);
         return dateObj.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
         }); // e.g. "Aug 29, 2025, 10:30 AM"
      } catch {
         return dateStr;
      }
   };

   return (
      <>
         <AdminNavBar>
            {/* Header and Search Bar */}
            <div className="logs-header-container">
               <h2 className="logs-title">Logs</h2>
               <form className="logs-search-form" onSubmit={e => e.preventDefault()}>
                  <div className="logs-search-container">
                     <input
                        type="text"
                        placeholder="Search in all columns..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="logs-search-input"
                     />
                     <svg
                        className="logs-search-icon"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                     >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                     </svg>
                  </div>
               </form>
            </div>

            {/* Description */}
            <div
               className="logs-description"
               style={{
                  color: '#52677D',
                  fontFamily: 'Roboto Mono, monospace',
                  fontSize: '1.1em',
                  margin: '1rem auto 1.5rem auto',
                  fontWeight: 500,
                  maxWidth: 1200,
                  padding: '0 2rem',
                  textAlign: 'center',
               }}
            >
               This is the logs, where you can see the user's activity.
            </div>

            {/* Table */}
            <div
               className="admin-logs-outer-container scroll-horizontal"
               style={{
                  maxWidth: 1200,
                  margin: '2rem auto',
                  padding: '2rem 3rem',
                  background: '#fff',
                  borderRadius: 18,
                  boxShadow: '0 8px 32px rgba(51,78,123,0.13)',
                  border: '2px solid #334E7B',
               }}
            >
               <div
                  className="admin-logs-container min-width-container"
                  style={{
                     border: 'none',
                     background: 'transparent',
                     boxShadow: 'none',
                     padding: 0,
                     maxWidth: '100%',
                     margin: '0 auto',
                  }}
               >
                  <div
                     className="admin-logs-table-wrapper"
                     style={{
                        border: '1.5px solid #bfc9d9',
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: '#fff',
                        marginTop: 0,
                        width: '100%',
                        maxWidth: '100%',
                     }}
                  >
                     <table
                        className="admin-logs-table"
                        style={{
                           width: '100%',
                           borderCollapse: 'collapse',
                           background: 'none',
                        }}
                     >
                        <thead>
                           <tr
                              style={{
                                 background: '#d3d6db',
                                 color: '#22314a',
                                 fontWeight: 700,
                                 fontSize: '1.1em',
                                 fontFamily: 'Roboto Mono, monospace',
                              }}
                           >
                              {desiredLogColumns.map(col => (
                                 <th
                                    className="admin-logs-th"
                                    key={col}
                                    style={{
                                       padding: '0.9em 1.2em',
                                       border: 'none',
                                       background: 'none',
                                       color: '#22314a',
                                       fontWeight: 700,
                                       fontSize: '1.1em',
                                       fontFamily: 'Roboto Mono, monospace',
                                    }}
                                 >
                                    {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                 </th>
                              ))}
                           </tr>
                        </thead>
                        <tbody>
                           {loadingLogs ? (
                              <tr>
                                 <td
                                    colSpan={desiredLogColumns.length}
                                    style={{
                                       textAlign: 'center',
                                       padding: '2em',
                                       color: '#2563eb',
                                       fontWeight: 600,
                                       fontSize: '1.1em',
                                    }}
                                 >
                                    Loading...
                                 </td>
                              </tr>
                           ) : currentLogs.length === 0 ? (
                              <tr>
                                 <td
                                    colSpan={desiredLogColumns.length}
                                    style={{
                                       textAlign: 'center',
                                       padding: '2em',
                                       color: '#bfc9d9',
                                       fontWeight: 600,
                                       fontSize: '1.1em',
                                    }}
                                 >
                                    {searchTerm ? 'No logs found matching your search.' : 'No logs found.'}
                                 </td>
                              </tr>
                           ) : (
                              currentLogs.map((row, idx) => (
                                 <tr
                                    key={row.log_id || idx}
                                    style={{
                                       background: idx % 2 === 0 ? '#f7faff' : '#fff',
                                    }}
                                 >
                                    {desiredLogColumns.map(col => (
                                       <td
                                          className={`admin-logs-td${idx % 2 === 0 ? '' : ' alt'}`}
                                          key={col}
                                          style={{
                                             padding: '0.8em 1.2em',
                                             border: 'none',
                                             color: '#22314a',
                                             fontFamily: 'Roboto Mono, monospace',
                                             fontSize: '1.05em',
                                             background: 'none',
                                          }}
                                       >
                                          {col === "created_at"
                                             ? formatDate(row[col])
                                             : row[col]}
                                       </td>
                                    ))}
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination */}
                  {!loadingLogs && filteredLogs.length > 0 && (
                     <div className="pagination-container">
                        <div className="pagination-info">
                           Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
                           {searchTerm && ` (filtered from ${logs.length} total)`}
                        </div>

                        <div className="pagination-controls">
                           <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="pagination-btn"
                           >
                              Previous
                           </button>

                           {/* Page Numbers */}
                           <div className="pagination-numbers">
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                 let pageNum;
                                 if (totalPages <= 5) {
                                    pageNum = i + 1;
                                 } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                 } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                 } else {
                                    pageNum = currentPage - 2 + i;
                                 }

                                 return (
                                    <button
                                       key={pageNum}
                                       onClick={() => handlePageChange(pageNum)}
                                       className={`pagination-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                                    >
                                       {pageNum}
                                    </button>
                                 );
                              })}
                           </div>

                           <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="pagination-btn"
                           >
                              Next
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </AdminNavBar>
      </>
   );
}
