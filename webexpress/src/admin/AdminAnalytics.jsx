import React, { useEffect, useState } from "react";
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

// --- Add Gauge Chart plugin ---
import { Chart } from "chart.js";
import { useRef } from "react";

// Simple Gauge Chart plugin for Chart.js
function GaugeChart({ value, max = 100, width = 220, height = 120, color = "#2563eb" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    // Draw background arc
    ctx.beginPath();
    ctx.lineWidth = 18;
    ctx.strokeStyle = "#e5e7eb";
    ctx.arc(width / 2, height, width / 2 - 18, Math.PI, 2 * Math.PI, false);
    ctx.stroke();

    // Draw value arc
    ctx.beginPath();
    ctx.lineWidth = 18;
    ctx.strokeStyle = color;
    const endAngle = Math.PI + (value / max) * Math.PI;
    ctx.arc(width / 2, height, width / 2 - 18, Math.PI, endAngle, false);
    ctx.stroke();

    // Draw text
    ctx.font = "bold 1.5em Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(`${value.toFixed(1)}%`, width / 2, height - 18);
    ctx.font = "1em Arial";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Overall Match Rate", width / 2, height + 18);
  }, [value, max, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height + 30}
      style={{ width, height: height + 30, display: "block", margin: "0 auto" }}
      aria-label="Gauge Chart"
    />
  );
}

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


// ...existing helpers...

// Helper to get all dates between two dates (inclusive)
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

// Helper to get all months between two months (inclusive)
function getMonthRange(start, end) {
  const arr = [];
  let [sy, sm] = start.split("-").map(Number);
  let [ey, em] = end.split("-").map(Number);
  while (sy < ey || (sy === ey && sm <= em)) {
    arr.push(`${sy.toString().padStart(4, "0")}-${sm.toString().padStart(2, "0")}`);
    sm++;
    if (sm > 12) {
      sm = 1;
      sy++;
    }
  }
  return arr;
}

// Fill missing dates/months with 0 count
function fillMissing(data, allLabels) {
  const map = {};
  data.forEach(d => { map[d.label] = d.count; });
  return allLabels.map(label => ({
    label,
    count: map[label] !== undefined ? map[label] : 0,
  }));
}

// Format API data to use counts only
function formatCountData(data, labelKey, countKey) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map(d => {
    // Ensure we have valid data
    const label = d[labelKey] || 'Unknown';
    let count = d[countKey];
    
    // Convert count to number, handling different data types
    if (typeof count === 'string') {
      count = parseFloat(count) || 0;
    } else if (typeof count !== 'number') {
      count = 0;
    }
    
    return {
      label: label.toString(),
      count: Math.round(count),
    };
  }).filter(item => item.label !== 'Unknown' || item.count > 0); // Filter out invalid entries unless they have data
}

function getTodayISO() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

// Modal component
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

// Function to log download actions
async function logDownloadAction(tableName, format) {
  try {
    console.log('=== LOG DOWNLOAD ACTION ===');
    console.log('Table Name:', tableName);
    console.log('Format:', format);
    
    const userData = getUserData();
    console.log('User Data from localStorage:', userData);
    
    if (!userData) {
      console.warn('No user data found, skipping log');
      return;
    }

    const logData = {
      user_id: userData.user_id,
      email: userData.email,
      user_role: userData.role || userData.user_role || 'admin',
      action_type: `Download Table - ${tableName} (${format.toUpperCase()})`,
      object_type: 'analytics_download',
      object_id: null,
      old_data: null,
      new_data: { table_name: tableName, format: format, timestamp: new Date().toISOString() }
    };

    console.log('Prepared log data:', logData);
    console.log('API URL:', API_LOGS_INSERT);

    const response = await fetch(API_LOGS_INSERT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(logData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Log saved successfully:', result);
    console.log('=== END LOG ACTION ===');
  } catch (error) {
    console.error('=== LOG ERROR ===');
    console.error('Failed to log download action:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('=== END LOG ERROR ===');
    // Don't throw error to prevent download interruption
  }
}

// Function to generate Excel - Only detailed data
function generateExcel(title, summaryData, tableData, tableHeaders, legends = null) {
  const wb = XLSX.utils.book_new();
  
  // Only create detailed data worksheet
  if (tableData && tableData.length > 0) {
    // Prepare data for the detailed sheet - headers first, then data
    const detailSheetData = [
      tableHeaders,
      ...tableData.map(row => 
        tableHeaders.map(header => {
          // Try multiple key formats to find the data
          const possibleKeys = [
            header, // exact header match
            header.toLowerCase(), // lowercase
            header.toLowerCase().replace(/ /g, '_'), // snake_case
            header.toLowerCase().replace(/\s+/g, ''), // no spaces
            header.replace(/ /g, '_') // original case snake_case
          ];
          
          for (const key of possibleKeys) {
            if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
              return row[key];
            }
          }
          
          // If no match found, return empty string
          console.warn(`No data found for header "${header}" in row:`, row);
          return '';
        })
      )
    ];
    
    const detailWS = XLSX.utils.aoa_to_sheet(detailSheetData);
    
    // Style the header row
    const headerRange = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: tableHeaders.length - 1, r: 0 } });
    for (let C = 0; C < tableHeaders.length; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
      if (!detailWS[cellAddress]) continue;
      detailWS[cellAddress].s = { 
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "EEEEEE" } }
      };
    }
    
    XLSX.utils.book_append_sheet(wb, detailWS, 'Data');
  } else {
    // If no detailed data, create a simple sheet with message
    const emptySheet = XLSX.utils.aoa_to_sheet([
      ['No data available for export'],
      [`Report: ${title}`],
      [`Generated on: ${new Date().toLocaleDateString()}`]
    ]);
    XLSX.utils.book_append_sheet(wb, emptySheet, 'Data');
  }
  
  // Save the Excel file
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Enhanced User Growth PDF generator with line chart visualization
function generateUserGrowthPDFWithChart(title, summaryData, dailyTableData, monthlyTableData, legends = null) {
  const doc = new jsPDF();
  
  // PAGE 1: LINE CHART VISUALIZATION FIRST
  // Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(title, 20, 25);
  
  // Date
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 35);
  
  // Chart Title
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('User Growth Trend Visualization', 20, 60);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('This line chart shows the user growth pattern over time:', 20, 80);
  
  // Draw line chart for user growth
  if (dailyTableData && dailyTableData.length > 0) {
    const chartX = 30;
    const chartY = 100;
    const chartWidth = 150;
    const chartHeight = 80;
    
    // Draw axes
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight); // X-axis
    doc.line(chartX, chartY, chartX, chartY + chartHeight); // Y-axis
    
    // Axis labels
    doc.setFontSize(10);
    doc.text('Time Period', chartX + chartWidth/2, chartY + chartHeight + 15, { align: 'center' });
    doc.text('New Users', chartX - 25, chartY + chartHeight/2, { align: 'center', angle: 90 });
    
    const maxValue = Math.max(...dailyTableData.map(item => parseInt(item['New Users']) || 0));
    const stepX = chartWidth / Math.max(dailyTableData.length - 1, 1);
    
    if (maxValue > 0) {
      // Draw line
      doc.setDrawColor(37, 99, 235); // Blue
      doc.setLineWidth(2);
      
      for (let i = 0; i < dailyTableData.length - 1; i++) {
        const value1 = parseInt(dailyTableData[i]['New Users']) || 0;
        const value2 = parseInt(dailyTableData[i + 1]['New Users']) || 0;
        
        const x1 = chartX + (i * stepX);
        const y1 = chartY + chartHeight - (value1 / maxValue) * chartHeight * 0.8;
        const x2 = chartX + ((i + 1) * stepX);
        const y2 = chartY + chartHeight - (value2 / maxValue) * chartHeight * 0.8;
        
        doc.line(x1, y1, x2, y2);
        
        // Draw data points
        doc.setFillColor(37, 99, 235);
        doc.circle(x1, y1, 2, 'F');
      }
      
      // Draw last point
      if (dailyTableData.length > 0) {
        const lastValue = parseInt(dailyTableData[dailyTableData.length - 1]['New Users']) || 0;
        const lastX = chartX + ((dailyTableData.length - 1) * stepX);
        const lastY = chartY + chartHeight - (lastValue / maxValue) * chartHeight * 0.8;
        doc.circle(lastX, lastY, 2, 'F');
      }
      
      // Add some data labels for key points
      const midIndex = Math.floor(dailyTableData.length / 2);
      if (midIndex < dailyTableData.length) {
        const midValue = parseInt(dailyTableData[midIndex]['New Users']) || 0;
        const midX = chartX + (midIndex * stepX);
        const midY = chartY + chartHeight - (midValue / maxValue) * chartHeight * 0.8;
        doc.setFontSize(8);
        doc.text(midValue.toString(), midX, midY - 8, { align: 'center' });
      }
    }
    
    // Chart legend
    doc.setFontSize(10);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(2);
    doc.line(30, chartY + chartHeight + 35, 45, chartY + chartHeight + 35);
    doc.setFillColor(37, 99, 235);
    doc.circle(37.5, chartY + chartHeight + 35, 2, 'F');
    doc.setFont(undefined, 'normal');
    doc.text('Daily User Growth', 50, chartY + chartHeight + 38);
  }
  
  // Add footer to first page
  doc.setFontSize(10);
  doc.text('Summary and detailed data tables are available on the following pages.', 20, 280);
  
  // PAGE 2: SUMMARY
  doc.addPage();
  
  // Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(title, 20, 30);
  
  // Date
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 45);
  
  // Summary section
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Summary', 20, 70);
  
  let yPos = 85;
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  summaryData.forEach((item) => {
    doc.text(`• ${item.label}: ${item.value}`, 25, yPos);
    yPos += 15;
  });
  
  // Legends section if provided
  if (legends && legends.length > 0) {
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Legend', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    legends.forEach((legend) => {
      doc.text(`• ${legend.label}: ${legend.value}`, 25, yPos);
      yPos += 12;
    });
  }
  
  // PAGE 3: DAILY DATA TABLE
  if (dailyTableData && dailyTableData.length > 0) {
    doc.addPage();
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Daily User Growth Data', 20, 25);
    
    const dailyHeaders = Object.keys(dailyTableData[0]);
    const dailyBody = dailyTableData.map(row => dailyHeaders.map(header => row[header] || ''));
    
    autoTable(doc, {
      head: [dailyHeaders],
      body: dailyBody,
      startY: 35,
      theme: 'striped',
      styles: { 
        fontSize: 9,
        cellPadding: 4
      },
      headStyles: { 
        fillColor: [51, 78, 123],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35, left: 20, right: 20 }
    });
  }
  
  // PAGE 4: MONTHLY DATA TABLE
  if (monthlyTableData && monthlyTableData.length > 0) {
    doc.addPage();
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Monthly User Growth Data', 20, 25);
    
    const monthlyHeaders = Object.keys(monthlyTableData[0]);
    const monthlyBody = monthlyTableData.map(row => monthlyHeaders.map(header => row[header] || ''));
    
    autoTable(doc, {
      head: [monthlyHeaders],
      body: monthlyBody,
      startY: 35,
      theme: 'striped',
      styles: { 
        fontSize: 9,
        cellPadding: 4
      },
      headStyles: { 
        fillColor: [51, 78, 123],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35, left: 20, right: 20 },
      didDrawPage: function(data) {
        // Add page number
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    });
  }
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Specialized PDF generator for User Growth Over Time with separate tables
function generateUserGrowthPDF(title, summaryData, dailyTableData, monthlyTableData, legends = null) {
  const doc = new jsPDF();
  
  // PAGE 1: LINE CHART VISUALIZATION FIRST
  // Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(title, 20, 25);
  
  // Date
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 35);
  
  // Chart placeholder text (since we can't embed actual chart)
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Monthly User Growth Chart', 20, 60);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('This report corresponds to the monthly user growth line chart displayed in the dashboard.', 20, 80);
  doc.text('The chart shows the trend of new user registrations over time.', 20, 95);
  
  // Add chart representation area
  doc.rect(20, 110, 170, 100);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('[Monthly User Growth Line Chart]', 105, 165, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Refer to dashboard for interactive chart visualization', 105, 180, { align: 'center' });
  
  // Add footer to first page
  doc.setFontSize(10);
  doc.text('Summary and detailed data tables are available on the following pages.', 20, 280);
  
  // PAGE 2: SUMMARY PAGE
  doc.addPage();
  
  // Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(title, 20, 30);
  
  // Date
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 45);
  
  // Summary section
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Summary', 20, 70);
  
  let yPos = 85;
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  summaryData.forEach((item) => {
    doc.text(`• ${item.label}: ${item.value}`, 25, yPos);
    yPos += 15;
  });
  
  // Legends section if provided
  if (legends && legends.length > 0) {
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Legend', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    legends.forEach((legend) => {
      doc.text(`• ${legend.label}: ${legend.value}`, 25, yPos);
      yPos += 12;
    });
  }
  
  // Add footer to summary page
  doc.setFontSize(10);
  doc.text('Daily and monthly detailed data tables are available on the following pages.', 20, 280);
  
  // PAGE 3: DAILY TABLE DATA
  if (dailyTableData && dailyTableData.length > 0) {
    doc.addPage();
    
    // Table title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Daily User Registration Data', 20, 25);
    
    // Generate daily table
    autoTable(doc, {
      head: [['Date', 'New Users']],
      body: dailyTableData.map(row => [row.Date, row['New Users']]),
      startY: 35,
      theme: 'striped',
      styles: { 
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: { 
        fillColor: [51, 78, 123],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35, left: 20, right: 20 },
      didDrawPage: function(data) {
        // Add page number
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    });
  }
  
  // PAGE 4+: MONTHLY TABLE DATA
  if (monthlyTableData && monthlyTableData.length > 0) {
    doc.addPage();
    
    // Table title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Monthly User Registration Data', 20, 25);
    
    // Generate monthly table
    autoTable(doc, {
      head: [['Month', 'New Users']],
      body: monthlyTableData.map(row => [row.Month, row['New Users']]),
      startY: 35,
      theme: 'striped',
      styles: { 
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: { 
        fillColor: [51, 78, 123],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35, left: 20, right: 20 },
      didDrawPage: function(data) {
        // Add page number
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    });
  }
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Enhanced PDF generator with actual chart visualizations
function generateChartFirstPDF(title, summaryData, tableData, tableHeaders, legends = null, chartType = 'table') {
  const doc = new jsPDF();
  
  // PAGE 1: CHART/VISUALIZATION FIRST
  // Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(title, 20, 25);
  
  // Date
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 35);
  
  // Chart generation based on type
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  let chartTitle = '';
  let yPos = 60;
  
  switch(chartType) {
    case 'pie':
      chartTitle = 'Pie Chart Visualization';
      doc.text(chartTitle, 20, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Distribution breakdown of the data categories:', 20, yPos + 20);
      
      // Draw a proper pie chart representation
      const pieCenterX = 105;
      const pieCenterY = yPos + 80;
      const pieRadius = 40;
      
      // Draw pie slices based on table data
      if (tableData && tableData.length > 0) {
        // Define colors in RGB values for better compatibility
        const colors = [
          [37, 99, 235],    // Blue
          [245, 158, 66],   // Orange  
          [16, 185, 129],   // Green
          [225, 29, 72],    // Red
          [139, 92, 246],   // Purple
          [75, 85, 99],     // Gray
          [236, 72, 153],   // Pink
          [14, 165, 233]    // Light Blue
        ];
        
        let currentAngle = 0;
        
        // Process valid data with better validation
        const validData = tableData.filter(item => {
          if (!item || typeof item !== 'object') return false;
          // Check for valid numeric value in any of the expected fields
          const value = parseInt(item['User Count'] || item['Concern Count'] || item['Count'] || '0') || 0;
          return value > 0;
        }).slice(0, 8);
        
        console.log('Valid pie chart data:', validData);
        
        if (validData.length > 0) {
          const total = validData.reduce((sum, item) => {
            return sum + (parseInt(item['User Count'] || item['Concern Count'] || item['Count'] || '0') || 0);
          }, 0);
          
          console.log('Total for pie chart:', total);
          
          if (total > 0) {
            validData.forEach((item, index) => {
              const value = parseInt(item['User Count'] || item['Concern Count'] || item['Count'] || '0') || 0;
              
              if (value > 0) {
                const sliceAngle = (value / total) * 2 * Math.PI;
                
                if (sliceAngle > 0.01) {
                  const color = colors[index % colors.length];
                  doc.setFillColor(color[0], color[1], color[2]);
                  
                  // Draw slice as triangles (simplified approach)
                  const steps = Math.max(5, Math.ceil(sliceAngle * 15));
                  for (let i = 0; i < steps; i++) {
                    const angle1 = currentAngle + (sliceAngle * i / steps);
                    const angle2 = currentAngle + (sliceAngle * (i + 1) / steps);
                    const x1 = pieCenterX + pieRadius * Math.cos(angle1);
                    const y1 = pieCenterY + pieRadius * Math.sin(angle1);
                    const x2 = pieCenterX + pieRadius * Math.cos(angle2);
                    const y2 = pieCenterY + pieRadius * Math.sin(angle2);
                    
                    // Only draw if triangle method exists, otherwise skip this slice visualization
                    try {
                      if (typeof doc.triangle === 'function') {
                        doc.triangle(pieCenterX, pieCenterY, x1, y1, x2, y2, 'F');
                      }
                    } catch (e) {
                      console.warn('Triangle drawing failed, skipping slice visualization:', e);
                      // Continue with next iteration instead of breaking the whole chart
                      break;
                    }
                  }
                  
                  // Add label
                  const labelAngle = currentAngle + sliceAngle / 2;
                  const labelX = pieCenterX + (pieRadius + 20) * Math.cos(labelAngle);
                  const labelY = pieCenterY + (pieRadius + 20) * Math.sin(labelAngle);
                  doc.setFontSize(8);
                  doc.setTextColor(0, 0, 0);
                  
                  // Find the first non-numeric key for the label
                  const labelKey = Object.keys(item).find(key => 
                    !['User Count', 'Concern Count', 'Count', 'Percentage'].includes(key)
                  );
                  const label = labelKey ? item[labelKey] : `Item ${index + 1}`;
                  const percentage = ((value / total) * 100).toFixed(1);
                  doc.text(`${label}: ${percentage}%`, labelX, labelY, { align: 'center' });
                  
                  currentAngle += sliceAngle;
                }
              }
            });
          }
          
          // Add circle outline
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(1);
          doc.setFillColor(255, 255, 255, 0);
          doc.circle(pieCenterX, pieCenterY, pieRadius, 'S');
          
          // Add legend
          let legendY = pieCenterY + pieRadius + 50;
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.text('Legend:', 20, legendY);
          legendY += 15;
          
          doc.setFont(undefined, 'normal');
          doc.setFontSize(9);
          validData.forEach((item, index) => {
            const color = colors[index % colors.length];
            const value = parseInt(item['User Count'] || item['Concern Count'] || item['Count'] || '0') || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            
            // Find the first non-numeric key for the label
            const labelKey = Object.keys(item).find(key => 
              !['User Count', 'Concern Count', 'Count', 'Percentage'].includes(key)
            );
            const label = labelKey ? item[labelKey] : `Item ${index + 1}`;
            
            doc.setFillColor(color[0], color[1], color[2]);
            doc.rect(20, legendY - 3, 8, 6, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(20, legendY - 3, 8, 6, 'S');
            doc.setTextColor(0, 0, 0);
            doc.text(`${label}: ${value} (${percentage}%)`, 32, legendY);
            legendY += 10;
          });
        } else {
          doc.setFontSize(12);
          doc.setTextColor(100, 100, 100);
          doc.text('No data available for chart visualization', pieCenterX, pieCenterY, { align: 'center' });
        }
      }
      break;
      chartTitle = 'Pie Chart Visualization';
      doc.text(chartTitle, 20, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Distribution breakdown of the data categories:', 20, yPos + 20);
      
      // Draw a proper pie chart representation
      const centerX = 105;
      const centerY = yPos + 80;
      const radius = 40;
      
      // Draw pie slices based on table data
      if (tableData && tableData.length > 0) {
        // Define colors in RGB values for better compatibility
        const colors = [
          [37, 99, 235],    // Blue
          [245, 158, 66],   // Orange
          [16, 185, 129],   // Green
          [225, 29, 72],    // Red
          [139, 92, 246],   // Purple
          [75, 85, 99],     // Gray
          [236, 72, 153],   // Pink
          [14, 165, 233]    // Light Blue
        ];
        
        let currentAngle = 0;
        const total = tableData.reduce((sum, d) => sum + (parseInt(d['User Count'] || d['Concern Count'] || '0') || 0), 0);
        
        // Only process valid data with positive values
        const validData = tableData.filter(item => {
          if (!item) return false;
          
          // Try to find a count value from different possible fields
          let value = 0;
          const possibleFields = ['User Count', 'Concern Count', 'user_count', 'concern_count', 'count', 'Count'];
          
          for (const field of possibleFields) {
            if (item[field] !== undefined && item[field] !== null) {
              const parsedValue = typeof item[field] === 'string' ? parseInt(item[field]) : item[field];
              if (!isNaN(parsedValue) && parsedValue >= 0) {
                value = parsedValue;
                break;
              }
            }
          }
          
          return value > 0; // Only include items with positive values for pie chart
        }).slice(0, 8); // Limit to 8 slices for readability
        
        if (validData.length > 0) {
          // Calculate total using the same field detection logic
          const total = validData.reduce((sum, item) => {
            let value = 0;
            const possibleFields = ['User Count', 'Concern Count', 'user_count', 'concern_count', 'count', 'Count'];
            
            for (const field of possibleFields) {
              if (item[field] !== undefined && item[field] !== null) {
                const parsedValue = typeof item[field] === 'string' ? parseInt(item[field]) : item[field];
                if (!isNaN(parsedValue) && parsedValue >= 0) {
                  value = parsedValue;
                  break;
                }
              }
            }
            return sum + value;
          }, 0);
          
          if (total > 0) {
            validData.forEach((item, index) => {
              // Get value using the same detection logic
              let value = 0;
              const possibleFields = ['User Count', 'Concern Count', 'user_count', 'concern_count', 'count', 'Count'];
              
              for (const field of possibleFields) {
                if (item[field] !== undefined && item[field] !== null) {
                  const parsedValue = typeof item[field] === 'string' ? parseInt(item[field]) : item[field];
                  if (!isNaN(parsedValue) && parsedValue >= 0) {
                    value = parsedValue;
                    break;
                  }
                }
              }
              
              if (value > 0) {
                const sliceAngle = (value / total) * 2 * Math.PI; // Convert to radians
                
                if (sliceAngle > 0.01) { // Only draw significant slices
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + sliceAngle;
                  
                  // Set fill color
                  const color = colors[index % colors.length];
                  doc.setFillColor(color[0], color[1], color[2]);
                  doc.setDrawColor(255, 255, 255); // White outline
                  doc.setLineWidth(2);
                  
                  // Draw pie slice using a simpler approach with lines and arcs
                  // This method is more compatible with jsPDF
                  
                  // Calculate key points
                  const startX = centerX + radius * Math.cos(startAngle);
                  const startY = centerY + radius * Math.sin(startAngle);
                  const endX = centerX + radius * Math.cos(endAngle);
                  const endY = centerY + radius * Math.sin(endAngle);
                  
                  // Draw the slice as a series of small triangles for better compatibility
                  const steps = Math.max(5, Math.ceil(sliceAngle * 15));
                  for (let i = 0; i < steps; i++) {
                    const angle1 = startAngle + (sliceAngle * i / steps);
                    const angle2 = startAngle + (sliceAngle * (i + 1) / steps);
                    
                    const x1 = centerX + radius * Math.cos(angle1);
                    const y1 = centerY + radius * Math.sin(angle1);
                    const x2 = centerX + radius * Math.cos(angle2);
                    const y2 = centerY + radius * Math.sin(angle2);
                    
                    // Create triangle path
                    doc.setFillColor(color[0], color[1], color[2]);
                    doc.triangle(centerX, centerY, x1, y1, x2, y2, 'F');
                  }
                  
                  // Add slice outline
                  doc.setDrawColor(255, 255, 255);
                  doc.setLineWidth(1);
                  doc.line(centerX, centerY, startX, startY);
                  doc.line(centerX, centerY, endX, endY);
                  
                  // Add label
                  const labelAngle = startAngle + sliceAngle / 2;
                  const labelDistance = radius + 20;
                  const labelX = centerX + labelDistance * Math.cos(labelAngle);
                  const labelY = centerY + labelDistance * Math.sin(labelAngle);
                  
                  doc.setFontSize(8);
                  doc.setTextColor(0, 0, 0);
                  const firstKey = Object.keys(item)[0];
                  const label = `${item[firstKey] || 'Unknown'}`;
                  const percentage = ((value / total) * 100).toFixed(1);
                  doc.text(`${label}: ${percentage}%`, labelX, labelY, { align: 'center' });
                  
                  currentAngle += sliceAngle;
                }
              }
            }); // End of validData.forEach
          } // End of if (total > 0)
          
          // Add a clean circle outline
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(1);
          doc.setFillColor(255, 255, 255, 0); // Transparent fill
          doc.circle(centerX, centerY, radius, 'S');
          
          // Add legend below the chart
          let legendY = centerY + radius + 50;
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.text('Legend:', 20, legendY);
          legendY += 15;
          
          doc.setFont(undefined, 'normal');
          doc.setFontSize(9);
          validData.forEach((item, index) => {
            const color = colors[index % colors.length];
            
            // Get value using the same detection logic
            let value = 0;
            const possibleFields = ['User Count', 'Concern Count', 'user_count', 'concern_count', 'count', 'Count'];
            
            for (const field of possibleFields) {
              if (item[field] !== undefined && item[field] !== null) {
                const parsedValue = typeof item[field] === 'string' ? parseInt(item[field]) : item[field];
                if (!isNaN(parsedValue) && parsedValue >= 0) {
                  value = parsedValue;
                  break;
                }
              }
            }
            
            const total = validData.reduce((sum, d) => {
              let dValue = 0;
              for (const field of possibleFields) {
                if (d[field] !== undefined && d[field] !== null) {
                  const parsedValue = typeof d[field] === 'string' ? parseInt(d[field]) : d[field];
                  if (!isNaN(parsedValue) && parsedValue >= 0) {
                    dValue = parsedValue;
                    break;
                  }
                }
              }
              return sum + dValue;
            }, 0);
            
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            const firstKey = Object.keys(item)[0];
            
            // Draw color box
            doc.setFillColor(color[0], color[1], color[2]);
            doc.rect(20, legendY - 3, 8, 6, 'F');
            
            // Add border to color box
            doc.setDrawColor(0, 0, 0);
            doc.rect(20, legendY - 3, 8, 6, 'S');
            
            // Add label
            doc.setTextColor(0, 0, 0);
            doc.text(`${item[firstKey] || 'Unknown'}: ${value} users (${percentage}%)`, 32, legendY);
            legendY += 10;
            
            // Add line break if too many items
            if (index > 0 && (index + 1) % 6 === 0 && index < validData.length - 1) {
              legendY += 5;
            }
          });
        } // End of if (validData.length > 0)
        
        // Show "No data" message only if there's no valid data at all
        if (validData.length === 0) {
          doc.setFontSize(12);
          doc.setTextColor(100, 100, 100);
          doc.text('No data available for chart visualization', centerX, centerY, { align: 'center' });
        }
      } // End of if (tableData && tableData.length > 0)
      break;
      
    case 'bar':
      chartTitle = 'Bar Chart Visualization';
      doc.text(chartTitle, 20, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Comparative analysis of different categories:', 20, yPos + 20);
      
      // Draw bar chart
      if (tableData && tableData.length > 0) {
        const chartX = 30;
        const chartY = yPos + 40;
        const chartWidth = 150;
        const chartHeight = 80;
        
        // Draw axes
        doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight); // X-axis
        doc.line(chartX, chartY, chartX, chartY + chartHeight); // Y-axis
        
        const maxValue = Math.max(...tableData.map(item => parseInt(item['Concern Count'] || item['User Count'] || '1') || 1));
        const barWidth = chartWidth / tableData.length * 0.8;
        const spacing = chartWidth / tableData.length * 0.2;
        
        tableData.slice(0, 8).forEach((item, index) => {
          const value = parseInt(item['Concern Count'] || item['User Count'] || '1') || 1;
          const barHeight = (value / maxValue) * chartHeight * 0.8;
          const barX = chartX + (index * (barWidth + spacing)) + spacing/2;
          const barY = chartY + chartHeight - barHeight;
          
          // Draw bar
          doc.setFillColor(37, 99, 235); // Blue color
          doc.rect(barX, barY, barWidth, barHeight, 'F');
          
          // Add value label
          doc.setFontSize(8);
          doc.text(value.toString(), barX + barWidth/2, barY - 5, { align: 'center' });
          
          // Add category label (rotated)
          const label = item[Object.keys(item)[0]].substring(0, 10);
          doc.text(label, barX + barWidth/2, chartY + chartHeight + 15, { align: 'center', angle: -45 });
        });
      }
      break;
      
    case 'gauge':
      chartTitle = 'Gauge Chart Visualization';
      doc.text(chartTitle, 20, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Overall performance indicator:', 20, yPos + 20);
      
      // Draw gauge chart using circles and rectangles (no arc method)
      const gaugeX = 105;
      const gaugeY = yPos + 80;
      const gaugeRadius = 35;
      
      // Get percentage value from summary data
      let percentage = 0;
      const matchRateItem = summaryData.find(item => item.label.includes('Match Rate') || item.label.includes('Rate'));
      if (matchRateItem) {
        const valueStr = matchRateItem.value.toString();
        percentage = parseFloat(valueStr.replace('%', '')) || 0;
      }
      
      // Draw gauge background (full circle outline)
      doc.setDrawColor(229, 231, 235); // Light gray
      doc.setLineWidth(6);
      doc.setFillColor(255, 255, 255, 0); // Transparent fill
      doc.circle(gaugeX, gaugeY, gaugeRadius, 'S');
      
      // Draw gauge segments to simulate a gauge
      const segments = 10;
      for (let i = 0; i < segments; i++) {
        const angle = Math.PI + (i / segments) * Math.PI; // Semi-circle from left to right
        const x1 = gaugeX + (gaugeRadius - 8) * Math.cos(angle);
        const y1 = gaugeY + (gaugeRadius - 8) * Math.sin(angle);
        const x2 = gaugeX + (gaugeRadius + 2) * Math.cos(angle);
        const y2 = gaugeY + (gaugeRadius + 2) * Math.sin(angle);
        
        // Color the segments based on the percentage
        const segmentPercentage = (i / segments) * 100;
        if (segmentPercentage <= percentage) {
          doc.setDrawColor(37, 99, 235); // Blue for filled segments
        } else {
          doc.setDrawColor(229, 231, 235); // Gray for empty segments
        }
        doc.setLineWidth(3);
        doc.line(x1, y1, x2, y2);
      }
      
      // Draw needle pointing to the percentage
      if (percentage > 0) {
        const needleAngle = Math.PI + (percentage / 100) * Math.PI;
        const needleLength = gaugeRadius - 5;
        const needleX = gaugeX + needleLength * Math.cos(needleAngle);
        const needleY = gaugeY + needleLength * Math.sin(needleAngle);
        
        doc.setDrawColor(225, 29, 72); // Red needle
        doc.setLineWidth(2);
        doc.line(gaugeX, gaugeY, needleX, needleY);
        
        // Needle center dot
        doc.setFillColor(225, 29, 72);
        doc.circle(gaugeX, gaugeY, 3, 'F');
      }
      
      // Add percentage text
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${percentage.toFixed(1)}%`, gaugeX, gaugeY + 25, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('Overall Rate', gaugeX, gaugeY + 40, { align: 'center' });
      
      // Add scale labels
      doc.setFontSize(8);
      doc.text('0%', gaugeX - gaugeRadius - 10, gaugeY + 5);
      doc.text('50%', gaugeX, gaugeY - gaugeRadius - 5, { align: 'center' });
      doc.text('100%', gaugeX + gaugeRadius + 5, gaugeY + 5);
      break;
      
    case 'line':
      chartTitle = 'Line Chart Visualization';
      doc.text(chartTitle, 20, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Trend analysis over time:', 20, yPos + 20);
      
      // Draw line chart
      if (tableData && tableData.length > 0) {
        const chartX = 30;
        const chartY = yPos + 40;
        const chartWidth = 150;
        const chartHeight = 80;
        
        // Draw axes with labels
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight); // X-axis
        doc.line(chartX, chartY, chartX, chartY + chartHeight); // Y-axis
        
        // Axis labels
        doc.setFontSize(10);
        doc.text('Time Period', chartX + chartWidth/2, chartY + chartHeight + 15, { align: 'center' });
        doc.text('New Users', chartX - 25, chartY + chartHeight/2, { align: 'center', angle: 90 });
        
        // Find the max value for scaling
        const maxValue = Math.max(...tableData.map(item => parseInt(item['New Users'] || item['Users'] || item['Count'] || '0') || 0), 1);
        const stepX = tableData.length > 1 ? chartWidth / (tableData.length - 1) : chartWidth / 2;
        
        // Draw grid lines
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        for (let i = 1; i < 5; i++) {
          const gridY = chartY + (chartHeight * i / 5);
          doc.line(chartX, gridY, chartX + chartWidth, gridY);
        }
        
        // Draw vertical grid lines
        for (let i = 1; i < tableData.length; i++) {
          const gridX = chartX + (i * stepX);
          doc.line(gridX, chartY, gridX, chartY + chartHeight);
        }
        
        // Draw line and points
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(2);
        
        const points = tableData.map((item, index) => {
          const value = parseInt(item['New Users'] || item['Users'] || item['Count'] || '0') || 0;
          const x = chartX + (index * stepX);
          const y = chartY + chartHeight - (value / maxValue) * chartHeight * 0.8;
          return { x, y, value, index };
        });
        
        // Draw connecting lines
        for (let i = 0; i < points.length - 1; i++) {
          doc.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }
        
        // Draw data points
        doc.setFillColor(37, 99, 235);
        points.forEach((point, index) => {
          doc.circle(point.x, point.y, 3, 'F');
          
          // Add value labels on some points
          if (index % Math.max(1, Math.floor(points.length / 5)) === 0 || index === points.length - 1) {
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.text(point.value.toString(), point.x, point.y - 8, { align: 'center' });
          }
        });
        
        // Add Y-axis scale labels
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        for (let i = 0; i <= 4; i++) {
          const scaleValue = Math.round((maxValue * i / 4));
          const scaleY = chartY + chartHeight - (i * chartHeight / 4);
          doc.text(scaleValue.toString(), chartX - 15, scaleY, { align: 'right' });
        }
        
        // Add trend line info
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        const firstValue = points[0].value;
        const lastValue = points[points.length - 1].value;
        const trend = lastValue > firstValue ? '↗ Increasing' : lastValue < firstValue ? '↘ Decreasing' : '→ Stable';
        doc.text(`Trend: ${trend}`, chartX, chartY + chartHeight + 35);
        
        // Add data range info
        doc.text(`Range: ${Math.min(...points.map(p => p.value))} - ${maxValue} users`, chartX + 80, chartY + chartHeight + 35);
        
      } else {
        // No data message
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('No data available for trend analysis', 105, yPos + 80, { align: 'center' });
      }
      break;
      
    default:
      chartTitle = 'Data Visualization';
      doc.text(chartTitle, 20, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Visual representation of the data:', 20, yPos + 20);
  }
  
  // Add footer to first page
  doc.setFontSize(10);
  doc.text('Summary and detailed data are available on the following pages.', 20, 280);
  
  // PAGE 2: SUMMARY PAGE
  doc.addPage();
  
  // Title
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text(title, 20, 30);
  
  // Date
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 45);
  
  // Summary section
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Summary', 20, 70);
  
  let summaryYPos = 85;
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  summaryData.forEach((item) => {
    doc.text(`• ${item.label}: ${item.value}`, 25, summaryYPos);
    summaryYPos += 15;
  });
  
  // Legends section if provided
  if (legends && legends.length > 0) {
    summaryYPos += 10;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Legend', 20, summaryYPos);
    summaryYPos += 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    legends.forEach((legend) => {
      doc.text(`• ${legend.label}: ${legend.value}`, 25, summaryYPos);
      summaryYPos += 12;
    });
  }
  
  // PAGE 3+: TABLE DATA
  if (tableData && tableData.length > 0) {
    doc.addPage();
    
    // Table title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Detailed Data', 20, 25);
    
    // Prepare table body data with improved mapping
    const tableBody = tableData.map(row => {
      return tableHeaders.map(header => {
        // Try multiple key formats to find the data
        const possibleKeys = [
          header, // exact header match
          header.toLowerCase(), // lowercase
          header.toLowerCase().replace(/ /g, '_'), // snake_case
          header.toLowerCase().replace(/\s+/g, ''), // no spaces
          header.replace(/ /g, '_') // original case snake_case
        ];
        
        for (const key of possibleKeys) {
          if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
            return row[key];
          }
        }
        
        // If no match found, return empty string
        console.warn(`No data found for header "${header}" in row:`, row);
        return '';
      });
    });
    
    // Generate table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableBody,
      startY: 35,
      theme: 'striped',
      styles: { 
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: { 
        fillColor: [51, 78, 123],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35, left: 20, right: 20 },
      didDrawPage: function(data) {
        // Add page number
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    });
  }
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Specialized Excel generator for User Growth Over Time with separate sheets
function generateUserGrowthExcel(title, summaryData, dailyTableData, monthlyTableData, legends = null) {
  const wb = XLSX.utils.book_new();
  
  // Create summary data for first sheet
  const summarySheetData = [
    [title],
    [`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`],
    [], // Empty row
    ['Summary'],
    ...summaryData.map(item => [item.label, item.value])
  ];
  
  // Add legends if provided
  if (legends && legends.length > 0) {
    summarySheetData.push([], ['Legend'], ...legends.map(legend => [legend.label, legend.value]));
  }
  
  // Create summary worksheet
  const summaryWS = XLSX.utils.aoa_to_sheet(summarySheetData);
  
  // Style the summary sheet (basic styling)
  summaryWS['A1'] = { t: 's', v: title, s: { font: { bold: true, sz: 16 } } };
  summaryWS['A4'] = { t: 's', v: 'Summary', s: { font: { bold: true, sz: 14 } } };
  
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
  
  // Daily data worksheet
  if (dailyTableData && dailyTableData.length > 0) {
    const dailySheetData = [
      ['Daily User Registration Data'],
      [], // Empty row
      ['Date', 'New Users'],
      ...dailyTableData.map(row => [row.Date, row['New Users']])
    ];
    
    const dailyWS = XLSX.utils.aoa_to_sheet(dailySheetData);
    dailyWS['A1'] = { t: 's', v: 'Daily User Registration Data', s: { font: { bold: true, sz: 14 } } };
    
    XLSX.utils.book_append_sheet(wb, dailyWS, 'Daily Data');
  }
  
  // Monthly data worksheet
  if (monthlyTableData && monthlyTableData.length > 0) {
    const monthlySheetData = [
      ['Monthly User Registration Data'],
      [], // Empty row
      ['Month', 'New Users'],
      ...monthlyTableData.map(row => [row.Month, row['New Users']])
    ];
    
    const monthlyWS = XLSX.utils.aoa_to_sheet(monthlySheetData);
    monthlyWS['A1'] = { t: 's', v: 'Monthly User Registration Data', s: { font: { bold: true, sz: 14 } } };
    
    XLSX.utils.book_append_sheet(wb, monthlyWS, 'Monthly Data');
  }
  
  // Save the Excel file
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

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

  // Current date and time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Download handlers
  const handleDownloadUserGrowth = async (format) => {
    const title = "User Growth Over Time";
    const todayISO = new Date().toISOString().slice(0, 10);
    const usersToday = daily.find(d => d.label === todayISO)?.count || 0;
    const totalMonthly = monthly.reduce((sum, m) => sum + m.count, 0);
    const avgDaily = Math.round(daily.reduce((sum, d) => sum + d.count, 0) / (daily.length || 1));
    
    const summaryData = [
      { label: "Users Registered Today", value: usersToday },
      { label: "Total Monthly Users", value: totalMonthly },
      { label: "Average Daily Growth", value: avgDaily }
    ];
    
    // Separate daily and monthly data for the table (exclude 0 counts)
    const dailyTableData = daily.filter(d => d.count > 0).map(d => ({ 
      'Date': d.label, 
      'New Users': d.count
    }));
    
    const monthlyTableData = monthly.filter(m => m.count > 0).map(m => ({ 
      'Month': m.label, 
      'New Users': m.count
    }));
    
    const legends = [
      { label: "Daily", value: "Shows user registrations for specific dates" },
      { label: "Monthly", value: "Shows user registrations aggregated by month" }
    ];
    
    await logDownloadAction(title, format);
    
    if (format === 'pdf') {
      generateUserGrowthPDFWithChart(title, summaryData, dailyTableData, monthlyTableData, legends);
    } else {
      generateUserGrowthExcel(title, summaryData, dailyTableData, monthlyTableData, legends);
    }
  };



  const handleDownloadMainConcerns = async (format) => {
    const title = "Main Concerns (Feedback)";
    const totalConcerns = mainConcerns.length;
    const topConcern = mainConcerns.length > 0 ? mainConcerns.sort((a, b) => b.concern_count - a.concern_count)[0] : null;
    
    const summaryData = [
      { label: "Total Feedback Entries", value: totalConcerns },
      { label: "Number of Concern Types", value: mainConcerns.length },
      { label: "Most Common Concern", value: topConcern ? `${topConcern.main_concern} (${topConcern.concern_count} entries)` : "N/A" },
      { label: "Report Generation Date", value: new Date().toLocaleDateString() }
    ];
    
    // Map the data properly for the table
    const tableData = mainConcerns.map(concern => ({ 
      'Main Concern': concern.main_concern, 
      'Concern Count': concern.concern_count,
    }));
    
    const tableHeaders = ['Main Concern', 'Concern Count'];
    
    const legends = [
      { label: "Main Concern", value: "The primary issue or feedback topic" },
      { label: "Concern Count", value: "Number of feedback entries for this concern" },
    ];
    
    await logDownloadAction(title, format);
    
    if (format === 'pdf') {
      generateChartFirstPDF(title, summaryData, tableData, tableHeaders, legends, 'bar');
    } else {
      generateExcel(title, summaryData, tableData, tableHeaders, legends);
    }
  };

  const handleDownloadContentMatch = async (format) => {
    const title = "Content Match Rate Analysis";
    
    try {
      // Ensure content match data is loaded
      let dataToUse = contentMatchData;
      
      // If no data is loaded, fetch it first
      if (!dataToUse || dataToUse.length === 0) {
        console.log('No content match data loaded, fetching now...');
        setLoadingContentMatch(true);
        
        try {
          const res = await fetch(API_CONTENT_MATCH);
          const json = await res.json();
          console.log('Content Match API Response for PDF:', json);
          
          const formattedData = Array.isArray(json.data)
            ? json.data.map(row => ({
                label: row.words || 'Unknown',
                count: row.is_matched ? "Matched" : "Not Matched",
                is_matched: row.is_matched // Keep original for calculations
              }))
            : [];
          
          console.log('Formatted Content Match Data for PDF:', formattedData);
          dataToUse = formattedData;
          
          // Also update the state for future use
          setContentMatchData(formattedData);
        } catch (fetchError) {
          console.error('Error fetching content match data for PDF:', fetchError);
          dataToUse = [];
        } finally {
          setLoadingContentMatch(false);
        }
      }
      
      // Safety check for contentMatchData
      if (!dataToUse || dataToUse.length === 0) {
        console.log('No content match data available, generating empty report');
        const summaryData = [
          { label: "Overall Match Rate", value: "0.0%" },
          { label: "Total Words Analyzed", value: "0" },
          { label: "Matched Words", value: "0 (0.0%)" },
          { label: "Unmatched Words", value: "0 (0.0%)" },
          { label: "Report Generation Date", value: new Date().toLocaleDateString() },
          { label: "Data Status", value: "No content match data available" }
        ];
        
        const tableData = [
          { 'Word/Phrase': 'No data available', 'Match Status': 'N/A', 'Frequency': 0, 'Analysis Date': new Date().toLocaleDateString() }
        ];
        
        const tableHeaders = ['Word/Phrase', 'Match Status', 'Frequency', 'Analysis Date'];
        
        const legends = [
          { label: "Matched", value: "Content successfully matched with database" },
          { label: "Not Matched", value: "Content not found in database" },
          { label: "Frequency", value: "Number of times this content appeared" }
        ];
        
        await logDownloadAction(title, format);
        
        if (format === 'pdf') {
          generateChartFirstPDF(title, summaryData, tableData, tableHeaders, legends, 'gauge');
        } else {
          generateExcel(title, summaryData, tableData, tableHeaders, legends);
        }
        return;
      }
      
      // Process actual data with improved error handling
      const totalWords = Array.isArray(dataToUse) ? dataToUse.length : 0;
      
      if (totalWords === 0) {
        throw new Error('Content match data is empty or invalid');
      }
      
      console.log('Processing content match data:', dataToUse);
      
      // More flexible matching for different data formats
      const matchedWords = dataToUse.filter(item => {
        // Check multiple possible ways the match status might be indicated
        if (item.is_matched === true || item.is_matched === 1) return true;
        const status = (item.count || item.status || '').toString().toLowerCase();
        return status === 'matched' || status === 'match' || status === '1' || status === 'true';
      }).length;
      
      const unmatchedWords = totalWords - matchedWords;
      const matchPercentage = totalWords > 0 ? ((matchedWords / totalWords) * 100).toFixed(1) : '0.0';
      
      console.log(`Content Match Analysis: ${matchedWords}/${totalWords} matched (${matchPercentage}%)`);
      
      // Get overall rate with fallback
      let overallRate = matchPercentage;
      if (contentRate && typeof contentRate.overall === 'number') {
        overallRate = contentRate.overall.toFixed(1);
      }
      
      const summaryData = [
        { label: "Overall Match Rate", value: `${overallRate}%` },
        { label: "Total Words Analyzed", value: totalWords.toString() },
        { label: "Matched Words", value: `${matchedWords} (${matchPercentage}%)` },
        { label: "Unmatched Words", value: `${unmatchedWords} (${(100 - parseFloat(matchPercentage)).toFixed(1)}%)` },
        { label: "Report Generation Date", value: new Date().toLocaleDateString() }
      ];
      
      // Content match table data with improved mapping and validation
      const tableData = dataToUse.map((item, index) => {
        // Handle different possible field names
        const wordPhrase = item.label || item.word || item.phrase || item.expression || item.text || `Item ${index + 1}`;
        let matchStatus = 'Not Matched';
        
        // Check multiple ways the status might be indicated
        if (item.is_matched === true || item.is_matched === 1) {
          matchStatus = 'Matched';
        } else if (item.count) {
          matchStatus = item.count.toString();
        } else if (item.status) {
          matchStatus = item.status.toString();
        } else if (item.match_status) {
          matchStatus = item.match_status.toString();
        }
        
        const frequency = parseInt(item.frequency || item.total || item.occurrences || '1') || 1;
        
        return {
          'Word/Phrase': wordPhrase.toString(),
          'Match Status': matchStatus,
          'Frequency': frequency,
          'Analysis Date': new Date().toLocaleDateString()
        };
      });
      
      console.log('Final table data for PDF:', tableData);
      
      const tableHeaders = ['Word/Phrase', 'Match Status', 'Frequency', 'Analysis Date'];
      
      const legends = [
        { label: "Matched", value: "Content successfully matched with database" },
        { label: "Not Matched", value: "Content not found in database" },
        { label: "Frequency", value: "Number of times this content appeared" }
      ];
      
      await logDownloadAction(title, format);
      
      if (format === 'pdf') {
        generateChartFirstPDF(title, summaryData, tableData, tableHeaders, legends, 'gauge');
      } else {
        generateExcel(title, summaryData, tableData, tableHeaders, legends);
      }
      
    } catch (error) {
      console.error('Error in handleDownloadContentMatch:', error);
      
      // Fallback error handling
      const errorSummaryData = [
        { label: "Error", value: "Unable to process content match data" },
        { label: "Error Details", value: error.message || 'Unknown error' },
        { label: "Report Generation Date", value: new Date().toLocaleDateString() },
        { label: "Suggestion", value: "Please refresh the page and try again" }
      ];
      
      const errorTableData = [
        { 'Error Type': 'Data Processing Error', 'Description': error.message || 'Unknown error', 'Date': new Date().toLocaleDateString() }
      ];
      
      const errorTableHeaders = ['Error Type', 'Description', 'Date'];
      
      await logDownloadAction(`${title} - Error`, format);
      
      if (format === 'pdf') {
        generateChartFirstPDF(`${title} - Error Report`, errorSummaryData, errorTableData, errorTableHeaders, [], 'gauge');
      } else {
        generateExcel(`${title} - Error Report`, errorSummaryData, errorTableData, errorTableHeaders, []);
      }
    }
  };

  const handleDownloadDemographicsSex = async (format) => {
    const title = "User Demographics - By Sex";
    
    // Ensure we have data
    if (!sexData || sexData.length === 0) {
      console.error('No sex demographics data available for download');
      alert('No demographic data available for download');
      return;
    }

    const totalUsers = sexData.reduce((sum, s) => sum + (parseInt(s.user_count) || 0), 0);
    const maleCount = sexData.find(s => s.sex.toLowerCase() === 'male')?.user_count || 0;
    const femaleCount = sexData.find(s => s.sex.toLowerCase() === 'female')?.user_count || 0;
    
    const summaryData = [
      { label: "Total Users", value: totalUsers },
      { label: "Male Users", value: `${maleCount} (${totalUsers > 0 ? ((maleCount/totalUsers)*100).toFixed(1) : 0}%)` },
      { label: "Female Users", value: `${femaleCount} (${totalUsers > 0 ? ((femaleCount/totalUsers)*100).toFixed(1) : 0}%)` },
      { label: "Gender Categories", value: sexData.length }
    ];
    
    // Ensure proper data mapping for table
    const tableData = sexData.map(s => ({ 
      'Sex': s.sex || 'Unknown', 
      'User Count': parseInt(s.user_count) || 0, 
      'Percentage': totalUsers > 0 ? `${(((parseInt(s.user_count) || 0)/totalUsers)*100).toFixed(1)}%` : '0.0%'
    }));
    
    const tableHeaders = ['Sex', 'User Count', 'Percentage'];
    
    console.log('Sex Demographics - Table Data:', tableData);
    
    await logDownloadAction(title, format);
    
    if (format === 'pdf') {
      generateChartFirstPDF(title, summaryData, tableData, tableHeaders, null, 'pie');
    } else {
      generateExcel(title, summaryData, tableData, tableHeaders);
    }
  };

  const handleDownloadDemographicsAge = async (format) => {
    const title = "User Demographics - By Age Group";
    
    // Ensure we have data
    if (!ageData || ageData.length === 0) {
      console.error('No age demographics data available for download');
      alert('No age demographic data available for download');
      return;
    }
    
    // Clean and validate age data with more flexible filtering
    const validAgeData = ageData.filter(item => {
      if (!item || !item.age_group) return false;
      
      // Convert user_count to number if it's a string
      let userCount = item.user_count;
      if (typeof userCount === 'string') {
        userCount = parseInt(userCount) || 0;
      }
      if (typeof userCount !== 'number') {
        userCount = 0;
      }
      
      // Update the item with the converted number
      item.user_count = userCount;
      
      // Include items with user_count >= 0 (including 0 for complete data)
      return userCount >= 0;
    });
    
    console.log('Original ageData:', ageData);
    console.log('Filtered validAgeData:', validAgeData);
    
    const totalUsers = validAgeData.reduce((sum, a) => sum + (a.user_count || 0), 0);
    const topAgeGroup = validAgeData.length > 0 ? 
      [...validAgeData].sort((a, b) => (b.user_count || 0) - (a.user_count || 0))[0] : null;
    
    const summaryData = [
      { label: "Total Users", value: totalUsers.toString() },
      { label: "Most Common Age Group", value: topAgeGroup ? `${topAgeGroup.age_group} (${topAgeGroup.user_count || 0} users)` : "N/A" },
      { label: "Age Categories", value: validAgeData.length.toString() },
      { label: "Report Generation Date", value: new Date().toLocaleDateString() }
    ];
    
    // Ensure proper data mapping for table
    const tableData = validAgeData.map(a => ({ 
      'Age Group': (a.age_group || 'Unknown').toString(), 
      'User Count': a.user_count || 0, 
      'Percentage': totalUsers > 0 ? `${(((a.user_count || 0)/totalUsers)*100).toFixed(1)}%` : '0.0%'
    }));
    
    console.log('Final tableData for age:', tableData);
    
    const tableHeaders = ['Age Group', 'User Count', 'Percentage'];
    
    await logDownloadAction(title, format);
    
    if (format === 'pdf') {
      generateChartFirstPDF(title, summaryData, tableData, tableHeaders, null, 'pie');
    } else {
      generateExcel(title, summaryData, tableData, tableHeaders);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = currentTime.toLocaleTimeString();

  useEffect(() => {
    async function fetchGrowth() {
      setLoading(true);
      try {
        const [dailyRes, monthlyRes] = await Promise.all([
          fetch(API_DAILY),
          fetch(API_MONTHLY),
        ]);
        const dailyJson = await dailyRes.json();
        const monthlyJson = await monthlyRes.json();

        // Format and fill missing dates for daily
        let dailyData = formatCountData(dailyJson.data || [], "registration_date", "new_users_count");
        console.log('Raw daily data from API:', dailyJson.data);
        console.log('Formatted daily data:', dailyData);
        
        if (dailyData.length > 0) {
          const today = getTodayISO();
          const allDates = getDateRange(dailyData[0].label, today);
          dailyData = fillMissing(dailyData, allDates);
          console.log('Daily data after filling missing dates:', dailyData);
        }

        // Format and fill missing months for monthly
        let monthlyData = formatCountData(monthlyJson.data || [], "registration_month", "new_users_count");
        console.log('Raw monthly data from API:', monthlyJson.data);
        console.log('Formatted monthly data:', monthlyData);
        
        if (monthlyData.length > 0) {
          const now = new Date();
          const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
          const allMonths = getMonthRange(monthlyData[0].label, currentMonth);
          monthlyData = fillMissing(monthlyData, allMonths);
          console.log('Monthly data after filling missing months:', monthlyData);
        }

        setDaily(dailyData);
        setMonthly(monthlyData);
      } catch {
        setDaily([]);
        setMonthly([]);
      }
      setLoading(false);
    }
    fetchGrowth();
  }, []);

  useEffect(() => {
    async function fetchDemographics() {
      setLoadingDemographics(true);
      try {
        const [sexRes, ageRes] = await Promise.all([
          fetch(API_DEMOGRAPHICS_SEX),
          fetch(API_DEMOGRAPHICS_AGE),
        ]);
        const sexJson = await sexRes.json();
        const ageJson = await ageRes.json();
        setSexData(sexJson.data || []);
        setAgeData(ageJson.data || []);
      } catch {
        setSexData([]);
        setAgeData([]);
      }
      setLoadingDemographics(false);
    }
    fetchDemographics();
  }, []);

  // Fetch content rate
  useEffect(() => {
    async function fetchContentRate() {
      setLoadingContentRate(true);
      try {
        const res = await fetch(API_CONTENT_RATE);
        const json = await res.json();
        console.log('Content Rate API Response:', json);
        
        const processedData = {
          overall: parseFloat(json.overall_match_rate) || 0,
          monthly: Array.isArray(json.monthly_trend) ? json.monthly_trend : [],
        };
        
        console.log('Processed Content Rate Data:', processedData);
        setContentRate(processedData);
      } catch (error) {
        console.error('Error fetching content rate:', error);
        setContentRate({ overall: 0, monthly: [] });
      }
      setLoadingContentRate(false);
    }
    fetchContentRate();
  }, []);

  useEffect(() => {
    if (!showContentMatchModal) return;
    setLoadingContentMatch(true);
    fetch(API_CONTENT_MATCH)
      .then(res => res.json())
      .then(json => {
        console.log('Content Match API Response:', json);
        // Map to table format: label = words, count = is_matched ? "Matched" : "Not Matched"
        const formattedData = Array.isArray(json.data)
          ? json.data.map(row => ({
              label: row.words || 'Unknown',
              count: row.is_matched ? "Matched" : "Not Matched",
              is_matched: row.is_matched // Keep original for calculations
            }))
          : [];
        
        console.log('Formatted Content Match Data:', formattedData);
        setContentMatchData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching content match data:', error);
        setContentMatchData([]);
      })
      .finally(() => setLoadingContentMatch(false));
  }, [showContentMatchModal]);

  // Fetch main concerns
  useEffect(() => {
    setLoadingMain(true);
    fetch(API_MAIN_CONCERN)
      .then(res => res.json())
      .then(json => setMainConcerns(json.data || []))
      .catch(() => setMainConcerns([]))
      .finally(() => setLoadingMain(false));
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

  // Fetch today's summary counts
  useEffect(() => {
    // Feedback
    fetch(import.meta.env.VITE_FEEDBACK_GET)
      .then(res => res.json())
      .then(json => {
        const today = new Date().toISOString().slice(0, 10);
        const todayFeedback = (json.data || []).filter(f => (f.created_at || '').slice(0, 10) === today);
        setFeedbackCount(todayFeedback.length);
        setFeedbackToday(todayFeedback);
      })
      .catch(() => { setFeedbackCount(0); setFeedbackToday([]); });
    // Logs
    fetch(import.meta.env.VITE_LOGS_GET)
      .then(res => res.json())
      .then(json => {
        const today = new Date().toISOString().slice(0, 10);
        setLogsCount((json.data || []).filter(l => (l.created_at || '').slice(0, 10) === today).length);
      })
      .catch(() => setLogsCount(0));
    // Analytics (main concern)
    fetch(import.meta.env.VITE_ANALYTICS_MAINCONCERN)
      .then(res => res.json())
      .then(json => {
        const today = new Date().toISOString().slice(0, 10);
        setAnalyticsCount((json.data || []).filter(a => (a.created_at || '').slice(0, 10) === today).length);
      })
      .catch(() => setAnalyticsCount(0));
  }, []);

  const todayISO = new Date().toISOString().slice(0, 10);
  const usersRegisteredToday = daily.find(d => d.label === todayISO)?.count || 0;

  // Chart data and options (counts)
  const monthlyChartData = {
    labels: monthly.map(d => d.label),
    datasets: [
      {
        label: "Monthly New Users",
        data: monthly.map(d => d.count),
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        pointBackgroundColor: "#2563eb",
        tension: 0.3,
      },
    ],
  };

  // Pie chart for sex - ensure both Male and Female are always shown
  const sexPieData = (() => {
    // Create a map of existing data
    const dataMap = {};
    sexData.forEach(d => {
      dataMap[d.sex.toLowerCase()] = d.user_count;
    });
    
    // Ensure both male and female are included
    const labels = ['Male', 'Female'];
    const data = [
      dataMap['male'] || 0,
      dataMap['female'] || 0
    ];
    
    // Add any additional genders from the data
    sexData.forEach(d => {
      if (!['male', 'female'].includes(d.sex.toLowerCase())) {
        labels.push(d.sex);
        data.push(d.user_count);
      }
    });
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#2563eb", "#f59e42", "#e5e7eb", "#a5b4fc"],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  })();

  // Pie chart for age group
  const agePieData = {
    labels: ageData.map(d => d.age_group),
    datasets: [
      {
        data: ageData.map(d => d.user_count),
        backgroundColor: [
          "#2563eb", "#f59e42", "#a5b4fc", "#fbbf24", "#10b981", "#e11d48"
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Content Rate Line Chart
  const contentRateLineData = {
    labels: contentRate.monthly.map(m => m.creation_month),
    datasets: [
      {
        label: "Monthly Match Rate (%)",
        data: contentRate.monthly.map(m => m.monthly_match_rate),
        fill: false,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        pointBackgroundColor: "#10b981",
        tension: 0.3,
      },
    ],
  };

  // Main Concerns Bar Chart
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

  // Find max count for y-axis step
  const maxDaily = Math.max(1, ...daily.map(d => d.count));
  const maxMonthly = Math.max(1, ...monthly.map(d => d.count));
  const maxY = Math.max(maxDaily, maxMonthly);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${Math.round(ctx.parsed.y)} users`,
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
        stepSize: 1,
        suggestedMax: maxY < 10 ? 10 : undefined,
        ticks: {
          stepSize: 1,
          callback: value => Number.isInteger(value) ? value : "",
          color: "#2563eb",
          font: { size: 14 },
        },
        grid: { color: "rgba(37,99,235,0.08)" },
      },
    },
  };

  // Content Rate Line Chart Options
  const contentRateLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.parsed.y?.toFixed(1) ?? 0}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#10b981", font: { size: 14 } },
        grid: { color: "rgba(16,185,129,0.08)" },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: value => `${value}%`,
          color: "#10b981",
          font: { size: 14 },
        },
        grid: { color: "rgba(16,185,129,0.08)" },
      },
    },
  };

  return (
    <>
      <AdminNavBar>
       <div className="admin-analytics-container content-area-scroll" style={{ border: '2px solid rgb(51, 78, 123)', width: 'auto', maxWidth: '1200px', margin: '2rem auto' , borderRadius: 10}}>
         
          <div className="analytics-greeting-row">
            <div className="analytics-greeting-text">
              <h2>Welcome back, Admin!</h2>
              <div className="analytics-greeting-date">{formattedDate}</div>
              <div className="analytics-greeting-time">{formattedTime}</div>
            </div>
          </div>

          {/* --- Summary Outer Container --- */}
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
            <div className="section-header">
              <h2 className="section-title">User Growth Over Time</h2>
              <div className="download-buttons">
                <button 
                  className="download-btn pdf"
                  onClick={() => handleDownloadUserGrowth('pdf')}
                >
                   Download PDF
                </button>
                <button 
                  className="download-btn excel"
                  onClick={() => handleDownloadUserGrowth('excel')}
                >
                  Download Excel
                </button>
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
            <div className="section-header">
              <h2 className="content-rate-title">Content Match Rate</h2>
              <div className="download-buttons">
                <button 
                  className="download-btn pdf"
                  onClick={() => handleDownloadContentMatch('pdf')}
                >
                  Download PDF
                </button>
                <button 
                  className="download-btn excel"
                  onClick={() => handleDownloadContentMatch('excel')}
                >
                  Download Excel
                </button>
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
            {/* Modal for Content Match Table */}
            <Modal open={showContentMatchModal} onClose={() => setShowContentMatchModal(false)}>
              <AdminTable
                title="Content Match Table"
                data={contentMatchData}
                labelName="Word/Phrase"
                countName="Match Status"
                percentName={null}
              />
              {loadingContentMatch && (
                <div className="admin-analytics-loading-green">Loading...</div>
              )}
            </Modal>
          </div>

          {/* --- User Demographics Section --- */}
          <div className="analytics-section content-area-scroll">
            <h2 className="section-title">User Analytics</h2>
            <div className="demographics-horizontal-scroll mobile-scroll">
              {/* Demographics by Sex Card */}
              <div className="demographics-card">
                <div className="demographics-header">
                  <div className="demographics-title">By Sex</div>
                  <div className="demographics-downloads">
                    <button 
                      className="download-icon-btn pdf"
                      onClick={() => handleDownloadDemographicsSex('pdf')}
                      title="Download Sex Demographics PDF"
                    >
                      📄
                    </button>
                    <button 
                      className="download-icon-btn excel"
                      onClick={() => handleDownloadDemographicsSex('excel')}
                      title="Download Sex Demographics Excel"
                    >
                      📊
                    </button>
                  </div>
                </div>
                {loadingDemographics ? (
                  <div className="admin-analytics-loading">Loading...</div>
                ) : (
                  <Pie
                    data={sexPieData}
                    options={{
                      plugins: {
                        legend: { display: true, position: "bottom" },
                        tooltip: {
                          callbacks: {
                            label: ctx =>
                              `${ctx.label}: ${ctx.raw} (${sexData[ctx.dataIndex]?.percentage?.toFixed(1) || 0}%)`,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>

              {/* Demographics by Age Group Card */}
              <div className="demographics-card">
                <div className="demographics-header">
                  <div className="demographics-title">By Age Group</div>
                  <div className="demographics-downloads">
                    <button 
                      className="download-icon-btn pdf"
                      onClick={() => handleDownloadDemographicsAge('pdf')}
                      title="Download Age Demographics PDF"
                    >
                      📄
                    </button>
                    <button 
                      className="download-icon-btn excel"
                      onClick={() => handleDownloadDemographicsAge('excel')}
                      title="Download Age Demographics Excel"
                    >
                      📊
                    </button>
                  </div>
                </div>
                {loadingDemographics ? (
                  <div className="admin-analytics-loading">Loading...</div>
                ) : (
                  <Pie
                    data={agePieData}
                    options={{
                      plugins: {
                        legend: { display: true, position: "bottom" },
                        tooltip: {
                          callbacks: {
                            label: ctx =>
                              `${ctx.label}: ${ctx.raw} users`,
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>

              {/* You can add more demographic cards here */}
              <div className="demographics-card">
                <div className="demographics-title">More Coming Soon...</div>
                {loadingDemographics ? (
                  <div className="admin-analytics-loading">Loading...</div>
                ) : (
                  <p className="admin-analytics-coming-soon">📈📊📉</p>
                )}
              </div>
            </div>
          </div>

          {/* --- Main Concerns Section --- */}
          <div className="analytics-section" style={{ border: '2px solid #334E7B', borderRadius: 10, width: 'auto', maxWidth: '1200px', margin: '2rem auto' }}>
            <div className="section-header">
              <h2 className="section-title">Main Concerns (Feedback)</h2>
              <div className="download-buttons">
                <button 
                  className="download-btn pdf"
                  onClick={() => handleDownloadMainConcerns('pdf')}
                >
                 Download PDF
                </button>
                <button 
                  className="download-btn excel"
                  onClick={() => handleDownloadMainConcerns('excel')}
                >
                  Download Excel
                </button>
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
              {loadingFeedback && (
                <div className="admin-analytics-loading">Loading...</div>
              )}
            </Modal>
          </div>
        </div>
      </AdminNavBar>
    </>
  );
}