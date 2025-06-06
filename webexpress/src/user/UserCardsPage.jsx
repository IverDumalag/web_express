import React, { useState, useEffect } from "react";
import { FaFilter, FaStar } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserCards from '../components/UserCards';
import { getUserData } from '../data/UserData';
import MessagePopup from '../components/MessagePopup';
import { useNavigate } from "react-router-dom";
import UserBottomNavBar from '../components/UserBottomNavBar';

const API_URL = import.meta.env.VITE_PHRASESWORDSBYIDGET;
const INSERT_API_URL = import.meta.env.VITE_PHRASESWORDSINSERT;
const TRYSEARCH_API_URL = import.meta.env.VITE_TRYSEARCH;
const UPDATE_STATUS_API_URL = import.meta.env.VITE_PHRASESWORDSSTATUSUPDATE;

export default function UserCardsPage() {
  const [activeTab, setActiveTab] = useState("wave");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showMeatball, setShowMeatball] = useState(false);
  const [sortBy, setSortBy] = useState("date-new");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadCards, setReloadCards] = useState(0);
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, message: "", type: "info" });
  const showPopup = (message, type = "info", timeout = 5000) => {
    setPopup({ open: true, message, type });
    setTimeout(() => setPopup(p => ({ ...p, open: false })), timeout);
  };
  const userData = getUserData();
  const user_id = userData?.user_id || "";
  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}?user_id=${encodeURIComponent(user_id)}`);
        const json = await res.json();
        setCards(Array.isArray(json.data) ? json.data.filter(card => card.status === "active") : []);
      } catch (e) {
        setCards([]);
      }
      setLoading(false);
    }
    if (user_id) fetchCards();
  }, [user_id, reloadCards]);
  const handleCardUpdated = (updatedCard) => {
    setCards(prevCards => {
      if (updatedCard.status === "archived") {
        return prevCards.filter(card => card.entry_id !== updatedCard.entry_id);
      } else {
        return prevCards.map(card => card.entry_id === updatedCard.entry_id ? { ...card, ...updatedCard } : card);
      }
    });
  };
  const getCardString = (card) => (card.words || card.wordsphrases || card.title || "").toString();
  let filteredCards = cards;
  if (activeTab === "favorite") {
    filteredCards = filteredCards.filter(card => card.is_favorite === 1);
  }
  if (search.trim() !== "") {
    filteredCards = filteredCards.filter(card => getCardString(card).toLowerCase().includes(search.toLowerCase()));
  }
  function naturalCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }
  if (sortBy === "alpha") {
    filteredCards = [...filteredCards].sort((a, b) => naturalCompare(getCardString(a), getCardString(b)));
  } else if (sortBy === "alpha-rev") {
    filteredCards = [...filteredCards].sort((a, b) => naturalCompare(getCardString(b), getCardString(a)));
  } else if (sortBy === "date-new") {
    filteredCards = [...filteredCards].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortBy === "date-old") {
    filteredCards = [...filteredCards].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortBy === "clear-filter") {
    filteredCards = [...filteredCards];
  }
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.filter-icon-btn') && !e.target.closest('.filter-dropdown')) {
        setShowFilter(false);
      }
      if (!e.target.closest('.meatball-icon-btn') && !e.target.closest('.meatball-dropdown')) {
        setShowMeatball(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const sortOptions = [
    { label: "Clear Filter", value: "clear-filter" },
    { label: "Alphabetically (A-Z)", value: "alpha" },
    { label: "Alphabetically (Z-A)", value: "alpha-rev" },
    { label: "Date (Newest)", value: "date-new" },
    { label: "Date (Oldest)", value: "date-old" },
  ];
  const normalize = str => (str || "").replace(/'/g, "").trim().toLowerCase();
  const handleAddWord = async () => {
    if (!addInput.trim()) return;
    const normalizedInput = normalize(addInput);
    const isDuplicate = cards.some(card => normalize(card.words) === normalizedInput);
    if (isDuplicate) {
      showPopup("Duplicate entry not allowed.", "error");
      return;
    }
    setAddLoading(true);
    let sign_language_url = "";
    let is_match = 0;
    let matchFound = false;
    try {
      const searchRes = await fetch(`${TRYSEARCH_API_URL}?q=${encodeURIComponent(addInput)}`);
      const searchJson = await searchRes.json();
      if (searchJson?.public_id && Array.isArray(searchJson.all_files)) {
        const file = searchJson.all_files.find(f => f.public_id === searchJson.public_id);
        if (file) {
          sign_language_url = file.url;
          is_match = 1;
          matchFound = true;
        }
      }
      const insertRes = await fetch(INSERT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, words: addInput, sign_language: sign_language_url, is_match })
      });
      const insertJson = await insertRes.json();
      if (insertJson.status === 201 || insertJson.status === "201") {
        setShowAddModal(false);
        setAddInput("");
        setReloadCards(prev => prev + 1); // Always reload cards from backend after add
        if (matchFound) {
          showPopup("Match Found!", "success");
        } else {
          showPopup("No match found, but added to your list.", "info");
        }
      } else {
        showPopup("Failed to add.", "error");
      }
    } catch (e) {
      showPopup("Error adding word/phrase.", "error");
    }
    setAddLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <UserBottomNavBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2vw' }}>
        <div style={{
          background: '#97A7B6',
          borderRadius: '28px',
          margin: '2vw 0 3vw 0',
          padding: '3vw 2vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '3.2em', color: '#22223b', letterSpacing: '0.04em', marginBottom: '0.5em', textAlign: 'center' }}>
            SIGN LANGUAGE CARDS
          </div>
          <div style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '1.35em', color: '#22365a', textAlign: 'center', marginBottom: '0.5em' }}>
            Get more cards for enhancement of your Sign Language!
          </div>
        </div>
        <div className="search-main-container">
          <div className="search-bar-row">
            <input className="search-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="filter-icon-btn" title="Sort" onClick={() => { setShowFilter(v => !v); setShowMeatball(false); }}><FaFilter /></button>
            {showFilter && (
              <div className="filter-dropdown">
                {sortOptions.map(opt => (
                  <button key={opt.value} className={`filter-option${sortBy === opt.value ? " selected" : ""}`} onClick={() => { setSortBy(opt.value); setShowFilter(false); }}>{opt.label}</button>
                ))}
              </div>
            )}
            <button className="meatball-icon-btn" title="Menu" onClick={() => { setShowMeatball(v => !v); setShowFilter(false); }}><BsThreeDotsVertical /></button>
            {showMeatball && (
              <div className="meatball-dropdown">
                <button className="meatball-option" onClick={() => { setShowMeatball(false); navigate("/userarchived"); }}>Archive</button>
                <button className="meatball-option" onClick={() => { setShowMeatball(false); setShowAddModal(true); }}>Add Word/Phrases</button>
              </div>
            )}
          </div>
          <div className="tab-row">
            <button className={`tab-btn${activeTab === "wave" ? " active" : ""}`} onClick={() => setActiveTab("wave")} title="Your cards"><MdOutlineWavingHand /></button>
            <button className={`tab-btn${activeTab === "favorite" ? " active" : ""}`} onClick={() => setActiveTab("favorite")} title="Favorite"><FaStar /></button>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", color: "#aaa", marginTop: "4vw" }}>Loading...</div>
          ) : (
            <div className="card-grid-container">
              <UserCards cards={filteredCards} onCardUpdated={handleCardUpdated} />
            </div>
          )}
        </div>
      </div>
      {showAddModal && (
        <div className="add-modal-overlay">
          <div className="add-modal">
            <h3>Add Word/Phrase</h3>
            <input className="add-modal-input" type="text" value={addInput} onChange={e => setAddInput(e.target.value)} placeholder="Enter word or phrase" disabled={addLoading} autoFocus />
            <div className="add-modal-actions">
              <button className="add-modal-btn" onClick={handleAddWord} disabled={addLoading || !addInput.trim()}>{addLoading ? "Adding..." : "Add"}</button>
              <button className="add-modal-btn cancel" onClick={() => setShowAddModal(false)} disabled={addLoading}>Cancel</button>
            </div>
          </div>
          <MessagePopup open={popup.open} title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"} description={popup.message} onClose={() => setPopup(p => ({ ...p, open: false }))} style={{ zIndex: 3000 }} />
        </div>
      )}
      {!showAddModal && (
        <MessagePopup open={popup.open} title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"} description={popup.message} onClose={() => setPopup(p => ({ ...p, open: false }))} />
      )}
    </div>
  );
}
