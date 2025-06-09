import React, { useState, useEffect } from "react";
import { FaFilter, FaTrash } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { getUserData } from '../data/UserData';
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/ConfirmationPopup";
import MessagePopup from "../components/MessagePopup";
import '../CSS/UserArchived.css';

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
        <div className="archived-content-box" style={{ position: 'relative', zIndex: 1 }}>
          {/* Back button and title */}
          <div className="archived-header-row">
            <button
              className="archived-back-btn"
              title="Back"
              onClick={() => navigate(-1)}
            >
              <MdArrowBack />
            </button>
            <span style={{ color: '#fff', fontFamily:'Roboto Mono',fontWeight: "bold", fontSize: "1.6em" }}>Archived Cards</span>
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