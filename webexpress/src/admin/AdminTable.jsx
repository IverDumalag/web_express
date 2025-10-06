import React from "react";
import "../CSS/AdminTable.css";

export default function AdminTable({ title, data, labelName, countName, percentName, extraColumns = [] }) {
  return (
    <div className="admin-table-container">
      <div className="admin-table-title">{title}</div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{labelName}</th>
            <th>{countName}</th>
            {percentName && <th>{percentName}</th>}
            {extraColumns.map((col, idx) => (
              <th key={idx}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.label + idx}>
              <td>{row.label}</td>
              <td>{row.count}</td>
              {percentName && <td>{row.percent}{percentName === 'Email' ? '' : '%'}</td>}
              {extraColumns.map((col, colIdx) => (
                <td key={colIdx}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}