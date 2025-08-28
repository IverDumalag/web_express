import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import '../CSS/AdminLogs.css';

export default function AdminLogs() {
   const [logs, setLogs] = useState([]);
   const [loadingLogs, setLoadingLogs] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10); // You can adjust this number

   // Filter logs based on search term
   const filteredLogs = logs.filter(log => {
      const searchLower = searchTerm.toLowerCase();
      return (
         log.email?.toLowerCase().includes(searchLower) ||
         log.user_role?.toLowerCase().includes(searchLower) ||
         log.action_type?.toLowerCase().includes(searchLower) ||
         log.object_type?.toLowerCase().includes(searchLower) ||
         log.user_id?.toString().includes(searchLower)
      );
   });

   // Calculate pagination
   const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentLogs = filteredLogs.slice(startIndex, endIndex);

   // Reset to first page when search changes
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

   const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
   };

   const handlePageChange = (page) => {
      setCurrentPage(page);
   };

   const handlePrevPage = () => {
      if (currentPage > 1) {
         setCurrentPage(currentPage - 1);
      }
   };

   const handleNextPage = () => {
      if (currentPage < totalPages) {
         setCurrentPage(currentPage + 1);
      }
   };

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
            {/* Header and Search Bar */}
            <div
               style={{
                  maxWidth: 1800,
                  margin: '7.5rem auto 0 auto',
                  padding: '0 8.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
               }}
            >
               <h2
                  className="section-title"
                  style={{
                     fontFamily: 'Roboto Mono, monospace',
                     fontWeight: 800,
                     fontSize: '2.2rem',
                     color: '#22314a',
                     margin: 0,
                     textAlign: 'left',
                     alignSelf: 'flex-start', // ensure left alignment
                  }}
               >
                  Logs
               </h2>
               <form
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: 0,
                     background: 'none',
                     boxShadow: 'none',
                     justifyContent: 'flex-end',
                     margin: 0,
                     alignSelf: 'flex-end',
                     marginLeft: '49.7rem',
                  }}
                  onSubmit={e => e.preventDefault()}
               >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Search by email, role, action..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{
                        border: '1.5px solid #22314a',
                        borderRadius: 12,
                        padding: '0.6em 2.8em 0.6em 1.2em', // extra right padding for icon
                        fontSize: '1.1em',
                        fontFamily: 'Roboto Mono, monospace',
                        outline: 'none',
                        background: '#fff',
                        color: '#22314a',
                        minWidth: 220,
                        marginRight: 0,
                      }}
                    />
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      stroke="#22314a"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                </form>
            </div>

            {/* Description */}
            <div
               style={{
                  color: '#52677D',
                  fontFamily: 'Roboto Mono, monospace',
                  fontSize: '1.1em',
                  margin: '1.2rem auto 1.5rem auto',
                  fontWeight: 500,
                  maxWidth: 1800,
                  padding: '0 8.5rem',
               }}
            >
               This is the logs, where you can see the user’s activity.
            </div>

            {/* Main Logs Table Container */}
            <div
               className="admin-logs-outer-container"
               style={{
                  maxWidth: 1800,
                  margin: '2rem auto',
                  padding: '2.5rem 8.5rem 2rem 8.5rem',
                  background: '#fff',
                  borderRadius: 18,
                  boxShadow: '0 8px 32px rgba(51,78,123,0.13)',
                  border: '2px solid #334E7B',
               }}
            >
               <div
                  className="admin-logs-container"
                  style={{
                     border: 'none',
                     background: 'transparent',
                     boxShadow: 'none',
                     padding: 0,
                     maxWidth: 1700,
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
                        width: '90%', // make the table wrapper wider
                        minWidth: 1100, // ensure it is visually wide
                        maxWidth: '90%',
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
                                    {col
                                       .replace(/_/g, ' ')
                                       .replace(/\b\w/g, l => l.toUpperCase())}
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
                                          {row[col]}
                                       </td>
                                    ))}
                                 </tr>
                              ))
                           )}
                        </tbody>
                     </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  {!loadingLogs && filteredLogs.length > 0 && (
                     <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1.5rem',
                        padding: '0 1rem'
                     }}>
                        <div style={{
                           fontFamily: 'Roboto Mono, monospace',
                           fontSize: '0.9rem',
                           color: '#52677D',
                           fontWeight: 500
                        }}>
                           Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
                           {searchTerm && ` (filtered from ${logs.length} total)`}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              style={{
                                 background: currentPage === 1 ? '#e2e8f0' : '#22314a',
                                 color: currentPage === 1 ? '#94a3b8' : '#fff',
                                 border: 'none',
                                 borderRadius: '8px',
                                 padding: '0.5rem 1rem',
                                 fontFamily: 'Roboto Mono, monospace',
                                 fontSize: '0.9rem',
                                 cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                 fontWeight: 600
                              }}
                           >
                              Previous
                           </button>
                           
                           {/* Page Numbers */}
                           <div style={{ display: 'flex', gap: '0.25rem' }}>
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
                                       style={{
                                          background: currentPage === pageNum ? '#22314a' : '#f1f5f9',
                                          color: currentPage === pageNum ? '#fff' : '#22314a',
                                          border: '1px solid #cbd5e1',
                                          borderRadius: '6px',
                                          padding: '0.4rem 0.75rem',
                                          fontFamily: 'Roboto Mono, monospace',
                                          fontSize: '0.9rem',
                                          cursor: 'pointer',
                                          fontWeight: 600,
                                          minWidth: '35px'
                                       }}
                                    >
                                       {pageNum}
                                    </button>
                                 );
                              })}
                           </div>
                           
                           <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              style={{
                                 background: currentPage === totalPages ? '#e2e8f0' : '#22314a',
                                 color: currentPage === totalPages ? '#94a3b8' : '#fff',
                                 border: 'none',
                                 borderRadius: '8px',
                                 padding: '0.5rem 1rem',
                                 fontFamily: 'Roboto Mono, monospace',
                                 fontSize: '0.9rem',
                                 cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                 fontWeight: 600
                              }}
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
