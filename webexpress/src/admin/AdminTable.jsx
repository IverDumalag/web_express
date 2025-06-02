import React from "react";
import "../CSS/AdminTable.css";

export default function AdminTable({ title, data, labelName, countName, percentName }) {
  return (
    <div className="admin-table-container">
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