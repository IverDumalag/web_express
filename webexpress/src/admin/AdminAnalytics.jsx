import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import { Line, Pie } from "react-chartjs-2";
import '../CSS/AdminAnalytics.css';
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
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">&times;</button>
        {children}
      </div>
    </div>
  );
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

  // Current date and time
  const [currentTime, setCurrentTime] = useState(new Date());

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
      <AdminNavBar>
        <div className="admin-analytics-container">
          {/* --- Greeting and Date/Time --- */}
          <div className="analytics-greeting-row">
            <div className="analytics-greeting-text">
              <h2>Welcome back, Admin!</h2>
              <div className="analytics-greeting-date">{formattedDate}</div>
              <div className="analytics-greeting-time">{formattedTime}</div>
            </div>
          </div>

          {/* --- Summary Outer Container --- */}
          <div className="analytics-summary-outer">
            <div className="analytics-summary-row">
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
                <h3>Analytics Today</h3>
                <div className="analytics-summary-count">{analyticsCount}</div>
                <span className="analytics-summary-label">Main concerns tracked today</span>
              </div>
            </div>
          </div>

          {/* --- User Growth Section --- */}
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
                  <div className="admin-analytics-loading">Loading monthly growth...</div>
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
            <div className="content-rate-line-container">
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
          <div className="analytics-section">
            <h2 className="section-title">User Analytics</h2>
            <div className="demographics-horizontal-scroll">
              {/* Demographics by Sex Card */}
              <div className="demographics-card">
                <div className="demographics-title">By Sex</div>
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
                <div className="demographics-title">By Age Group</div>
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
        </div>
      </AdminNavBar>
    </>
  );
}