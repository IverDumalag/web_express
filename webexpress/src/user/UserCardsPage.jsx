import React, { useState, useEffect } from "react";
import { FaFilter, FaStar, FaPlus } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import UserCards from '../components/UserCards';
import { getUserData } from '../data/UserData';
import MessagePopup from '../components/MessagePopup';
import { useNavigate } from "react-router-dom";
import UserBottomNavBar from '../components/UserBottomNavBar';
import boyImg from '../assets/boy.png';
import Snowfall from '../components/Snowfall';
import SL1 from "../assets/SL1.jpg";
import SL2 from "../assets/SL2.jpg";
import SL3 from "../assets/SL3.jpg";
import SL4 from "../assets/SL4.jpg";

const API_URL = import.meta.env.VITE_PHRASESWORDSBYIDGET;
const INSERT_API_URL = import.meta.env.VITE_PHRASESWORDSINSERT;
const TRYSEARCH_API_URL = import.meta.env.VITE_TRYSEARCH;
const UPDATE_STATUS_API_URL = import.meta.env.VITE_PHRASESWORDSSTATUSUPDATE;

export default function UserCardsPage() {
  const [activeTab, setActiveTab] = useState("wave");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  // Removed meatball menu
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
      if (!user_id) {
        showPopup("Unable to load your cards. Please try logging in again.", "error");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_URL}?user_id=${encodeURIComponent(user_id)}`, {
          timeout: 15000 // 15 second timeout
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const json = await res.json();
        setCards(Array.isArray(json.data) ? json.data.filter(card => card.status === "active") : []);
      } catch (e) {
        console.error('Error fetching cards:', e);
        setCards([]);
        
        let errorMessage = "We couldn't load your cards right now. Please try again.";
        if (e.message.includes('Failed to fetch') || !navigator.onLine) {
          errorMessage = "You appear to be offline. Please check your internet connection and try again.";
        } else if (e.message.includes('timeout')) {
          errorMessage = "Loading is taking longer than expected. Please check your internet connection and try again.";
        } else if (e.message.includes('500')) {
          errorMessage = "Our servers are temporarily unavailable. Please try again in a few moments.";
        }
        
        showPopup(errorMessage, "error");
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
    if (!addInput.trim()) {
      showPopup("Please enter a word or phrase to add.", "error");
      return;
    }
    
    const normalizedInput = normalize(addInput);
    const isDuplicate = cards.some(card => normalize(card.words) === normalizedInput);
    if (isDuplicate) {
      showPopup("This word or phrase is already in your collection.", "error");
      return;
    }
    
    setAddLoading(true);
    let sign_language_url = "";
    let is_match = 0;
    let matchFound = false;
    
    try {
      // Search for sign language match
      const searchRes = await fetch(`${TRYSEARCH_API_URL}?q=${encodeURIComponent(addInput)}`, {
        timeout: 15000 // 15 second timeout
      });
      
      if (!searchRes.ok) {
        console.warn('Search service unavailable, proceeding without sign language match');
      } else {
        const searchJson = await searchRes.json();
        if (searchJson?.public_id && Array.isArray(searchJson.all_files)) {
          const file = searchJson.all_files.find(f => f.public_id === searchJson.public_id);
          if (file) {
            sign_language_url = file.url;
            is_match = 1;
            matchFound = true;
          }
        }
      }
      
      // Add to user's collection
      const insertRes = await fetch(INSERT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, words: addInput, sign_language: sign_language_url, is_match }),
        timeout: 15000 // 15 second timeout
      });
      
      if (!insertRes.ok) {
        throw new Error(`HTTP ${insertRes.status}: ${insertRes.statusText}`);
      }
      
      const insertJson = await insertRes.json();
      if (insertJson.status === 201 || insertJson.status === "201") {
        setShowAddModal(false);
        setAddInput("");
        setReloadCards(prev => prev + 1);
        
        if (matchFound) {
          showPopup("Great! We found a sign language match for your word.", "success");
        } else {
          showPopup("Added to your collection. Sign language match will be added when available.", "info");
        }
      } else {
        let errorMessage = "We couldn't add your word right now. Please try again.";
        if (insertJson.message) {
          if (insertJson.message.includes('duplicate')) {
            errorMessage = "This word or phrase is already in your collection.";
          }
        }
        showPopup(errorMessage, "error");
      }
    } catch (e) {
      console.error('Error adding word:', e);
      let errorMessage = "We couldn't add your word right now. Please try again.";
      
      if (e.message.includes('Failed to fetch') || !navigator.onLine) {
        errorMessage = "You appear to be offline. Please check your internet connection and try again.";
      } else if (e.message.includes('timeout')) {
        errorMessage = "Adding is taking longer than expected. Please check your internet connection and try again.";
      } else if (e.message.includes('500')) {
        errorMessage = "Our servers are temporarily unavailable. Please try again in a few moments.";
      }
      
      showPopup(errorMessage, "error");
    }
    setAddLoading(false);
  };
  // Show the boy and speech bubble for a longer period (e.g., 10 seconds)
  const [showBoyBubble, setShowBoyBubble] = useState(true);
  useEffect(() => {
    if (!showBoyBubble) return;
    const timer = setTimeout(() => setShowBoyBubble(false), 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, [showBoyBubble]);

  // Speech bubble message for this page
  const boyBubbleMessage = "welcome, these are your cards";

return (
  <div style={{ minHeight: '100vh', background: '#fff' }}>
    <UserBottomNavBar />
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2vw' }}>
      <div style={{
        width: '100%',
        overflow: 'hidden',
        marginBottom: '1vw',
        position: 'relative',
      }}>
      </div>


{/* ✅ Floating animation keyframes */}
<style>
  {`
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0px); }
    }
  `}
</style>

<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)', // 4 images in a row
  gap: '8em',
  marginTop: '2em',
  marginBottom: '2em',
  marginRight: '5em',
}}>
  {/* Image 1 */}
  <img 
    src={SL1}
    style={{ 
      width: '150%', 
      height: '320px',   // ✅ expanded height
      objectFit: 'cover', 
      borderRadius: '12px',
      animation: 'float 3s ease-in-out infinite'
    }} 
  />

  {/* Image 2 */}
  <img 
    src={SL2}
    style={{ 
      width: '150%', 
      height: '320px',
      objectFit: 'cover', 
      borderRadius: '12px',
      animation: 'float 3s ease-in-out infinite'
    }} 
  />

  {/* Image 3 */}
  <img 
    src={SL3}
    style={{ 
      width: '150%', 
      height: '320px',
      objectFit: 'cover', 
      borderRadius: '12px',
      animation: 'float 3s ease-in-out infinite'
    }} 
  />

  {/* Image 4 */}
  <img 
    src={SL4}
    style={{ 
      width: '150%', 
      height: '320px',
      objectFit: 'cover', 
      borderRadius: '12px',
      animation: 'float 3s ease-in-out infinite'
    }} 
  />
</div>


{/* ✅ Centered text (now below containers) */}
<div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
  <div style={{
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    fontSize: '3.2em',
    color: '#22223b',
    letterSpacing: '0.04em',
    marginBottom: '0.5em',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '1.2em',
  }}>
    <span>Ready to Sign?</span>
  </div>
  <div style={{
    fontFamily: 'Roboto Mono, monospace',
    fontSize: '1.25em',
    color: '#22365a',
    textAlign: 'center',
    marginBottom: '1.5em'
  }}>
    Get more cards for enhancement of your Sign Language!
  </div>
</div>

    
        <div style={{margin: '3vw 0 2vw 0'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5vw', marginBottom: '1.5vw', marginLeft: '44vw'}}>
            <div style={{fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '2em', color: '#1e1f23ff', letterSpacing: '0.02em'}}>
               <span style={{fontSize: '0.8em', verticalAlign: 'middle'}}></span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1vw'}}>
              <div style={{ position: 'relative', marginRight: '0.3vw', minWidth: 220, maxWidth: 420, width: '100%' }}>
                <span style={{
                  position: 'absolute',
                  left: '0.8em',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#bfc9d1',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.25em',
                  zIndex: 2,
                }}>
                  <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input className="search-input" style={{
                  width: '100%',
                  padding: '0.9em 2.9em 0.6em 3.4em',
                  borderRadius: '5px',
                  border: '1.5px solid #1C2E4A',
                  background: 'rgba(255,255,255,0.7)',
                  fontFamily: 'Roboto Mono, sans-serif',
                  fontSize: '1.0em',
                  color: '#22365a',
                  boxShadow: '0 2px 4px #2221',
                  outline: 'none',
                  marginLeft: 0,
                  marginTop: 0,
                  maxWidth: 420,
                  marginRight: '0.2vw',
                }} placeholder="" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="filter-icon-btn" title="Sort" onClick={() => setShowFilter(v => !v)} style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                fontSize: '2em',
                cursor: 'pointer',
                padding: '0.2em 0.4em',
                borderRadius: '50%',
                boxShadow: 'none',
                transition: 'background 0.18s, color 0.18s',
                marginLeft: 8,
                marginTop: 2,
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <FaFilter style={{ color: '#334E7B', fontSize: '0.95em', verticalAlign: 'middle' }} />
                {showFilter && (
                  <div className="filter-dropdown">
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        className={`filter-option${sortBy === opt.value ? ' selected' : ''}`}
                        onClick={() => { setSortBy(opt.value); setShowFilter(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </button>
      {/* Modern filter dropdown styles for filter-dropdown and filter-option, plus responsive styles */}
      <style>{`
        .filter-dropdown {
          position: absolute;
          top: 110%;
          right: 0;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(44,62,80,0.18), 0 1.5px 8px #1C2E4A11;
          padding: 0.5em 0;
          min-width: 360px;
          max-width: 500px;
          z-index: 100;
          font-family: 'Roboto Mono', monospace;
          border: 1px solid #1C2E4A;
          animation: fadeIn 0.18s cubic-bezier(.4,2,.6,1);
          word-break: break-word;
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
          font-size: 0.75em;
          color: #22365a;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          border-radius: 8px;
          font-family: inherit;
          font-weight: 500;
          outline: none;
          white-space: normal;
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

        /* Responsive styles for UserCardsPage */
        @media (max-width: 900px) {
          .card-list {
            grid-template-columns: 1fr !important;
            gap: 4vw !important;
            margin-left: 0 !important;
          }
          .search-main-container {
            padding: 0 2vw !important;
          }
          .tab-row {
            margin-left: 0 !important;
            flex-direction: column !important;
            gap: 0.7em !important;
            align-items: stretch !important;
          }
          .filter-dropdown, .meatball-dropdown {
            min-width: 90vw !important;
            max-width: 98vw !important;
            right: 0 !important;
            left: 0 !important;
            margin: 0 auto !important;
          }
        }
        @media (max-width: 600px) {
          .card-list {
            grid-template-columns: 1fr !important;
            gap: 6vw !important;
          }
          .add-modal {
            padding: 1.2em 0.7em 1em 0.7em !important;
            max-width: 98vw !important;
          }
          .speech-bubble {
            min-width: 120px !important;
            max-width: 90vw !important;
            font-size: 0.95em !important;
            padding: 0.7em 0.7em 0.7em 0.7em !important;
          }
          .speech-bubble-tail, .speech-bubble-tail-border {
            right: 10px !important;
          }
        }
      `}</style>
              <button
                className="add-word-btn"
                title="Add Word/Phrase"
                onClick={() => setShowAddModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  fontSize: '2em',
                  cursor: 'pointer',
                  padding: '0.2em 0.4em',
                  borderRadius: '50%',
                  boxShadow: 'none',
                  transition: 'background 0.18s, color 0.18s',
                  marginLeft: 8,
                  marginTop: 2,
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaPlus style={{ color: '#334E7B', fontSize: '0.95em', verticalAlign: 'middle' }} />
              </button>
            </div>
          </div>
          {/* Search bar and actions row */}
          <div className="search-main-container">
            <div className="tab-row" style={{ marginLeft: '-4vw', display: 'flex', gap: '1em', marginBottom: '1.5em' }}>
              <button
                className={`tab-btn${activeTab === "wave" ? " active" : ""}`}
                onClick={() => setActiveTab("wave")}
                title="Your cards"
                style={{
                  background: activeTab === "wave" ? '#1C2E4A' : '#52677D',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 6,
                  padding: '0.7em 2.0em',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                  opacity: activeTab === "wave" ? 1 : 0.85,
                  boxShadow: activeTab === "wave"
                    ? '0 2px 12px 0 rgba(37,99,235,0.20), 0 1.5px 6px 0 rgba(44,62,80,0.10)'
                    : '0 1.5px 6px 0 rgba(44,62,80,0.10)',
                  outline: 'none',
                }}
              >
                <MdOutlineWavingHand style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} />
                Your cards
              </button>
              <button
                className={`tab-btn${activeTab === "favorite" ? " active" : ""}`}
                onClick={() => setActiveTab("favorite")}
                title="Favorite"
                style={{
                  background: activeTab === "favorite" ? '#1C2E4A' : '#52677D',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 6,
                  padding: '0.7em 0.8em',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                  opacity: activeTab === "favorite" ? 1 : 0.85,
                  boxShadow: activeTab === "favorite"
                    ? '0 2px 12px 0 rgba(37,99,235,0.20), 0 1.5px 6px 0 rgba(44,62,80,0.10)'
                    : '0 1.5px 6px 0 rgba(44,62,80,0.10)',
                  outline: 'none',
                }}
              >
                <FaStar style={{ marginRight: 8, fontSize: '1.1em', verticalAlign: 'middle' }} />
                Favorited Cards
              </button>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1vw', flexWrap: 'wrap'}}>
              <div style={{flex: 1, minWidth: 220, maxWidth: 420, position: 'relative', display: 'flex', justifyContent: 'flex-start', marginLeft: '2vw'}}>
                <span style={{
                  position: 'absolute',
                  left: '0.8em',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#bfc9d1',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.25em',
                  zIndex: 2,
                }}>
                  
                </span>
                
              </div>
            </div>
          </div>
        </div>
        {/* End reference layout section */}

        <div className="search-main-container">
          {loading ? (
            <div style={{ textAlign: "center", color: "#aaa", marginTop: "4vw" }}>Loading...</div>
          ) : (
            <div className="card-grid-container">
              <div className="card-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2vw', marginTop: '2vw', marginBottom: '2vw', justifyContent: 'center' }}>
                <UserCards cards={filteredCards} onCardUpdated={handleCardUpdated} />
              </div>
            </div>
          )}
        </div>
      
      </div>
      {showAddModal && (
        <div className="add-modal-overlay" style={{
          position: 'fixed',
          zIndex: 3002,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <form className="add-modal" onSubmit={e => { e.preventDefault(); handleAddWord(); }} style={{
            borderRadius: 20,
            border: '2px solid #334E7B',
            background: '#fff',
            width: '95%',
            maxWidth: 440,
            padding: '2.5em 2.5em 2em',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            color: '#334E7B',
            fontFamily: 'Roboto Mono, monospace',
            alignItems: 'stretch',
            gap: '0.7em',
            position: 'relative',
          }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 22,
                background: 'none',
                border: 'none',
                fontSize: '1.5em',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontWeight: 700,
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace' }}>Add Word/Phrase</div>
            <input
              className="add-modal-input"
              type="text"
              value={addInput}
              onChange={e => setAddInput(e.target.value)}
              placeholder="Enter word or phrase"
              disabled={addLoading}
              autoFocus
              style={{
                background: '#fff',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '1.1em',
                border: '2px solid #334E7B',
                borderRadius: 8,
                padding: '0.6em 1em',
                marginBottom: 8,
                fontFamily: 'Inconsolata, monospace',
                outline: 'none',
                boxSizing: 'border-box',
                userSelect: 'all',
                MozUserSelect: 'all',
                WebkitUserSelect: 'all',
                msUserSelect: 'all',
              }}
            />
            <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
              <button
                className="add-modal-btn"
                type="submit"
                disabled={addLoading || !addInput.trim()}
                style={{
                  flex: 1,
                  background: '#1C2E4A',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 12,
                  padding: '0.7em 0',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: addLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  opacity: addLoading ? 0.7 : 1,
                }}
              >
                {addLoading ? "Adding..." : "Add"}
              </button>
              <button
                className="add-modal-btn cancel"
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={addLoading}
                style={{
                  flex: 1,
                  background: '#52677D',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 12,
                  padding: '0.7em 0',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: addLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  opacity: addLoading ? 0.7 : 1,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
          <MessagePopup open={popup.open} title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"} description={popup.message} onClose={() => setPopup(p => ({ ...p, open: false }))} style={{ zIndex: 3000 }} />
        </div>
      )}
      {!showAddModal && (
        <MessagePopup open={popup.open} title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"} description={popup.message} onClose={() => setPopup(p => ({ ...p, open: false }))} />
      )}
      {showBoyBubble && (
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
            .speech-bubble {
              position: absolute;
              bottom: 130px;
              right: -5.9px;
              background: rgba(255,255,255,0.97);
              color: #1C2E4A;
              border-radius: 18px;
              box-shadow: 0 2px 12px #1C2E4A22;
              padding: 0.9em 1.2em 0.9em 1.2em;
              font-family: 'Roboto Mono', monospace;
              font-weight: 600;
              font-size: 1.08em;
              white-space: normal;
              word-break: break-word;
              pointer-events: auto;
              border: 1.5px solid #1C2E4A;
              min-width: 120px;
              max-width: 500;
              text-align: center;
              z-index: 2;
              line-height: 1.4;
            }
            .speech-bubble-tail {
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
            .speech-bubble-tail-border {
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
            .typed-text {
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
          `}</style>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="speech-bubble">
              <span className="typed-text">{boyBubbleMessage}</span>
              <span className="speech-bubble-tail" />
              <span className="speech-bubble-tail-border" />
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
      )}
    </div>
  );
}
