import React, { useEffect, useState } from "react";
import AdminNavBar from '../components/AdminNavBar';
import AdminTable from './AdminTable';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const API_DAILY = import.meta.env.VITE_USERGROWTHOVERTIMEDAILY;
const API_MONTHLY = import.meta.env.VITE_USERGROWTHOVERTIMEMONTHLY;

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

export default function AdminHome() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDailyModal, setShowDailyModal] = useState(false);

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

  const dailyChartData = {
    labels: daily.map(d => d.label),
    datasets: [
      {
        label: "Daily New Users",
        data: daily.map(d => d.count),
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        pointBackgroundColor: "#2563eb",
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

  return (
    <>
      <style>{`
        body, #root {
          background: #f4f6fa !important;
        }
        .growth-container {
          width: 95vw;
          max-width: 700px;
          margin: 0 auto;
          padding: 4vw 0 8vw 0;
          background: #f4f6fa;
        }
        .growth-chart-section {
          margin-bottom: 7vw;
        }
        .growth-chart-label {
          color: #2563eb;
          font-size: 1.2em;
          font-weight: 600;
          margin-bottom: 1vw;
          text-align: left;
          padding-left: 2vw;
        }
        .growth-chart-box {
          width: 100%;
          height: 40vw;
          min-height: 240px;
          max-height: 400px;
          background: #fff;
          border-radius: 2vw;
          box-shadow: 0 2px 16px rgba(37,99,235,0.08);
          margin-bottom: 2vw;
          padding: 2vw 2vw 1vw 2vw;
          box-sizing: border-box;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        .growth-chart-box:hover {
          box-shadow: 0 4px 24px rgba(37,99,235,0.18);
        }
        @media (max-width: 600px) {
          .growth-chart-label {
            font-size: 1em;
            padding-left: 1vw;
          }
          .growth-chart-box {
            height: 60vw;
            min-height: 180px;
            padding: 3vw 1vw 2vw 1vw;
          }
        }
      `}</style>
      <AdminNavBar />
      <div className="growth-container">
        <div className="growth-chart-section">
          <div className="growth-chart-label">Monthly User Growth Over Time</div>
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
              title="Daily New Users  "
              data={daily}
              labelName="Date"
              countName="New Users"
              percentName={null}
            />
          </Modal>
        </div>
      </div>
    </>
  );
}