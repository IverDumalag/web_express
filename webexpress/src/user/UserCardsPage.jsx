import React, { useState, useEffect } from "react";
import { FaFilter, FaStar } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserCards from '../components/UserCards';
import { getUserData } from '../data/UserData';
import MessagePopup from '../components/MessagePopup';
import { useNavigate } from "react-router-dom";
import UserBottomNavBar from '../components/UserBottomNavBar';
import boyImg from '../assets/boy.png';


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
          <div style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: 'crawl-left 18s linear infinite',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '1.25em',
            color: '#22365a',
            letterSpacing: '0.04em',
            padding: '0.5em 0',
          }}>
            Welcome to the Sign Language Cards Section! &nbsp;|&nbsp; Practice, learn, and grow your skills every day! &nbsp;|&nbsp; Add new words and phrases to expand your vocabulary!
          </div>
          <style>{`
            @keyframes crawl-left {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </div>
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
        {/* Reference layout below the SIGN LANGUAGE CARDS flex container */}
        <div style={{margin: '3vw 0 2vw 0'}}>
          {/* Headings stacked vertically and action buttons row */}
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2vw', marginBottom: '1.5vw'}}>
            <div style={{fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '2em', color: '#22365a', letterSpacing: '0.02em'}}>
               <span style={{fontSize: '0.8em', verticalAlign: 'middle'}}></span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1vw'}}>
              <button className="filter-icon-btn" title="Sort" onClick={() => setShowFilter(v => !v)}>
                <FaFilter />
                {showFilter && (
                  <div className="filter-dropdown" style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#fff',
                    borderRadius: 10,
                    boxShadow: '0 4px 16px #2223',
                    zIndex: 12,
                    minWidth: 180,
                    padding: '0.5em 0',
                    border: '1px solid #e5e5e5',
                    transition: 'opacity 0.18s',
                  }}>
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        className={`filter-option${sortBy === opt.value ? ' selected' : ''}`}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          padding: '0.7em 1.2em',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '1em',
                          color: '#22365a',
                          cursor: 'pointer',
                          fontWeight: sortBy === opt.value ? 700 : 400,
                          backgroundColor: sortBy === opt.value ? '#e6eaf1' : 'transparent',
                          borderRadius: 8,
                          transition: 'background 0.15s',
                        }}
                        onClick={() => { setSortBy(opt.value); setShowFilter(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </button>
              <div style={{ position: 'relative' }}>
                <button className="meatball-icon-btn" title="Menu" onClick={() => { setShowMeatball(v => !v); setShowFilter(false); }}><BsThreeDotsVertical /></button>
                {showMeatball && (
                  <div className="meatball-dropdown" style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#fff',
                    borderRadius: 10,
                    boxShadow: '0 4px 16px #2223',
                    zIndex: 12,
                    minWidth: 150,
                    padding: '0.5em 0',
                    border: '1px solid #e5e5e5',
                    transition: 'opacity 0.18s',
                  }}>
                    <button className="meatball-option" style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '0.7em 1.2em',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '1em',
                      color: '#22365a',
                      cursor: 'pointer',
                      borderRadius: 8,
                      transition: 'background 0.15s',
                    }} onClick={() => { setShowMeatball(false); navigate("/userarchived"); }}>Archive</button>
                    <button className="meatball-option" style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '0.7em 1.2em',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '1em',
                      color: '#22365a',
                      cursor: 'pointer',
                      borderRadius: 8,
                      transition: 'background 0.15s',
                    }} onClick={() => { setShowMeatball(false); setShowAddModal(true); }}>Add Word/Phrases</button>
                  </div>
                )}
              </div>
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
                  padding: '0.7em 3.0em',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                  opacity: activeTab === "wave" ? 1 : 0.85,
                  boxShadow: activeTab === "wave" ? '0 2px 12px #2563eb33' : 'none',
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
                  padding: '0.7em 2.0em',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                  opacity: activeTab === "favorite" ? 1 : 0.85,
                  boxShadow: activeTab === "favorite" ? '0 2px 12px #2563eb33' : 'none',
                  outline: 'none',
                }}
              >
                <FaStar style={{ marginRight: 8, fontSize: '1.1em', verticalAlign: 'middle' }} />
                Favorited Cards
              </button>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1vw', flexWrap: 'wrap'}}>
              <div style={{flex: 1, minWidth: 220, maxWidth: 420, position: 'relative', display: 'flex', justifyContent: 'flex-start', marginLeft: '-4vw'}}>
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
                  padding: '0.9em 2.9em 0.6em 3.4em', // left padding for icon
                  borderRadius: '5px',
                  border: '1.5px solid #bfc9d1',
                  background: 'rgba(255,255,255,0.7)',
                  fontFamily: 'Roboto Mono, sans-serif',
                  fontSize: '1.0em',
                  color: '#22365a',
                  boxShadow: '0 2px 4px #2221',
                  outline: 'none',
                  marginLeft: 0,
                  marginTop: 0,
                  maxWidth: 420,
                }} placeholder="" value={search} onChange={e => setSearch(e.target.value)} />
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
              <div className="card-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2vw', marginTop: '2vw', marginBottom: '2vw', marginLeft: '-4vw' }}>
                <UserCards cards={filteredCards} onCardUpdated={handleCardUpdated} />
              </div>
            </div>
          )}
        </div>
        {/* Show sort filter dropdown with sortOptions */}
        {/* Removed the Sort Options button as requested */}
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
            background: '#2B4066',
            borderRadius: '2.2em',
            boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
            width: '95%',
            maxWidth: 440,
            padding: '2.5em 2.5em 2em 2.5em',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            color: '#fff',
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
                background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: 'none', borderRadius: 8, padding: '0.6em 1em', marginBottom: 8, fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box',
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
              bottom: 120px;
              right: -9.9px;
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
