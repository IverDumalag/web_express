// src/pages/AdminAnalytics.jsx
import React, { useEffect, useState, useRef } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import { Line, Pie, Bar } from "react-chartjs-2";
import '../CSS/AdminAnalytics.css';
import '../CSS/responsive-utils.css';
import { getUserData } from '../data/UserData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler, ArcElement, BarElement);

// --- API URLs ---
const API_DAILY = import.meta.env.VITE_USERGROWTHOVERTIMEDAILY;
const API_MONTHLY = import.meta.env.VITE_USERGROWTHOVERTIMEMONTHLY;
const API_DEMOGRAPHICS_SEX = import.meta.env.VITE_ANALYTICS_DEMOGRAPHICS_SEX;
const API_DEMOGRAPHICS_AGE = import.meta.env.VITE_ANALYTICS_DEMOGRAPHICS_AGE;
const API_CONTENT_RATE = import.meta.env.VITE_ANALYTICS_CONTENTRATE;
const API_CONTENT_MATCH = import.meta.env.VITE_ANALYTICS_CONTENTMATCH;
const API_MAIN_CONCERN = import.meta.env.VITE_ANALYTICS_MAINCONCERN;
const API_FEEDBACK = import.meta.env.VITE_FEEDBACK_GET;
const API_LOGS_INSERT = import.meta.env.VITE_LOGS_INSERT;

/* ----------------------- Helpers ----------------------- */
function getDateRange(start, end) {
  const arr = [];
  let dt = new Date(start);
  const endDt = new Date(end);
  while (dt <= endDt) {
    arr.push(dt.toISOString().slice(0, 10));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}
function getMonthRange(start, end) {
  const arr = [];
  let [sy, sm] = start.split("-").map(Number);
  let [ey, em] = end.split("-").map(Number);
  while (sy < ey || (sy === ey && sm <= em)) {
    arr.push(`${sy.toString().padStart(4, "0")}-${sm.toString().padStart(2, "0")}`);
    sm++;
    if (sm > 12) { sm = 1; sy++; }
  }
  return arr;
}
function fillMissing(data, allLabels) {
  const map = {};
  data.forEach(d => { map[d.label] = d.count; });
  return allLabels.map(label => ({
    label,
    count: map[label] !== undefined ? map[label] : 0,
  }));
}
function formatCountData(data, labelKey, countKey) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map(d => {
    const label = d[labelKey] || 'Unknown';
    let count = d[countKey];
    if (typeof count === 'string') count = parseFloat(count) || 0;
    else if (typeof count !== 'number') count = 0;
    return { label: label.toString(), count: Math.round(count) };
  }).filter(item => item.label !== 'Unknown' || item.count > 0);
}
function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Coerce any value to a number (handles "12", "1,234", nulls, etc.)
const toNum = (v) => {
  if (v === null || v === undefined) return 0;
  const n = typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : Number(v);
  return Number.isNaN(n) ? 0 : n;
};


/* ----------------------- Modal ----------------------- */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
}

/* ----------------------- Logging ----------------------- */
async function logDownloadAction(tableName, format) {
  try {
    const userData = getUserData();
    if (!userData) return;
    const logData = {
      user_id: userData.user_id,
      email: userData.email,
      user_role: userData.role || userData.user_role || 'admin',
      action_type: `Download Table - ${tableName} (${format.toUpperCase()})`,
      object_type: 'analytics_download',
      object_id: null,
      old_data: null,
      new_data: { table_name: tableName, format, timestamp: new Date().toISOString() }
    };
    await fetch(API_LOGS_INSERT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(logData)
    });
  } catch { /* non-blocking */ }
}

/* ----------------------- Excel Generators ----------------------- */
function generateExcel(title, summaryData, tableData, tableHeaders) {
  const wb = XLSX.utils.book_new();
  if (tableData && tableData.length > 0) {
    const detailSheetData = [
      tableHeaders,
      ...tableData.map(row =>
        tableHeaders.map(header => {
          const keys = [
            header,
            header.toLowerCase(),
            header.toLowerCase().replace(/ /g, '_'),
            header.toLowerCase().replace(/\s+/g, ''),
            header.replace(/ /g, '_'),
          ];
          for (const k of keys) if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
          return '';
        })
      ),
    ];
    const ws = XLSX.utils.aoa_to_sheet(detailSheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
  } else {
    const ws = XLSX.utils.aoa_to_sheet([
      ['No data available for export'],
      [`Report: ${title}`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
  }
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

function generateUserGrowthExcel(title, summaryData, dailyTableData, monthlyTableData) {
  const wb = XLSX.utils.book_new();
  const summary = [
    [title],
    [`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`],
    [],
    ['Summary'],
    ...summaryData.map(i => [i.label, i.value]),
  ];
  const sWS = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, sWS, 'Summary');

  if (dailyTableData?.length) {
    const dWS = XLSX.utils.aoa_to_sheet([
      ['Daily User Registration Data'],
      [],
      ['Date', 'New Users'],
      ...dailyTableData.map(r => [r.Date, r['New Users']]),
    ]);
    XLSX.utils.book_append_sheet(wb, dWS, 'Daily Data');
  }
  if (monthlyTableData?.length) {
    const mWS = XLSX.utils.aoa_to_sheet([
      ['Monthly User Registration Data'],
      [],
      ['Month', 'New Users'],
      ...monthlyTableData.map(r => [r.Month, r['New Users']]),
    ]);
    XLSX.utils.book_append_sheet(wb, mWS, 'Monthly Data');
  }
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/* ----------------------- PDF helpers (Line) ----------------------- */
function drawNiceLineChart(doc, points, xLabel, yLabel, originX, originY, width, height, colorRGB = [37, 99, 235]) {
  // Axes
  doc.setDrawColor(0); doc.setLineWidth(0.8);
  doc.line(originX, originY + height, originX + width, originY + height);
  doc.line(originX, originY, originX, originY + height);
  // Labels
  doc.setFontSize(10);
  doc.text(xLabel, originX + width / 2, originY + height + 14, { align: 'center' });
  doc.text(yLabel, originX - 18, originY + height / 2, { align: 'center', angle: 90 });
  const maxVal = Math.max(...points.map(p => p.value), 1);
  const stepX = points.length > 1 ? width / (points.length - 1) : width / 2;

  // Grid
  doc.setDrawColor(230); doc.setLineWidth(0.3);
  for (let i = 1; i < 5; i++) {
    const y = originY + (height * i / 5);
    doc.line(originX, y, originX + width, y);
  }

  // Line + points
  doc.setDrawColor(...colorRGB); doc.setLineWidth(1.8);
  const xy = points.map((p, i) => {
    const x = originX + i * stepX;
    const y = originY + height - (p.value / maxVal) * height * 0.85;
    return { x, y, value: p.value };
  });
  for (let i = 0; i < xy.length - 1; i++) doc.line(xy[i].x, xy[i].y, xy[i + 1].x, xy[i + 1].y);
  doc.setFillColor(...colorRGB);
  xy.forEach((pt, i) => {
    doc.circle(pt.x, pt.y, 2.3, 'F');
    if (i === 0 || i === xy.length - 1 || i % Math.max(1, Math.floor(xy.length / 4)) === 0) {
      doc.setFontSize(8); doc.setTextColor(0);
      doc.text(String(pt.value), pt.x, pt.y - 6, { align: 'center' });
    }
  });

  // Y scale labels
  doc.setFontSize(8); doc.setTextColor(90);
  for (let i = 0; i <= 4; i++) {
    const v = Math.round(maxVal * i / 4);
    const y = originY + height - (i * height / 4);
    doc.text(String(v), originX - 8, y, { align: 'right' });
  }
}

function generateUserGrowthPDFWithChart(title, summaryData, dailyTableData, monthlyTableData, legends = null) {
  const doc = new jsPDF();
  // Header
  doc.setFontSize(22); doc.setFont(undefined, 'bold'); doc.text(title, 20, 24);
  doc.setFontSize(11); doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 32);

  // Prefer monthly series if available (fix)
  const series = (monthlyTableData?.length
    ? monthlyTableData.map(r => ({ label: r.Month, value: Number(r['New Users']) || 0 }))
    : dailyTableData?.map(r => ({ label: r.Date, value: Number(r['New Users']) || 0 })) || []);

  doc.setFontSize(15); doc.setFont(undefined, 'bold'); doc.text('User Growth Trend', 20, 52);
  doc.setFontSize(11); doc.setFont(undefined, 'normal');
  doc.text(monthlyTableData?.length ? 'Monthly user registrations over time.' : 'Daily user registrations over time.', 20, 62);

  if (series.length) {
    drawNiceLineChart(doc, series, monthlyTableData?.length ? 'Month' : 'Date', 'New Users', 25, 72, 160, 85, [37, 99, 235]);
  } else {
    doc.setFontSize(12); doc.setTextColor(100);
    doc.text('No data available to render the chart.', 105, 120, { align: 'center' });
  }

  // Summary
  doc.addPage();
  doc.setFontSize(22); doc.setFont(undefined, 'bold'); doc.text(title, 20, 24);
  doc.setFontSize(11); doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 32);

  doc.setFontSize(16); doc.setFont(undefined, 'bold'); doc.text('Summary', 20, 50);
  let y = 62; doc.setFontSize(12); doc.setFont(undefined, 'normal');
  (summaryData || []).forEach(item => { doc.text(`• ${item.label}: ${item.value}`, 25, y); y += 10; });

  if (legends?.length) {
    y += 6; doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text('Legend', 20, y); y += 10;
    doc.setFontSize(12); doc.setFont(undefined, 'normal');
    legends.forEach(l => { doc.text(`• ${l.label}: ${l.value}`, 25, y); y += 8; });
  }

  // Daily table
  if (dailyTableData?.length) {
    doc.addPage();
    doc.setFontSize(16); doc.setFont(undefined, 'bold'); doc.text('Daily User Growth Data', 20, 22);
    autoTable(doc, {
      head: [['Date', 'New Users']],
      body: dailyTableData.map(r => [r.Date, r['New Users']]),
      startY: 30, theme: 'striped',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [51, 78, 123], textColor: 255, fontStyle: 'bold' },
      margin: { top: 30, left: 20, right: 20 },
      didDrawPage: (d) => { doc.setFontSize(10); doc.text(`Page ${d.pageNumber}`, doc.internal.pageSize.width - 28, doc.internal.pageSize.height - 8); }
    });
  }
  // Monthly table
  if (monthlyTableData?.length) {
    doc.addPage();
    doc.setFontSize(16); doc.setFont(undefined, 'bold'); doc.text('Monthly User Growth Data', 20, 22);
    autoTable(doc, {
      head: [['Month', 'New Users']],
      body: monthlyTableData.map(r => [r.Month, r['New Users']]),
      startY: 30, theme: 'striped',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [51, 78, 123], textColor: 255, fontStyle: 'bold' },
      margin: { top: 30, left: 20, right: 20 },
      didDrawPage: (d) => { doc.setFontSize(10); doc.text(`Page ${d.pageNumber}`, doc.internal.pageSize.width - 28, doc.internal.pageSize.height - 8); }
    });
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

/* ----------------------- NEW: Chart.js → base64 for PDF ----------------------- */
// Render a Chart.js chart into an offscreen canvas and return base64 PNG
async function chartToBase64({ type, data, options = {}, width = 600, height = 320 }) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.position = 'fixed';
      canvas.style.left = '-99999px';
      canvas.style.top = '-99999px';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const chart = new ChartJS(ctx, { type, data, options: { ...options, responsive: false, animation: false } });

      requestAnimationFrame(() => {
        const url = canvas.toDataURL('image/png', 1.0);
        chart.destroy();
        document.body.removeChild(canvas);
        resolve(url);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/* ----------------------- NEW: Async PDF with pie/bar embedding ----------------------- */
async function generateChartFirstPDF(title, summaryData, tableData, tableHeaders, legends = null, chartType = 'table') {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22); doc.setFont(undefined, 'bold'); doc.text(title, 20, 24);
  doc.setFontSize(11); doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 32);

  doc.setFontSize(15); doc.setFont(undefined, 'bold');
  let yPos = 54;

  // Use Chart.js → image for 'pie' and 'bar'
  if ((chartType === 'pie' || chartType === 'bar') && Array.isArray(tableData) && tableData.length) {
    const isPie = chartType === 'pie';
    doc.text(isPie ? 'Pie Chart Visualization' : 'Bar Chart Visualization', 20, yPos);
    yPos += 10;
    doc.setFontSize(11); doc.setFont(undefined, 'normal');
    doc.text(isPie ? 'Distribution breakdown:' : 'Category counts:', 20, yPos);
    yPos += 6;

    const labels =
      tableHeaders?.includes('Sex') ? tableData.map(r => r['Sex']) :
      tableHeaders?.includes('Age Group') ? tableData.map(r => r['Age Group']) :
      tableHeaders?.includes('Main Concern') ? tableData.map(r => r['Main Concern']) :
      tableData.map((_, i) => `Item ${i + 1}`);

    const values =
      tableHeaders?.includes('User Count') ? tableData.map(r => (typeof r['User Count'] === 'string' ? parseFloat(r['User Count']) || 0 : r['User Count'] || 0)) :
      tableHeaders?.includes('Concern Count') ? tableData.map(r => (typeof r['Concern Count'] === 'string' ? parseFloat(r['Concern Count']) || 0 : r['Concern Count'] || 0)) :
      tableData.map(() => 0);

    const data = {
      labels,
      datasets: [{
        label: isPie ? 'Share' : 'Count',
        data: values,
        backgroundColor: ["#2563eb","#f59e42","#a5b4fc","#fbbf24","#10b981","#e11d48","#6b7280","#34d399"],
        borderColor: "#ffffff",
        borderWidth: 2
      }]
    };

    const options = isPie ? {
      plugins: { legend: { display: true, position: 'bottom' } }
    } : {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    };

    const img = await chartToBase64({
      type: isPie ? 'pie' : 'bar',
      data,
      options,
      width: 800,
      height: 420
    });

    const imgX = 20;
    const imgY = yPos + 6;
    const imgW = 170;
    const imgH = 90;
    doc.addImage(img, 'PNG', imgX, imgY, imgW, imgH);

    yPos = imgY + imgH + 8;

    if (isPie) {
      doc.setFontSize(10);
      let legendY = yPos;
      const total = values.reduce((a, b) => a + (b || 0), 0) || 1;
      labels.forEach((label, i) => {
        const val = values[i] ?? 0;
        const pct = ((val / total) * 100).toFixed(1);
        doc.text(`${label}: ${val} (${pct}%)`, 20, legendY);
        legendY += 6;
        if (legendY > 260) {
          doc.addPage();
          legendY = 24;
        }
      });
      yPos = legendY + 4;
    }
  } else if (chartType === 'gauge') {
    // --- FIX: draw gauge directly into the PDF (no external chart lib needed) ---
    doc.text('Gauge Chart Visualization', 20, yPos);
    yPos += 12;
    doc.setFontSize(11); 
    doc.setFont(undefined, 'normal');
    doc.text('Overall performance indicator:', 20, yPos);

    // Layout
    const centerX = 105;               // page center-ish
    const centerY = yPos + 55;         // push gauge down a bit
    const radius  = 42;

    // Extract % from summaryData (looks for "Overall Match Rate" or "Overall")
    let pct = 0;
    const overallItem = (summaryData || []).find(i =>
      String(i.label || '').toLowerCase().includes('overall match rate') ||
      String(i.label || '').toLowerCase().includes('overall')
    );
    if (overallItem) {
      const v = typeof overallItem.value === 'string'
        ? parseFloat(overallItem.value.replace('%', ''))
        : Number(overallItem.value);
      pct = isNaN(v) ? 0 : Math.max(0, Math.min(100, v));
    }

    // Helper to approximate an arc with short line segments
    const drawArc = (fromPct, toPct, strokeRGB = [0, 0, 0], lineWidth = 3) => {
      const from = Math.PI + (fromPct / 100) * Math.PI; // left (180°) → right (360°)
      const to   = Math.PI + (toPct   / 100) * Math.PI;
      const steps = Math.max(30, Math.floor((to - from) * 60)); // smoother with bigger radius
      doc.setDrawColor(...strokeRGB);
      doc.setLineWidth(lineWidth);
      let prev = null;
      for (let s = 0; s <= steps; s++) {
        const t = from + (s / steps) * (to - from);
        const x = centerX + radius * Math.cos(t);
        const y = centerY + radius * Math.sin(t);
        if (prev) doc.line(prev.x, prev.y, x, y);
        prev = { x, y };
      }
    };

    // Background arc (light gray) and value arc (blue)
    drawArc(0, 100, [229, 231, 235], 3);  // bg
    drawArc(0, pct,  [37, 99, 235],   3);  // value

    // Needle
    const needleAngle = Math.PI + (pct / 100) * Math.PI;
    const nx = centerX + (radius - 6) * Math.cos(needleAngle);
    const ny = centerY + (radius - 6) * Math.sin(needleAngle);
    doc.setDrawColor(225, 29, 72);
    doc.setLineWidth(2);
    doc.line(centerX, centerY, nx, ny);
    doc.setFillColor(225, 29, 72);
    doc.circle(centerX, centerY, 3, 'F');

    // Tick labels
    doc.setFontSize(8);
    doc.setTextColor(90);
    doc.text('0%',   centerX - radius - 6, centerY + 4);
    doc.text('50%',  centerX,              centerY - radius - 4, { align: 'center' });
    doc.text('100%', centerX + radius + 8, centerY + 4);

    // Big % label + caption
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text(`${pct.toFixed(1)}%`, centerX, centerY + 24, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    doc.text('Content Match Rate', centerX, centerY + 36, { align: 'center' });
    // --- END gauge ---
  }

  // Footer note on first page
  doc.setFontSize(10); doc.setTextColor(0);
  doc.text('Summary and detailed data follow.', 20, 280);

  // Summary page
  doc.addPage();
  doc.setFontSize(22); doc.setFont(undefined, 'bold'); doc.text(title, 20, 24);
  doc.setFontSize(11); doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 32);

  doc.setFontSize(16); doc.setFont(undefined, 'bold'); doc.text('Summary', 20, 50);
  let y = 62; doc.setFontSize(12); doc.setFont(undefined, 'normal');
  (summaryData || []).forEach(item => { doc.text(`• ${item.label}: ${item.value}`, 25, y); y += 10; });

  if (legends?.length) {
    y += 6; doc.setFontSize(14); doc.setFont(undefined, 'bold'); doc.text('Legend', 20, y); y += 10;
    doc.setFontSize(12); doc.setFont(undefined, 'normal');
    legends.forEach(l => { doc.text(`• ${l.label}: ${l.value}`, 25, y); y += 8; });
  }

  // Detailed table
  if (tableData?.length) {
    doc.addPage();
    doc.setFontSize(16); doc.setFont(undefined, 'bold'); doc.text('Detailed Data', 20, 22);
    const body = tableData.map(row => tableHeaders.map(h => {
      const keys = [h, h.toLowerCase(), h.toLowerCase().replace(/ /g, '_'), h.toLowerCase().replace(/\s+/g, ''), h.replace(/ /g, '_')];
      for (const k of keys) if (row[k] !== undefined && row[k] !== null) return row[k];
      return '';
    }));
    autoTable(doc, {
      head: [tableHeaders],
      body,
      startY: 30,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [51, 78, 123], textColor: 255, fontStyle: 'bold' },
      margin: { top: 30, left: 20, right: 20 },
      didDrawPage: (d) => { doc.setFontSize(10); doc.text(`Page ${d.pageNumber}`, doc.internal.pageSize.width - 28, doc.internal.pageSize.height - 8); }
    });
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

/* ----------------------- Gauge Canvas (dashboard) ----------------------- */
function GaugeChart({ value, max = 100, width = 240, height = 130, color = "#2563eb" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const w = width, h = height, cx = w / 2, cy = h - 10, r = Math.min(w, h * 2) / 2 - 14;

    ctx.clearRect(0, 0, w, h);

    // background
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.stroke();

    // value
    const end = Math.PI + (Math.max(0, Math.min(value, max)) / max) * Math.PI;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, end);
    ctx.stroke();

    // needle
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r - 6) * Math.cos(end), cy + (r - 6) * Math.sin(end));
    ctx.stroke();

    // center dot
    ctx.fillStyle = "#e11d48";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // labels
    ctx.fillStyle = color;
    ctx.font = "bold 16px system-ui, Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${(value ?? 0).toFixed(1)}%`, cx, cy - 8);
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px system-ui, Arial";
    ctx.fillText("Overall Match Rate", cx, cy + 18);
  }, [value, max, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, display: "block", margin: "0 auto" }}
      aria-label="Gauge Chart"
    />
  );
}

/* ======================= Component ======================= */
export default function AdminAnalytics() {
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [logsCount, setLogsCount] = useState(0);
  const [analyticsCount, setAnalyticsCount] = useState(0);
  const [feedbackToday, setFeedbackToday] = useState([]);
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDailyModal, setShowDailyModal] = useState(false);

  // Demographics
  const [sexData, setSexData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [loadingDemographics, setLoadingDemographics] = useState(true);

  // Content Rate
  const [contentRate, setContentRate] = useState({ overall: 0, monthly: [] });
  const [loadingContentRate, setLoadingContentRate] = useState(true);

  // Content Match
  const [showContentMatchModal, setShowContentMatchModal] = useState(false);
  const [contentMatchData, setContentMatchData] = useState([]);
  const [loadingContentMatch, setLoadingContentMatch] = useState(false);

  // Main Concerns
  const [mainConcerns, setMainConcerns] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Time
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(getTodayISO());
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [refreshError, setRefreshError] = useState(null);

  /* ---------- Fetchers ---------- */
  const fetchGrowthData = async () => {
    setLoading(true);
    try {
      const [dailyRes, monthlyRes] = await Promise.all([fetch(API_DAILY), fetch(API_MONTHLY)]);
      const dailyJson = await dailyRes.json();
      const monthlyJson = await monthlyRes.json();

      let dailyData = formatCountData(dailyJson.data || [], "registration_date", "new_users_count");
      if (dailyData.length > 0) {
        const today = getTodayISO();
        const allDates = getDateRange(dailyData[0].label, today);
        dailyData = fillMissing(dailyData, allDates);
      }

      let monthlyData = formatCountData(monthlyJson.data || [], "registration_month", "new_users_count");
      if (monthlyData.length > 0) {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const allMonths = getMonthRange(monthlyData[0].label, currentMonth);
        monthlyData = fillMissing(monthlyData, allMonths);
      }

      setDaily(dailyData);
      setMonthly(monthlyData);
      setLastFetchTime(new Date());
    } catch (e) {
      setDaily([]); setMonthly([]);
    }
    setLoading(false);
  };

  const fetchDemographicsData = async () => {
    setLoadingDemographics(true);
    try {
      const [sexRes, ageRes] = await Promise.all([fetch(API_DEMOGRAPHICS_SEX), fetch(API_DEMOGRAPHICS_AGE)]);
      const sexJson = await sexRes.json();
      const ageJson = await ageRes.json();
      setSexData(sexJson.data || []);
      setAgeData(ageJson.data || []);
    } catch {
      setSexData([]); setAgeData([]);
    }
    setLoadingDemographics(false);
  };

  const fetchContentRateData = async () => {
    setLoadingContentRate(true);
    try {
      const res = await fetch(API_CONTENT_RATE);
      const json = await res.json();
      const processed = {
        overall: parseFloat(json.overall_match_rate) || 0,
        monthly: Array.isArray(json.monthly_trend) ? json.monthly_trend : [],
      };
      setContentRate(processed);
    } catch {
      setContentRate({ overall: 0, monthly: [] });
    }
    setLoadingContentRate(false);
  };

  const fetchMainConcernsData = async () => {
    setLoadingMain(true);
    try {
      const res = await fetch(API_MAIN_CONCERN);
      const json = await res.json();
      setMainConcerns(json.data || []);
      await fetchTodaySummaryCounts();
    } catch {
      setMainConcerns([]);
    }
    setLoadingMain(false);
  };

  const fetchTodaySummaryCounts = async () => {
    try {
      const today = getTodayISO();
      const feedbackRes = await fetch(API_FEEDBACK);
      const feedbackJson = await feedbackRes.json();
      const todayFeedback = (feedbackJson.data || []).filter(f => (f.created_at || '').slice(0, 10) === today);
      setFeedbackCount(todayFeedback.length);
      setFeedbackToday(todayFeedback);

      const logsRes = await fetch(import.meta.env.VITE_LOGS_GET);
      const logsJson = await logsRes.json();
      setLogsCount((logsJson.data || []).filter(l => (l.created_at || '').slice(0, 10) === today).length);

      const analyticsRes = await fetch(API_MAIN_CONCERN);
      const analyticsJson = await analyticsRes.json();
      setAnalyticsCount((analyticsJson.data || []).filter(a => (a.created_at || '').slice(0, 10) === today).length);
    } catch {
      setFeedbackCount(0); setFeedbackToday([]); setLogsCount(0); setAnalyticsCount(0);
    }
  };

  const refreshAllData = async () => {
    setRefreshError(null);
    try {
      await Promise.all([
        fetchGrowthData(),
        fetchDemographicsData(),
        fetchContentRateData(),
        fetchMainConcernsData()
      ]);
    } catch {
      setRefreshError('Failed to refresh analytics data.');
    }
  };

  /* ---------- Modals ---------- */
  const handleOpenDailyModal = () => { setShowDailyModal(true); refreshAllData(); };
  const handleOpenContentMatchModal = () => { setShowContentMatchModal(true); refreshAllData(); };
  const handleOpenFeedbackModal = () => { setShowFeedbackModal(true); refreshAllData(); };

  /* ---------- Downloads ---------- */
  const handleDownloadUserGrowth = async (format) => {
    const title = "User Growth Over Time";
    const todayISO = getTodayISO();
    const usersToday = daily.find(d => d.label === todayISO)?.count || 0;
    const totalMonthly = monthly.reduce((s, m) => s + m.count, 0);
    const avgDaily = Math.round(daily.reduce((s, d) => s + d.count, 0) / (daily.length || 1));

    const summaryData = [
      { label: "Users Registered Today", value: usersToday },
      { label: "Total Monthly Users", value: totalMonthly },
      { label: "Average Daily Growth", value: avgDaily },
    ];

    const dailyTableData = daily.filter(d => d.count > 0).map(d => ({ Date: d.label, 'New Users': d.count }));
    const monthlyTableData = monthly.filter(m => m.count > 0).map(m => ({ Month: m.label, 'New Users': m.count }));
    const legends = [
      { label: "Daily", value: "Registrations per date" },
      { label: "Monthly", value: "Registrations per month" },
    ];

    await logDownloadAction(title, format);
    if (format === 'pdf') {
      generateUserGrowthPDFWithChart(title, summaryData, dailyTableData, monthlyTableData, legends);
    } else {
      generateUserGrowthExcel(title, summaryData, dailyTableData, monthlyTableData);
    }
    refreshAllData();
  };

  // === FIXED handlers: now await the async PDF generator ===
  async function handleDownloadDemographicsSex(format) {
    const title = "User Demographics - By Sex";
    if (!sexData || !sexData.length) { alert('No demographic data available for download'); return; }

    const totalUsers = sexData.reduce((sum, s) => sum + (parseInt(s.user_count) || 0), 0);
    const maleCount = sexData.find(s => (s.sex || '').toLowerCase() === 'male')?.user_count || 0;
    const femaleCount = sexData.find(s => (s.sex || '').toLowerCase() === 'female')?.user_count || 0;

    const summaryData = [
      { label: "Total Users", value: totalUsers },
      { label: "Male Users", value: `${maleCount} (${totalUsers > 0 ? ((maleCount/totalUsers)*100).toFixed(1) : 0}%)` },
      { label: "Female Users", value: `${femaleCount} (${totalUsers > 0 ? ((femaleCount/totalUsers)*100).toFixed(1) : 0}%)` },
      { label: "Gender Categories", value: sexData.length }
    ];

    const tableData = sexData.map(s => ({
      'Sex': s.sex || 'Unknown',
      'User Count': parseInt(s.user_count) || 0,
      'Percentage': totalUsers > 0 ? `${(((parseInt(s.user_count) || 0)/totalUsers)*100).toFixed(1)}%` : '0.0%'
    }));
    const tableHeaders = ['Sex', 'User Count', 'Percentage'];

    await logDownloadAction(title, format);
    if (format === 'pdf') {
      await generateChartFirstPDF(title, summaryData, tableData, tableHeaders, null, 'pie');
    } else {
      generateExcel(title, summaryData, tableData, tableHeaders);
    }
    refreshAllData();
  }

  async function handleDownloadDemographicsAge(format) {
    const title = "User Demographics - By Age Group";
    if (!ageData || !ageData.length) { alert('No age demographic data available for download'); return; }

    const validAgeData = ageData.map(a => ({ ...a, user_count: typeof a.user_count === 'string' ? (parseInt(a.user_count) || 0) : (a.user_count || 0) }))
                                .filter(a => a.age_group && a.user_count >= 0);

    const totalUsers = validAgeData.reduce((sum, a) => sum + (a.user_count || 0), 0);
    const topAgeGroup = validAgeData.length ? [...validAgeData].sort((a,b) => (b.user_count||0)-(a.user_count||0))[0] : null;

    const summaryData = [
      { label: "Total Users", value: totalUsers.toString() },
      { label: "Most Common Age Group", value: topAgeGroup ? `${topAgeGroup.age_group} (${topAgeGroup.user_count} users)` : "N/A" },
      { label: "Age Categories", value: validAgeData.length.toString() },
      { label: "Report Generation Date", value: new Date().toLocaleDateString() }
    ];

    const tableData = validAgeData.map(a => ({
      'Age Group': a.age_group.toString(),
      'User Count': a.user_count,
      'Percentage': totalUsers > 0 ? `${((a.user_count/totalUsers)*100).toFixed(1)}%` : '0.0%'
    }));
    const tableHeaders = ['Age Group', 'User Count', 'Percentage'];

    await logDownloadAction(title, format);
    if (format === 'pdf') {
      await generateChartFirstPDF(title, summaryData, tableData, tableHeaders, null, 'pie');
    } else {
      generateExcel(title, summaryData, tableData, tableHeaders);
    }
    refreshAllData();
  }
  // === END FIX ===

  const handleDownloadMainConcerns = async (format) => {
    const title = "Main Concerns (Feedback)";
    const totalConcerns = mainConcerns.length;
    const topConcern = mainConcerns.length > 0 ? [...mainConcerns].sort((a, b) => b.concern_count - a.concern_count)[0] : null;

    const summaryData = [
      { label: "Total Feedback Entries", value: totalConcerns },
      { label: "Number of Concern Types", value: mainConcerns.length },
      { label: "Most Common Concern", value: topConcern ? `${topConcern.main_concern} (${topConcern.concern_count})` : "N/A" },
      { label: "Report Generation Date", value: new Date().toLocaleDateString() }
    ];

    const aggTableData = mainConcerns.map(c => ({ 'Main Concern': c.main_concern, 'Concern Count': c.concern_count }));
    const aggHeaders = ['Main Concern', 'Concern Count'];

    await logDownloadAction(title, format);

    if (format === 'pdf') {
      await generateChartFirstPDF(
        title,
        summaryData,
        aggTableData,
        aggHeaders,
        [
          { label: "Main Concern", value: "Category/topic" },
          { label: "Concern Count", value: "How many entries fall under it" }
        ],
        'bar'
      );
    } else {
      // Excel: detailed feedback rows
      let fullFeedback = feedback;
      if (!fullFeedback || !fullFeedback.length) {
        try {
          const res = await fetch(API_FEEDBACK);
          const json = await res.json();
          fullFeedback = json.data || [];
        } catch { fullFeedback = []; }
      }
      const detailHeaders = ['Main Concern', 'Details', 'Email', 'Created At'];
      const detailRows = fullFeedback.map(r => ({
        'Main Concern': r.main_concern || '',
        'Details': r.details || '',
        'Email': r.email || '',
        'Created At': r.created_at || ''
      }));
      generateExcel(`${title} - Detailed`, summaryData, detailRows, detailHeaders);
    }
    refreshAllData();
  };

  const handleDownloadContentMatch = async (format) => {
    const title = "Content Match Rate Analysis";
    try {
      let dataToUse = contentMatchData;
      if (!dataToUse || !dataToUse.length) {
        setLoadingContentMatch(true);
        try {
          const res = await fetch(API_CONTENT_MATCH);
          const json = await res.json();
          dataToUse = Array.isArray(json.data)
            ? json.data.map(row => ({
                label: row.words || 'Unknown',
                is_matched: !!row.is_matched,
                status: row.is_matched ? "Matched" : "Not Matched",
                frequency: row.frequency || row.total || row.occurrences || 1
              }))
            : [];
          setContentMatchData(dataToUse);
        } finally { setLoadingContentMatch(false); }
      }

      const total = dataToUse.length;
      const matched = dataToUse.filter(i => i.is_matched === true || String(i.status).toLowerCase().includes('match')).length;
      const pct = total > 0 ? ((matched / total) * 100).toFixed(1) : '0.0';
      const overallPct = typeof contentRate.overall === 'number' ? contentRate.overall.toFixed(1) : pct;

      const summaryData = [
        { label: "Overall Match Rate", value: `${overallPct}%` },
        { label: "Total Words Analyzed", value: String(total) },
        { label: "Matched Words", value: `${matched} (${pct}%)` },
        { label: "Unmatched Words", value: `${total - matched} (${(100 - parseFloat(pct)).toFixed(1)}%)` },
        { label: "Report Generation Date", value: new Date().toLocaleDateString() }
      ];

      const tableRows = dataToUse.map((it, idx) => ({
        'Word/Phrase': it.label || `Item ${idx + 1}`,
        'Match Status': it.is_matched ? 'Matched' : 'Not Matched',
        'Frequency': it.frequency ?? '',
        'Analysis Date': new Date().toLocaleDateString()
      }));

      await logDownloadAction(title, format);
      if (format === 'pdf') {
        await generateChartFirstPDF(
          title,
          summaryData,
          tableRows,
          ['Word/Phrase', 'Match Status', 'Frequency', 'Analysis Date'],
          [
            { label: "Matched", value: "Found in database" },
            { label: "Not Matched", value: "Not found in database" }
          ],
          'gauge'
        );
      } else {
        // Excel: remove Frequency
        const excelHeaders = ['Word/Phrase', 'Match Status', 'Analysis Date'];
        const excelRows = tableRows.map(({ ['Frequency']: _drop, ...rest }) => ({
          'Word/Phrase': rest['Word/Phrase'],
          'Match Status': rest['Match Status'],
          'Analysis Date': rest['Analysis Date']
        }));
        generateExcel(title, summaryData, excelRows, excelHeaders);
      }
      refreshAllData();
    } catch (error) {
      const summary = [
        { label: "Error", value: "Unable to process content match data" },
        { label: "Error Details", value: error?.message || 'Unknown error' },
        { label: "Report Generation Date", value: new Date().toLocaleDateString() }
      ];
      const errHeaders = ['Error Type', 'Description', 'Date'];
      const errRows = [{ 'Error Type': 'Data Processing Error', 'Description': error?.message || 'Unknown error', 'Date': new Date().toLocaleDateString() }];
      await logDownloadAction(`${title} - Error`, 'pdf');
      await generateChartFirstPDF(`${title} - Error Report`, summary, errRows, errHeaders, [], 'gauge');
    }
  };

  /* ---------- Timers & Init ---------- */
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      const today = getTodayISO();
      setCurrentTime(now);
      if (today !== currentDate) { setCurrentDate(today); refreshAllData().catch(() => setRefreshError('Midnight auto-refresh failed.')); }
      if (!refreshError && lastFetchTime && (now - lastFetchTime) > 5 * 60 * 1000) {
        refreshAllData().catch(() => {});
      }
    }, 1000);
    return () => clearInterval(t);
  }, [currentDate, lastFetchTime, refreshError]);

  useEffect(() => { refreshAllData(); }, []);

  useEffect(() => {
    if (!showContentMatchModal) return;
    setLoadingContentMatch(true);
    fetch(API_CONTENT_MATCH)
      .then(res => res.json())
      .then(json => {
        const rows = Array.isArray(json.data)
          ? json.data.map(row => ({
              label: row.words || 'Unknown',
              count: row.is_matched ? "Matched" : "Not Matched",
              is_matched: !!row.is_matched
            }))
          : [];
        setContentMatchData(rows);
      })
      .catch(() => setContentMatchData([]))
      .finally(() => setLoadingContentMatch(false));
  }, [showContentMatchModal]);

  useEffect(() => {
    if (!showFeedbackModal) return;
    setLoadingFeedback(true);
    fetch(API_FEEDBACK)
      .then(res => res.json())
      .then(json => setFeedback(json.data || []))
      .catch(() => setFeedback([]))
      .finally(() => setLoadingFeedback(false));
  }, [showFeedbackModal]);

  /* ---------- Charts ---------- */
  const todayISO = getTodayISO();
  const usersRegisteredToday = daily.find(d => d.label === todayISO)?.count || 0;

  const monthlyChartData = {
    labels: monthly.map(d => d.label),
    datasets: [{
      label: "Monthly New Users",
      data: monthly.map(d => d.count),
      fill: true,
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.08)",
      pointBackgroundColor: "#2563eb",
      tension: 0.3,
    }],
  };

  // Pie chart for sex — always include Male & Female, coerce to numbers
  const sexPieData = (() => {
    const map = {};
    (sexData || []).forEach(d => {
      const key = (d?.sex || '').toLowerCase();
      map[key] = toNum(d?.user_count);
    });

    const labels = ['Male', 'Female'];
    const data = [map['male'] || 0, map['female'] || 0];

    // Include any additional categories present
    (sexData || []).forEach(d => {
      const raw = d?.sex || '';
      const key = raw.toLowerCase();
      if (raw && !['male', 'female'].includes(key)) {
        labels.push(raw);
        data.push(toNum(d?.user_count));
      }
    });

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#2563eb", "#f59e42", "#e5e7eb", "#a5b4fc"],
        borderColor: "#fff",
        borderWidth: 2,
      }],
      _hasData: data.some(v => v > 0),
    };
  })();

  // Pie chart for age group — coerce counts to numbers
  const agePieLabels = (ageData || []).map(d => d?.age_group || 'Unknown');
  const agePieValues = (ageData || []).map(d => toNum(d?.user_count));

  const agePieData = {
    labels: agePieLabels,
    datasets: [{
      data: agePieValues,
      backgroundColor: ["#2563eb", "#f59e42", "#a5b4fc", "#fbbf24", "#10b981", "#e11d48"],
      borderColor: "#fff",
      borderWidth: 2,
    }],
    _hasData: agePieValues.some(v => v > 0),
  };

  const contentRateLineData = {
    labels: contentRate.monthly.map(m => m.creation_month),
    datasets: [{
      label: "Monthly Match Rate (%)",
      data: contentRate.monthly.map(m => m.monthly_match_rate),
      fill: false,
      borderColor: "#10b981",
      backgroundColor: "#10b981",
      pointBackgroundColor: "#10b981",
      tension: 0.3
    }]
  };

  const barData = {
    labels: mainConcerns.map(c => c.main_concern),
    datasets: [{ label: "Count", data: mainConcerns.map(c => c.concern_count), backgroundColor: "#2563eb" }]
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} feedbacks` } } },
    scales: {
      x: { ticks: { color: "#2563eb", font: { size: 14 } }, grid: { color: "rgba(37,99,235,0.08)" } },
      y: {
        beginAtZero: true,
        ticks: { color: "#2563eb", font: { size: 14 } },
        grid: { color: "rgba(37,99,235,0.08)" }
      }
    },
    onClick: () => setShowFeedbackModal(true),
  };

  const maxDaily = Math.max(1, ...daily.map(d => d.count));
  const maxMonthly = Math.max(1, ...monthly.map(d => d.count));
  const maxY = Math.max(maxDaily, maxMonthly);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${Math.round(ctx.parsed.y)} users` } } },
    scales: {
      x: { ticks: { color: "#2563eb", font: { size: 14 } }, grid: { color: "rgba(37,99,235,0.08)" } },
      y: {
        beginAtZero: true,
        stepSize: 1,
        suggestedMax: maxY < 10 ? 10 : undefined,
        ticks: { stepSize: 1, callback: v => Number.isInteger(v) ? v : "", color: "#2563eb", font: { size: 14 } },
        grid: { color: "rgba(37,99,235,0.08)" },
      },
    },
  };

  const contentRateLineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y?.toFixed(1) ?? 0}%` } } },
    scales: {
      x: { ticks: { color: "#10b981", font: { size: 14 } }, grid: { color: "rgba(16,185,129,0.08)" } },
      y: {
        beginAtZero: true, max: 100,
        ticks: { stepSize: 10, callback: value => `${value}%`, color: "#10b981", font: { size: 14 } },
        grid: { color: "rgba(16,185,129,0.08)" },
      },
    },
  };

  /* ---------- UI ---------- */
  const formattedDate = currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <AdminNavBar>
      <div className="admin-analytics-container content-area-scroll" style={{ maxWidth: 1200, margin: '24px auto', padding: '8px' }}>
        {/* Greeting */}
        <div className="analytics-greeting-row">
          <div className="analytics-greeting-text">
            <h2>Welcome back, Admin!</h2>
            <div className="analytics-greeting-date">{formattedDate}</div>
            <div className="analytics-greeting-time">{formattedTime}</div>
          </div>
        </div>

        {/* Summary */}
        <div className="analytics-summary-outer mobile-scroll">
          <div className="analytics-summary-row scroll-horizontal">
            <div className="analytics-summary-box feedback">
              <h3>Feedback Today</h3>
              <div className="analytics-summary-count">{feedbackCount}</div>
              <span className="analytics-summary-label">Total feedbacks submitted today</span>
            </div>
            <div className="analytics-summary-box logs">
              <h3>Logs Today</h3>
              <div className="analytics-summary-count">{logsCount}</div>
              <span className="analytics-summary-label">System actions recorded today</span>
            </div>
            <div className="analytics-summary-box analytics">
              <h3>User Registered Today</h3>
              <div className="analytics-summary-count">{usersRegisteredToday}</div>
              <span className="analytics-summary-label">New users registered today</span>
            </div>
          </div>
        </div>

        {/* --- User Growth Section --- */}
        <div className="analytics-section content-area-scroll">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <h2 className="section-title" style={{ textAlign: 'left' }}>User Growth Over Time</h2>
            <div className="download-buttons">
              <button className="download-btn pdf" onClick={() => handleDownloadUserGrowth('pdf')}>Download PDF</button>
              <button className="download-btn excel" onClick={() => handleDownloadUserGrowth('excel')}>Download Excel</button>
            </div>
          </div>
          <div className="growth-chart-container mobile-scroll">
            <div className="growth-chart-label">Monthly User Growth</div>
            <div
              className="growth-chart-box"
              onClick={() => setShowDailyModal(true)}
              title="Click to show daily user growth"
            >
              {loading ? (
                <div className="admin-analytics-loading">Loading monthly growth...</div>
              ) : (
                <Line data={monthlyChartData} options={{ ...chartOptions, onClick: undefined }} />
              )}
            </div>
            <Modal open={showDailyModal} onClose={() => setShowDailyModal(false)}>
              <AdminTable
                title="Created Accounts - Per Day"
                data={daily.filter(row => row.count > 0)}
                labelName="Date"
                countName="Account Created"
                percentName={null}
              />
            </Modal>
          </div>
        </div>

        {/* --- Content Rate Section --- */}
        <div className="content-rate-section content-area-scroll">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <h2 className="content-rate-title" style={{ textAlign: 'left' }}>Content Match Rate</h2>
            <div className="download-buttons">
              <button className="download-btn pdf" onClick={() => handleDownloadContentMatch('pdf')}>Download PDF</button>
              <button className="download-btn excel" onClick={() => handleDownloadContentMatch('excel')}>Download Excel</button>
            </div>
          </div>
          <div
            className="content-rate-gauge-container"
            onClick={() => setShowContentMatchModal(true)}
            title="Click to view content match table"
          >
            {loadingContentRate ? (
              <div className="admin-analytics-loading-green">Loading overall match rate...</div>
            ) : (
              <GaugeChart value={contentRate.overall} />
            )}
            <div className="admin-analytics-gauge-label">
              Click to view content match table
            </div>
          </div>
          <div className="content-rate-line-container mobile-scroll">
            <div className="growth-chart-label admin-analytics-green">Monthly Match Rate Trend</div>
            <div className="content-rate-line-box">
              {loadingContentRate ? (
                <div className="admin-analytics-loading-green">Loading trend...</div>
              ) : (
                <Line data={contentRateLineData} options={contentRateLineOptions} />
              )}
            </div>
          </div>
          <Modal open={showContentMatchModal} onClose={() => setShowContentMatchModal(false)}>
            <AdminTable
              title="Content Match Table"
              data={contentMatchData}
              labelName="Word/Phrase"
              countName="Match Status"
              percentName={null}
            />
            {loadingContentMatch && <div className="admin-analytics-loading-green">Loading...</div>}
          </Modal>
        </div>

        {/* --- User Analytics Section --- */}
        <div className="analytics-section content-area-scroll">
          <h2 className="section-title" style={{ textAlign: 'left' }}>User Analytics</h2>

          {/* Demographics by Age Group Container */}
          <div className="demographics-container" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div className="demographics-horizontal-scroll mobile-scroll"
                 style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', flex: 1 }}>
              <div className="demographics-card">
                <div className="demographics-header">
                  <div className="demographics-title">By Age Group</div>
                </div>
                <div className="chart-container" style={{ width: '100%', maxWidth: '280px', height: '280px', position: 'relative' }}>
                  {loadingDemographics ? (
                    <div className="admin-analytics-loading" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: '#6b7280',
                      fontSize: '1.1em'
                    }}>
                      <div className="loading-spinner" style={{ 
                        width: '24px', 
                        height: '24px', 
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #2563eb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '10px'
                      }}></div>
                      Loading...
                    </div>
                  ) : (
                    <Pie
                      data={agePieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: { 
                            display: true, 
                            position: "bottom",
                            labels: {
                              padding: 15,
                              usePointStyle: true,
                              font: {
                                size: 12,
                                weight: '500'
                              }
                            }
                          },
                          tooltip: { 
                            callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} users` },
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#2563eb',
                            borderWidth: 1
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="demographics-downloads" style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', alignSelf: 'center' }}>
              <button
                className="download-icon-btn pdf"
                onClick={() => handleDownloadDemographicsAge('pdf')}
                title="Download Age Demographics PDF"
              >
                Download PDF
              </button>
              <button
                className="download-icon-btn excel"
                onClick={() => handleDownloadDemographicsAge('excel')}
                title="Download Age Demographics Excel"
              >
                Download Excel
              </button>
            </div>
          </div>

          {/* Demographics by Sex Container */}
          <div className="demographics-container" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div className="demographics-horizontal-scroll mobile-scroll"
                 style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', flex: 1 }}>
              <div className="demographics-card">
                <div className="demographics-header">
                  <div className="demographics-title">By Sex</div>
                </div>
                <div className="chart-container" style={{ width: '100%', maxWidth: '280px', height: '280px', position: 'relative' }}>
                  {loadingDemographics ? (
                    <div className="admin-analytics-loading" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: '#6b7280',
                      fontSize: '1.1em'
                    }}>
                      <div className="loading-spinner" style={{ 
                        width: '24px', 
                        height: '24px', 
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #2563eb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '10px'
                      }}></div>
                      Loading...
                    </div>
                  ) : (
                    <Pie
                      data={sexPieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: { 
                            display: true, 
                            position: "bottom",
                            labels: {
                              padding: 15,
                              usePointStyle: true,
                              font: {
                                size: 12,
                                weight: '500'
                              }
                            }
                          },
                          tooltip: { 
                            callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}` },
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#2563eb',
                            borderWidth: 1
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="demographics-downloads" style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', alignSelf: 'center' }}>
              <button
                className="download-icon-btn pdf"
                onClick={() => handleDownloadDemographicsSex('pdf')}
                title="Download Sex Demographics PDF"
              >
                Download PDF
              </button>
              <button
                className="download-icon-btn excel"
                onClick={() => handleDownloadDemographicsSex('excel')}
                title="Download Sex Demographics Excel"
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>

        {/* --- Main Concerns Section --- */}
        <div className="analytics-section">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Main Concerns (Feedback)</h2>
            <div className="download-buttons">
              <button className="download-btn pdf" onClick={() => handleDownloadMainConcerns('pdf')}>Download PDF</button>
              <button className="download-btn excel" onClick={() => handleDownloadMainConcerns('excel')}>Download Excel</button>
            </div>
          </div>
          <div
            className="bar-chart-box"
            title="Click to view all feedback"
            onClick={() => setShowFeedbackModal(true)}
          >
            {loadingMain ? (
              <div className="admin-analytics-loading">Loading...</div>
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
            {loadingFeedback && <div className="admin-analytics-loading">Loading...</div>}
          </Modal>
        </div>
      </div>
    </AdminNavBar>
  );
}
