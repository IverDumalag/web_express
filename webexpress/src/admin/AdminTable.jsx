import React from "react";

export default function AdminTable({ title, data, labelName, countName, percentName }) {
  return (
    <div className="admin-table-container">
      <style>{`
        .admin-table-container {
          width: 100%;
          overflow-x: auto;
          margin-bottom: 3vw;
        }
        .admin-table-title {
          color: #2563eb;
          font-weight: 600;
          font-size: 1em;
          margin-bottom: 0.5em;
          text-align: left;
        }
        table.admin-table {
          width: 100%;
          border-collapse: collapse;
          background: #f8faff;
          border-radius: 1vw;
          overflow: hidden;
        }
        .admin-table th, .admin-table td {
          padding: 0.7em 1em;
          text-align: left;
        }
        .admin-table th {
          background: #2563eb;
          color: #fff;
          font-weight: 600;
        }
        .admin-table tr:nth-child(even) {
          background: #e8f0fe;
        }
        .admin-table td {
          color: #2563eb;
        }
        @media (max-width: 600px) {
          .admin-table th, .admin-table td {
            padding: 0.5em 0.5em;
            font-size: 0.95em;
          }
        }
      `}</style>
      <div className="admin-table-title">{title}</div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{labelName}</th>
            <th>{countName}</th>
            {percentName && <th>{percentName}</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.label + idx}>
              <td>{row.label}</td>
              <td>{row.count}</td>
              {percentName && <td>{row.percent}%</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}