import React, { useState, useEffect } from "react";
import { FaFilter, FaTrash } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { getUserData } from '../data/UserData';
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/ConfirmationPopup";
import MessagePopup from "../components/MessagePopup";
import '../CSS/UserArchived.css';
import boyImg from '../assets/boy.png';

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
      <div className="archived-main-container">
        <div className="booksearch-bg" aria-hidden="true" />
        {/* Floating Boy and Speech Bubble */}
        <div style={{
          position: 'fixed',
          bottom: '38px',
          right: '38px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          pointerEvents: 'none',
          animation: 'boyFloat 2.2s ease-in-out infinite alternate',
        }}>
          <style>{`
            @keyframes boyFloat {
              0% { transform: translateY(0); }
              100% { transform: translateY(-18px); }
            }
            .archived-speech-bubble {
              position: absolute;
              bottom: 130px;
              right: -5.9px;
              background: rgba(255,255,255,0.97);
              color: #1C2E4A;
              border-radius: 18px;
              box-shadow: 0 2px 12px #1C2E4A22;
              padding: 0.9em 1.5em 0.9em 1.5em;
              font-family: 'Roboto Mono', monospace;
              font-weight: 600;
              font-size: 1.08em;
              white-space: nowrap;
              pointer-events: auto;
              border: 1.5px solid #1C2E4A;
              min-width: 210px;
              max-width: 320px;
              text-align: center;
              z-index: 2;
            }
            .archived-speech-bubble-tail {
              position: absolute;
              bottom: -18px;
              right: 38px;
              width: 0;
              height: 0;
              border-left: 16px solid transparent;
              border-right: 16px solid transparent;
              border-top: 18px solid #fff;
              filter: drop-shadow(0 2px 4px #1C2E4A22);
              z-index: 1;
              pointer-events: none;
            }
            .archived-speech-bubble-tail-border {
              position: absolute;
              bottom: -20px;
              right: 36px;
              width: 0;
              height: 0;
              border-left: 18px solid transparent;
              border-right: 18px solid transparent;
              border-top: 20px solid #1C2E4A;
              z-index: 0;
              pointer-events: none;
            }
            .archived-typed-text {
              display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              border-right: 2.5px solid #1C2E4A;
              animation: typing 2.2s steps(32, end), blink-caret 0.7s step-end infinite;
              font-family: inherit;
              font-size: inherit;
              font-weight: inherit;
              letter-spacing: 0.01em;
              min-width: 0;
            }
            @keyframes typing {
              from { width: 0 }
              to { width: 100% }
            }
            @keyframes blink-caret {
              from, to { border-color: transparent }
              50% { border-color: #1C2E4A; }
            }
            /* Improved filter dropdown styles */
            .filter-dropdown {
              position: absolute;
              top: 48px;
              right: 0;
              background: #fff;
              border-radius: 14px;
              box-shadow: 0 8px 32px rgba(44,62,80,0.18), 0 1.5px 8px #1C2E4A11;
              padding: 0.5em 0;
              min-width: 220px;
              z-index: 100;
              font-family: 'Roboto Mono', monospace;
              border: 1.5px solid #e3e8ee;
              animation: fadeIn 0.18s cubic-bezier(.4,2,.6,1);
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .filter-option {
              width: 100%;
              background: none;
              border: none;
              text-align: left;
              padding: 0.85em 1.5em;
              font-size: 1.08em;
              color: #22365a;
              cursor: pointer;
              transition: background 0.18s, color 0.18s;
              border-radius: 8px;
              font-family: inherit;
              font-weight: 500;
              outline: none;
            }
            .filter-option:hover,
            .filter-option:focus {
              background: #e8f0fe;
              color: #334E7B;
            }
            .filter-option.selected {
              background: #334E7B;
              color: #fff;
              font-weight: 700;
            }
          `}</style>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="archived-speech-bubble">
              <span className="archived-typed-text">Here are your archived cards!</span>
              <span className="archived-speech-bubble-tail" />
              <span className="archived-speech-bubble-tail-border" />
            </div>
            <img
              src={boyImg}
              alt="boy"
              style={{
                width: 90,
                height: 'auto',
                filter: 'drop-shadow(0 4px 16px rgba(44,62,80,0.18))',
                userSelect: 'none',
                pointerEvents: 'auto',
              }}
            />
          </div>
        </div>
        {/* End Floating Boy and Speech Bubble */}
        <div className="archived-content-box" style={{ position: 'relative', zIndex: 1 }}>
          {/* Back button and title */}
          <div className="archived-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className="archived-back-btn"
                title="Back"
                onClick={() => navigate(-1)}
              >
                <MdArrowBack color="#fff" />
              </button>
              <span style={{ color: '#FFF', fontFamily: 'Roboto Mono', fontWeight: "bold", fontSize: "1.5em", marginLeft: 12 }}>Archived Cards</span>
            </div>
            {/* Modern meatball icon button (for future menu/actions) */}
            
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
