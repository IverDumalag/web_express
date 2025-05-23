import React, { useState, useEffect } from "react";
import { FaFilter, FaTrash } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { getUserData } from '../data/UserData';
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/ConfirmationPopup";
import MessagePopup from "../components/MessagePopup";

// API endpoints
const API_URL = import.meta.env.VITE_PHRASESWORDSBYIDGET;
const DELETE_API_URL = import.meta.env.VITE_PHRASESWORDSDELETE;

export default function UserArchived() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("date-new");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // For delete confirmation and message
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: "", type: "info" });

  const userData = getUserData();
  const user_id = userData?.user_id || "";
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}?user_id=${encodeURIComponent(user_id)}`);
        const json = await res.json();
        setCards(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        setCards([]);
      }
      setLoading(false);
    }
    if (user_id) fetchCards();
  }, [user_id]);

  // Only archived cards
  let filteredCards = cards.filter(card => card.status === "archived");

  // Search
  if (search.trim() !== "") {
    filteredCards = filteredCards.filter(card =>
      (card.words || "").toLowerCase().includes(search.toLowerCase())
    );
  }

  // Natural sort for strings with numbers
  function naturalCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }

  // Sort
  if (sortBy === "alpha") {
    filteredCards = [...filteredCards].sort((a, b) =>
      naturalCompare((a.words || ""), (b.words || ""))
    );
  } else if (sortBy === "alpha-rev") {
    filteredCards = [...filteredCards].sort((a, b) =>
      naturalCompare((b.words || ""), (a.words || ""))
    );
  } else if (sortBy === "date-new") {
    filteredCards = [...filteredCards].sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );
  } else if (sortBy === "date-old") {
    filteredCards = [...filteredCards].sort((a, b) =>
      new Date(a.created_at) - new Date(b.created_at)
    );
  } else if (sortBy === "clear-filter") {
    filteredCards = [...filteredCards];
  }

  const sortOptions = [
    { label: "Clear Filter", value: "clear-filter" },
    { label: "Alphabetically (A-Z)", value: "alpha" },
    { label: "Alphabetically (Z-A)", value: "alpha-rev" },
    { label: "Date (Newest)", value: "date-new" },
    { label: "Date (Oldest)", value: "date-old" },
  ];

  // Delete handler with confirmation and popup
  const handleDelete = (entry_id) => {
    setDeleteId(entry_id);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(DELETE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry_id: deleteId }),
      });
      const json = await res.json();
      if (json.status === 200 || json.status === "200") {
        setCards(cards => cards.filter(card => card.entry_id !== deleteId));
        setPopup({ open: true, message: "Entry deleted permanently.", type: "success" });
      } else {
        setPopup({ open: true, message: json.message || "Failed to delete entry.", type: "error" });
      }
    } catch (e) {
      setPopup({ open: true, message: "Network error deleting entry.", type: "error" });
    }
    setDeleteLoading(false);
    setDeleteId(null);
  };

  return (
    <>
      <style>{`
        .archived-main-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8fc;
        }
        .archived-content-box {
          background: #fff;
          border-radius: 2vw;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          width: 90vw;
          max-width: 480px;
          min-width: 240px;
          padding: 4vw 4vw 2vw 4vw;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .archived-header-row {
          display: flex;
          align-items: center;
          margin-bottom: 2vw;
        }
        .archived-back-btn {
          background: none;
          border: none;
          font-size: 1.5em;
          color: #6c63ff;
          cursor: pointer;
          margin-right: 2vw;
        }
        .archived-bar-row {
          display: flex;
          align-items: center;
          margin-bottom: 4vw;
          position: relative;
        }
        .archived-input {
          flex: 1;
          padding: 2.5vw 2vw;
          font-size: 1.1em;
          border: 1px solid #ccc;
          border-radius: 1vw;
          outline: none;
        }
        .filter-icon-btn {
          background: none;
          border: none;
          margin-left: 2vw;
          font-size: 1.7em;
          color: #888;
          cursor: pointer;
          position: relative;
        }
        .filter-dropdown {
          position: absolute;
          top: 110%;
          right: 0;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 1vw;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          z-index: 10;
          min-width: 60vw;
          max-width: 220px;
        }
        .filter-option {
          padding: 2vw 4vw;
          font-size: 1em;
          color: #333;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }
        .filter-option.selected,
        .filter-option:hover {
          background: #f3f1ff;
          color: #6c63ff;
        }
        .archived-list {
          flex: 1;
          overflow-y: auto;
          max-height: 40vh;
          min-height: 120px;
          padding-right: 2%;
        }
        .archived-item {
          background: #f7f7fa;
          border-radius: 2vw;
          margin-bottom: 3%;
          padding: 3% 4%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .archived-content {
          flex: 1;
          min-width: 0;
        }
        .archived-title {
          font-weight: bold;
          font-size: 1.1em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .archived-action-btn {
          background: none;
          border: none;
          color: #e74c3c;
          font-size: 1.3em;
          cursor: pointer;
          margin-left: 2vw;
        }
        .archived-action-btn:hover {
          color: #c0392b;
        }
        @media (max-width: 600px) {
          .archived-content-box {
            width: 98vw;
            max-width: 99vw;
            padding: 6vw 2vw 3vw 2vw;
          }
          .archived-input {
            font-size: 1em;
            padding: 3vw 2vw;
          }
          .archived-list {
            max-height: 36vh;
          }
        }
      `}</style>
      <div className="archived-main-container">
        <div className="archived-content-box">
          {/* Back button and title */}
          <div className="archived-header-row">
            <button
              className="archived-back-btn"
              title="Back"
              onClick={() => navigate(-1)}
            >
              <MdArrowBack />
            </button>
            <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>Archived Cards</span>
          </div>
          {/* Search bar and filter */}
          <div className="archived-bar-row">
            <input
              className="archived-input"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              className="filter-icon-btn"
              title="Sort"
              onClick={() => setShowFilter(v => !v)}
            >
              <FaFilter />
            </button>
            {showFilter && (
              <div className="filter-dropdown">
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`filter-option${sortBy === opt.value ? " selected" : ""}`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowFilter(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Archived card list */}
          <div className="archived-list">
            {loading ? (
              <div style={{ textAlign: "center", color: "#aaa", marginTop: "4vw" }}>Loading...</div>
            ) : filteredCards.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", marginTop: "4vw" }}>No archived cards found.</div>
            ) : (
              filteredCards.map(card => (
                <div className="archived-item" key={card.entry_id}>
                  <div className="archived-content">
                    <div className="archived-title">{card.words}</div>
                  </div>
                  <button
                    className="archived-action-btn"
                    title="Delete"
                    onClick={() => handleDelete(card.entry_id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ConfirmationPopup
        open={!!deleteId}
        title="Delete Permanently"
        message="Are you sure you want to permanently delete this entry? This cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
      <MessagePopup
        open={popup.open}
        title={popup.type === "success" ? "Deleted" : popup.type === "error" ? "Error" : "Info"}
        description={popup.message}
        onClose={() => setPopup(p => ({ ...p, open: false }))}
        style={{ zIndex: 3001 }}
      />
    </>
  );
}