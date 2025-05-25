import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import { Line, Pie } from "react-chartjs-2";
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
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler, ArcElement);

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
  return data.map(d => ({
    label: d[labelKey],
    count: Math.round(Number(d[countKey]) || 0),
  }));
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

export default function AdminAnalytics() {
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
        if (dailyData.length > 0) {
          const today = getTodayISO();
          const allDates = getDateRange(dailyData[0].label, today);
          dailyData = fillMissing(dailyData, allDates);
        }

        // Format and fill missing months for monthly
        let monthlyData = formatCountData(monthlyJson.data || [], "registration_month", "new_users_count");
        if (monthlyData.length > 0) {
          const now = new Date();
          const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
          const allMonths = getMonthRange(monthlyData[0].label, currentMonth);
          monthlyData = fillMissing(monthlyData, allMonths);
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
        setContentRate({
          overall: json.overall_match_rate || 0,
          monthly: Array.isArray(json.monthly_trend) ? json.monthly_trend : [],
        });
      } catch {
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
        // Map to table format: label = words, count = is_matched ? "Matched" : "Not Matched"
        setContentMatchData(
          Array.isArray(json.data)
            ? json.data.map(row => ({
                label: row.words,
                count: row.is_matched ? "Matched" : "Not Matched"
              }))
            : []
        );
      })
      .catch(() => setContentMatchData([]))
      .finally(() => setLoadingContentMatch(false));
  }, [showContentMatchModal]);

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

  // Pie chart for sex
  const sexPieData = {
    labels: sexData.map(d => d.sex),
    datasets: [
      {
        data: sexData.map(d => d.user_count),
        backgroundColor: ["#2563eb", "#f59e42", "#e5e7eb", "#a5b4fc"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

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
      <style>{`
        body, #root {
          background: #f4f6fa !important;
        }
        .admin-analytics-container {
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
        .growth-chart-container {
          width: 95vw;
          max-width: 700px;
          margin: 0 auto;
          padding: 0;
          background: #fff;
        }
        .growth-chart-label {
          color: #2563eb;
          font-size: 1.2em;
          font-weight: 600;
          margin-bottom: 1vw;
          text-align: left;
          padding-left: 0;
        }
        .growth-chart-box {
          width: 100%;
          height: 40vw;
          min-height: 240px;
          max-height: 400px;
          background: #fff;
          border-radius: 1vw;
          box-shadow: 0 2px 16px rgba(37,99,235,0.08);
          margin-bottom: 1vw;
          padding: 2vw 2vw 1vw 2vw;
          box-sizing: border-box;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        .growth-chart-box:hover {
          box-shadow: 0 4px 24px rgba(37,99,235,0.18);
        }
        .demographics-horizontal-scroll {
          display: flex;
          overflow-x: auto;
          gap: 2vw;
          padding-bottom: 1vw;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #2563eb rgba(37,99,235,0.08);
        }
        .demographics-horizontal-scroll::-webkit-scrollbar {
          height: 0.8vw;
        }
        .demographics-horizontal-scroll::-webkit-scrollbar-track {
          background: rgba(37,99,235,0.08);
          border-radius: 10px;
        }
        .demographics-horizontal-scroll::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 10px;
        }
        .demographics-card {
          flex: 0 0 auto;
          width: 300px;
          min-width: 280px;
          background: #fff;
          border-radius: 1.5vw;
          box-shadow: 0 2px 16px rgba(37,99,235,0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2vw;
          box-sizing: border-box;
        }
        .demographics-title {
          color: #2563eb;
          font-size: 1.1em;
          font-weight: 600;
          margin-bottom: 1vw;
          text-align: center;
        }
        /* --- Content Rate Section --- */
        .content-rate-section {
          background: #fff;
          border-radius: 1.5vw;
          box-shadow: 0 2px 16px rgba(16,185,129,0.08);
          margin-bottom: 3vw;
          padding: 2vw;
        }
        .content-rate-title {
          color: #10b981;
          font-size: 1.5em;
          font-weight: 700;
          margin-bottom: 2vw;
          text-align: center;
        }
        .content-rate-gauge-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2vw;
        }
        .content-rate-line-container {
          width: 95vw;
          max-width: 700px;
          margin: 0 auto;
          background: #fff;
        }
        .content-rate-line-box {
          width: 100%;
          height: 40vw;
          min-height: 240px;
          max-height: 400px;
          background: #fff;
          border-radius: 1vw;
          box-shadow: 0 2px 16px rgba(16,185,129,0.08);
          margin-bottom: 1vw;
          padding: 2vw 2vw 1vw 2vw;
          box-sizing: border-box;
        }
        @media (max-width: 900px) {
          .demographics-card {
            width: 40%;
            min-width: 250px;
          }
        }
        @media (max-width: 600px) {
          .admin-analytics-container {
            padding: 4vw 2vw;
          }
          .analytics-section,
          .content-rate-section {
            padding: 4vw;
            margin-bottom: 5vw;
          }
          .section-title,
          .content-rate-title {
            font-size: 1.3em;
            margin-bottom: 4vw;
          }
          .growth-chart-label {
            font-size: 1em;
            padding-left: 0;
            text-align: center;
          }
          .growth-chart-box,
          .content-rate-line-box {
            height: 60vw;
            min-height: 180px;
            padding: 3vw 1vw 2vw 1vw;
            border-radius: 2vw;
          }
          .demographics-horizontal-scroll {
            gap: 4vw;
            padding-bottom: 3vw;
          }
          .demographics-card {
            min-width: 220px;
            width: 80vw;
            padding: 4vw;
          }
        }
      `}</style>
      <AdminNavBar>
        <div className="admin-analytics-container">

          {/* User Growth Section */}
          <div className="analytics-section">
            <h2 className="section-title">User Growth Over Time</h2>
            <div className="growth-chart-container">
              <div className="growth-chart-label">Monthly User Growth</div>
              <div
                className="growth-chart-box"
                onClick={() => setShowDailyModal(true)}
                title="Click to show daily user growth"
              >
                {loading ? (
                  <div style={{ color: "#2563eb", textAlign: "center" }}>Loading monthly growth...</div>
                ) : (
                  <Line data={monthlyChartData} options={{ ...chartOptions, onClick: undefined }} />
                )}
              </div>
              <Modal open={showDailyModal} onClose={() => setShowDailyModal(false)}>
                <AdminTable
                  title="Daily New Users"
                  data={daily.filter(row => row.count > 0)}
                  labelName="Date"
                  countName="New Users"
                  percentName={null}
                />
              </Modal>
            </div>
          </div>

          {/* --- Content Rate Section --- */}
          <div className="content-rate-section">
            <h2 className="content-rate-title">Content Match Rate</h2>
            <div
              className="content-rate-gauge-container"
              style={{ cursor: "pointer" }}
              onClick={() => setShowContentMatchModal(true)}
              title="Click to view content match table"
            >
              {loadingContentRate ? (
                <div style={{ color: "#10b981", textAlign: "center" }}>Loading overall match rate...</div>
              ) : (
                <GaugeChart value={contentRate.overall} />
              )}
              <div style={{ color: "#10b981", fontSize: "1em", marginTop: "0.5em", textAlign: "center" }}>
                Click to view content match table
              </div>
            </div>
            <div className="content-rate-line-container">
              <div className="growth-chart-label" style={{ color: "#10b981" }}>Monthly Match Rate Trend</div>
              <div className="content-rate-line-box">
                {loadingContentRate ? (
                  <div style={{ color: "#10b981", textAlign: "center" }}>Loading trend...</div>
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
                <div style={{ color: "#10b981", textAlign: "center" }}>Loading...</div>
              )}
            </Modal>
          </div>

          {/* User Demographics Section */}
          <div className="analytics-section">
            <h2 className="section-title">User Analytics</h2>
            <div className="demographics-horizontal-scroll">
              {/* Demographics by Sex Card */}
              <div className="demographics-card">
                <div className="demographics-title">By Sex</div>
                {loadingDemographics ? (
                  <div style={{ color: "#2563eb", textAlign: "center" }}>Loading...</div>
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
                <div className="demographics-title">By Age Group</div>
                {loadingDemographics ? (
                  <div style={{ color: "#2563eb", textAlign: "center" }}>Loading...</div>
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
                  <div style={{ color: "#2563eb", textAlign: "center" }}>Loading...</div>
                ) : (
                  <p style={{textAlign: 'center', color: '#6b7280'}}>📈📊📉</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminNavBar>
    </>
  );
}