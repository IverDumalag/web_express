import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaStar, FaPlus, FaArrowLeft, FaArrowRight, FaHandPaper } from "react-icons/fa";
import { MdOutlineWavingHand, MdCategory, MdRestaurant, MdLocalDrink, MdPalette, MdCalendarToday, MdToday, MdPeople, MdHelp, MdNumbers, MdFamilyRestroom } from "react-icons/md";
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
  const [sortBy, setSortBy] = useState("date-new");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadCards, setReloadCards] = useState(0);
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [addInputError, setAddInputError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const addInputRef = useRef(null);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showWordModal, setShowWordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWord, setSelectedWord] = useState("");
  const [categorizedWords, setCategorizedWords] = useState({});

  const [popup, setPopup] = useState({ open: false, message: "", type: "info" });
  const showPopup = (message, type = "info", timeout = 5000) => {
    setPopup({ open: true, message, type });
    setTimeout(() => setPopup(p => ({ ...p, open: false })), timeout);
  };

  const userData = getUserData();
  const user_id = userData?.user_id || "";

  const categoryData = {
    "GREETING": ["GOOD MORNING", "GOOD AFTERNOON", "GOOD EVENING", "HELLO", "HOW ARE YOU", "IM FINE", "NICE TO MEET YOU", "THANK YOU", "YOURE WELCOME", "SEE YOU TOMORROW"],
    "SURVIVAL": ["UNDERSTAND", "DON'T UNDERSTAND", "KNOW", "DON'T KNOW", "NO", "YES", "WRONG", "CORRECT", "SLOW", "FAST"],
    "NUMBER": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    "CALENDAR": ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
    "DAYS": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "TODAY", "TOMORROW", "YESTERDAY"],
    "FAMILY": ["FATHER", "MOTHER", "SON", "DAUGHTER", "GRANDFATHER", "GRANDMOTHER", "UNCLE", "AUNTIE", "COUSIN", "PARENTS"],
    "RELATIONSHIPS": ["BOY", "GIRL", "MAN", "WOMAN", "DEAF", "HARD OF HEARING", "WEELCHAIR PERSON", "BLIND", "DEAF BLIND", "MARRIED"],
    "COLOR": ["BLUE", "GREEN", "RED", "BROWN", "BLACK", "WHITE", "YELLOW", "ORANGE", "GRAY", "PINK", "VIOLET", "LIGHT", "DARK"],
    "FOOD": ["BREAD", "EGG", "FISH", "MEAT", "CHICKEN", "SPAGHETTI", "RICE", "LONGANISA", "SHRIMP", "CRAB"],
    "DRINK": ["HOT", "COLD", "JUICE", "MILK", "COFFEE", "TEA", "BEER", "WINE", "SUGAR", "NO SUGAR"],
  };

  useEffect(() => { setCategorizedWords(categoryData); }, []);

  const getCategoryIcon = (category) => {
    const iconMap = {
      "GREETING": MdOutlineWavingHand, "NUMBER": MdNumbers, "FAMILY": MdFamilyRestroom,
      "COLOR": MdPalette, "FOOD": MdRestaurant, "DRINK": MdLocalDrink,
      "CALENDAR": MdCalendarToday, "DAYS": MdToday, "RELATIONSHIPS": MdPeople, "SURVIVAL": MdHelp,
    };
    return iconMap[category] || MdCategory;
  };

  const formatCategoryName = (category) => {
    const nameMap = {
      "GREETING": "Greetings", "NUMBER": "Numbers", "FAMILY": "Family",
      "COLOR": "Colors", "FOOD": "Food", "DRINK": "Drinks",
      "CALENDAR": "Calendar", "DAYS": "Days", "RELATIONSHIPS": "Relationships", "SURVIVAL": "Survival",
    };
    return nameMap[category] || category;
  };

  useEffect(() => { console.log("addInputError changed:", addInputError); }, [addInputError]);

  useEffect(() => {
    async function fetchCards() {
      if (!user_id) { showPopup("Unable to load your cards. Please try logging in again.", "error"); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}?user_id=${encodeURIComponent(user_id)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const json = await res.json();
        setCards(Array.isArray(json.data) ? json.data.filter(card => card.status === "active") : []);
      } catch (e) {
        console.error('Error fetching cards:', e);
        setCards([]);
        let errorMessage = "We couldn't load your cards right now. Please try again.";
        if (e.message.includes('Failed to fetch') || !navigator.onLine) errorMessage = "You appear to be offline. Please check your internet connection and try again.";
        else if (e.message.includes('500')) errorMessage = "Our servers are temporarily unavailable. Please try again in a few moments.";
        showPopup(errorMessage, "error");
      }
      setLoading(false);
    }
    if (user_id) fetchCards();
  }, [user_id, reloadCards]);

  const handleCardUpdated = (updatedCard) => {
    setCards(prevCards => {
      if (updatedCard.status === "archived") return prevCards.filter(card => card.entry_id !== updatedCard.entry_id);
      return prevCards.map(card => card.entry_id === updatedCard.entry_id ? { ...card, ...updatedCard } : card);
    });
  };

  const getCardString = (card) => (card.words || card.wordsphrases || card.title || "").toString();

  let filteredCards = cards;
  if (activeTab === "favorite") filteredCards = filteredCards.filter(card => card.is_favorite === 1);
  if (search.trim() !== "") filteredCards = filteredCards.filter(card => getCardString(card).toLowerCase().includes(search.toLowerCase()));

  function naturalCompare(a, b) { return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }); }

  if (sortBy === "alpha") filteredCards = [...filteredCards].sort((a, b) => naturalCompare(getCardString(a), getCardString(b)));
  else if (sortBy === "alpha-rev") filteredCards = [...filteredCards].sort((a, b) => naturalCompare(getCardString(b), getCardString(a)));
  else if (sortBy === "date-new") filteredCards = [...filteredCards].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  else if (sortBy === "date-old") filteredCards = [...filteredCards].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.filter-icon-btn') && !e.target.closest('.filter-dropdown')) setShowFilter(false);
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

  const normalize = (str) => (str || "").replace(/'/g, "").trim().toLowerCase();

  const handleCategorySelect = (category) => { setSelectedCategory(category); setShowCategoryModal(false); setShowWordModal(true); };
  const handleWordSelect = (word) => { setSelectedWord(word); setShowWordModal(false); setShowConfirmModal(true); };
  const handleBackToCategories = () => { setShowWordModal(false); setShowCategoryModal(true); };

  const handleConfirmAddWord = async () => {
    if (!selectedWord) return;
    setAddLoading(true);
    const trimmed = selectedWord.trim();
    const normalized = normalize(trimmed);
    const isDuplicate = cards.some(card => normalize(card?.words ?? card?.wordsphrases ?? card?.title ?? "") === normalized);
    if (isDuplicate) { showPopup("This word or phrase is already in your collection.", "error"); setAddLoading(false); return; }
    let sign_language_url = "", is_match = 0, matchFound = false;
    try {
      const searchRes = await fetch(`${TRYSEARCH_API_URL}?q=${encodeURIComponent(trimmed)}`);
      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        if (searchJson?.public_id && Array.isArray(searchJson.all_files)) {
          const file = searchJson.all_files.find(f => f.public_id === searchJson.public_id);
          if (file) { sign_language_url = file.url; is_match = 1; matchFound = true; }
        }
      }
      const insertRes = await fetch(INSERT_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id, words: trimmed, sign_language: sign_language_url, is_match }) });
      if (!insertRes.ok) throw new Error(`HTTP ${insertRes.status}: ${insertRes.statusText}`);
      const insertJson = await insertRes.json();
      if (insertJson.status === 201 || insertJson.status === "201") {
        setShowConfirmModal(false); setShowWordModal(false); setShowCategoryModal(false);
        setSelectedCategory(""); setSelectedWord(""); setReloadCards(prev => prev + 1);
        showPopup(matchFound ? "Great! We found a sign language match for your word." : "Added to your collection. Sign language match will be added when available.", matchFound ? "success" : "info");
      } else {
        showPopup("We couldn't add your word right now. Please try again.", "error");
      }
    } catch (e) {
      console.error('Error adding word from category:', e);
      showPopup("We couldn't add your word right now. Please try again.", "error");
    }
    setAddLoading(false);
  };

  const handleCancelCategorySelection = () => { setShowCategoryModal(false); setSelectedCategory(""); };
  const handleCancelWordSelection = () => { setShowWordModal(false); setSelectedWord(""); };
  const handleCancelConfirmation = () => { setShowConfirmModal(false); setSelectedWord(""); };

  const handleAddWord = async () => {
    const trimmed = addInput.trim();
    if (!trimmed) { setAddInputError("Please enter a word or phrase"); addInputRef.current?.focus(); return; }
    setAddInputError("");
    const normalizedInput = normalize(trimmed);
    const isDuplicate = cards.some(card => normalize(card?.words ?? card?.wordsphrases ?? card?.title ?? "") === normalizedInput);
    if (isDuplicate) { setAddInputError("This word or phrase is already in your collection"); addInputRef.current?.focus(); return; }
    setAddLoading(true);
    let sign_language_url = "", is_match = 0, matchFound = false;
    try {
      const searchRes = await fetch(`${TRYSEARCH_API_URL}?q=${encodeURIComponent(trimmed)}`);
      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        if (searchJson?.public_id && Array.isArray(searchJson.all_files)) {
          const file = searchJson.all_files.find(f => f.public_id === searchJson.public_id);
          if (file) { sign_language_url = file.url; is_match = 1; matchFound = true; }
        }
      }
      const insertRes = await fetch(INSERT_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id, words: trimmed, sign_language: sign_language_url, is_match }) });
      if (!insertRes.ok) throw new Error(`HTTP ${insertRes.status}: ${insertRes.statusText}`);
      const insertJson = await insertRes.json();
      if (insertJson.status === 201 || insertJson.status === "201") {
        setShowAddModal(false); setAddInput(""); setAddInputError(""); setReloadCards(prev => prev + 1);
        showPopup(matchFound ? "Great! We found a sign language match for your word." : "Added to your collection. Sign language match will be added when available.", matchFound ? "success" : "info");
      } else {
        showPopup("We couldn't add your word right now. Please try again.", "error");
      }
    } catch (e) {
      console.error('Error adding word:', e);
      showPopup("We couldn't add your word right now. Please try again.", "error");
    }
    setAddLoading(false);
  };

  const [showBoyBubble, setShowBoyBubble] = useState(true);
  useEffect(() => {
    if (!showBoyBubble) return;
    const timer = setTimeout(() => setShowBoyBubble(false), 10000);
    return () => clearTimeout(timer);
  }, [showBoyBubble]);

  const boyBubbleMessage = "welcome, these are your cards";

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <UserBottomNavBar />

      {/* ── Inline responsive styles ── */}
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        /* FIX 1 — Image grid: responsive columns, no overflow */
        .sl-image-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* 4 col on desktop */
          gap: clamp(1rem, 3vw, 3rem);
          margin: 1.5em 0 2em 0;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden; /* prevent bleed */
        }
        .sl-image-grid img {
          width: 100%;          /* FIX: was 150% — caused overflow + disappearance */
          height: clamp(140px, 20vw, 320px);  /* FIX: fluid height */
          object-fit: cover;
          border-radius: 12px;
          animation: float 3s ease-in-out infinite;
          display: block;
        }

        /* FIX 2 — On mobile: 2 columns instead of 4 */
        @media (max-width: 768px) {
          .sl-image-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: clamp(0.5rem, 2vw, 1.5rem);
          }
          .sl-image-grid img {
            height: clamp(120px, 28vw, 200px);
          }
        }

        /* On very small screens: still 2 columns but tighter */
        @media (max-width: 400px) {
          .sl-image-grid img {
            height: 110px;
          }
        }

        /* FIX 3 — Tab + search bar: wrap on mobile */
        .cards-toolbar {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: clamp(0.5rem, 2vw, 1.5rem);
          flex-wrap: wrap;
          margin: 0 clamp(0.5rem, 1vw, 1rem) 1.5rem;
        }
        .cards-toolbar-left {
          display: flex;
          gap: clamp(0.4rem, 1vw, 1rem);
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .cards-toolbar-right {
          display: flex;
          gap: clamp(0.4rem, 1vw, 1rem);
          align-items: center;
          flex: 1;
          justify-content: flex-end;
          min-width: 0;
        }
        .tab-btn {
          border-radius: 6px;
          padding: clamp(0.5em, 1.5vw, 0.7em) clamp(0.6em, 2vw, 2em);
          font-weight: 700;
          font-size: clamp(0.8em, 2vw, 1.1em);
          font-family: 'Inconsolata', monospace;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          white-space: nowrap;
        }
        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 0;        /* FIX: allow shrinking */
          max-width: 420px;
        }
        .search-input {
          width: 100%;
          padding: 0.7em 1em 0.7em 3em;
          border-radius: 5px;
          border: 1.5px solid #1C2E4A;
          background: rgba(255,255,255,0.7);
          font-family: 'Roboto Mono', monospace;
          font-size: clamp(0.85em, 2vw, 1em);
          color: #22365a;
          outline: none;
          box-sizing: border-box;
        }
        .search-icon {
          position: absolute;
          left: 0.8em;
          top: 50%;
          transform: translateY(-50%);
          color: #bfc9d1;
          pointer-events: none;
          display: flex;
          align-items: center;
          font-size: 1.1em;
        }

        /* Hero text — responsive */
        .cards-hero-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: clamp(1.8em, 5vw, 3.2em);
          color: #22223b;
          text-align: center;
          margin-bottom: 0.4em;
        }
        .cards-hero-sub {
          font-family: 'Roboto Mono', monospace;
          font-size: clamp(0.9em, 2.5vw, 1.25em);
          color: #22365a;
          text-align: center;
          margin-bottom: 1.5em;
          padding: 0 1em;
        }

        /* Card grid wrapper */
        .cards-grid-outer {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(0.8rem, 2vw, 2rem);
          margin-top: 1rem;
          margin-bottom: 5rem; /* space above bottom nav */
        }
        @media (max-width: 480px) {
          .cards-grid-outer {
            grid-template-columns: 1fr; /* single column on very small phones */
          }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(0.5rem, 2vw, 1.5rem)' }}>

        {/* ── FIX 1: Image grid — was 150% width + 8em gap, now fully responsive ── */}
        <div className="sl-image-grid">
          <img src={SL1} alt="Sign Language 1" />
          <img src={SL2} alt="Sign Language 2" />
          <img src={SL3} alt="Sign Language 3" />
          <img src={SL4} alt="Sign Language 4" />
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="cards-hero-title">Ready to Sign?</div>
          <div className="cards-hero-sub">
            Get more cards for enhancement of your Sign Language!
          </div>
        </div>

        {/* ── FIX 3: Toolbar — wraps cleanly on mobile ── */}
        <div className="cards-toolbar" style={{ marginTop: '1rem' }}>
          {/* Left: tab buttons */}
          <div className="cards-toolbar-left">
            <button
              className={`tab-btn${activeTab === "wave" ? " active" : ""}`}
              onClick={() => setActiveTab("wave")}
              title="Your cards"
              style={{
                background: activeTab === "wave" ? '#334E7B' : '#ffffff',
                color: activeTab === "wave" ? '#fff' : '#334E7B',
                border: '2px solid #334E7B',
                boxShadow: activeTab === "wave" ? '0 2px 12px 0 rgba(51,78,123,0.20)' : '0 1.5px 6px 0 rgba(44,62,80,0.10)',
                outline: 'none',
              }}
            >
              <MdOutlineWavingHand style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Your cards
            </button>
            <button
              className={`tab-btn${activeTab === "favorite" ? " active" : ""}`}
              onClick={() => setActiveTab("favorite")}
              title="Favorite"
              style={{
                background: activeTab === "favorite" ? '#334E7B' : '#ffffff',
                color: activeTab === "favorite" ? '#fff' : '#334E7B',
                border: '2px solid #334E7B',
                boxShadow: activeTab === "favorite" ? '0 2px 12px 0 rgba(51,78,123,0.20)' : '0 1.5px 6px 0 rgba(44,62,80,0.10)',
                outline: 'none',
              }}
            >
              <FaStar style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Favorited
            </button>
          </div>

          {/* Right: search + filter + add */}
          <div className="cards-toolbar-right">
            <div className="search-input-wrapper">
              <span className="search-icon">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="search-input"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Filter */}
            <button
              className="filter-icon-btn"
              title="Sort"
              onClick={() => setShowFilter(v => !v)}
              style={{ background: 'none', border: 'none', fontSize: '1.4em', cursor: 'pointer', padding: '0.2em', borderRadius: '50%', display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <FaFilter style={{ color: '#334E7B' }} />
              {showFilter && (
                <div className="filter-dropdown" style={{ minWidth: '220px', maxWidth: '320px' }}>
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`filter-option${sortBy === opt.value ? ' selected' : ''}`}
                      onClick={() => { setSortBy(opt.value); setShowFilter(false); }}
                      style={{ fontSize: '0.85em', padding: '0.7em 1.2em' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </button>

            {/* Add */}
            <button
              className="add-word-btn"
              title="Add Word/Phrase"
              onClick={() => { setShowAddModal(true); setAddInputError(""); setTimeout(() => addInputRef.current?.focus(), 0); }}
              style={{ background: 'none', border: 'none', fontSize: '1.8em', cursor: 'pointer', padding: '0.1em 0.3em', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
            >
              <FaPlus style={{ color: '#334E7B', fontSize: '0.85em' }} />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div>
          {loading ? (
            <div style={{ textAlign: "center", color: "#aaa", marginTop: "4vw" }}>Loading...</div>
          ) : (
            <div className="cards-grid-outer">
              <UserCards cards={filteredCards} onCardUpdated={handleCardUpdated} />
            </div>
          )}
        </div>
      </div>

      {/* ── Add Word Modal ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', zIndex: 3002, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1em' }}>
          <form
            onSubmit={e => { e.preventDefault(); handleAddWord(); }}
            style={{ borderRadius: 20, border: '2px solid #334E7B', background: '#fff', width: '95%', maxWidth: 440, padding: 'clamp(1.5em,4vw,2.5em)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', color: '#334E7B', fontFamily: 'Roboto Mono, monospace', alignItems: 'stretch', gap: '0.7em', position: 'relative' }}
          >
            <button type="button" onClick={() => { setShowAddModal(false); setAddInput(""); setAddInputError(""); }} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: '1.5em', color: '#334E7B', cursor: 'pointer', fontWeight: 700 }} aria-label="Close">×</button>
            <div style={{ fontWeight: 700, fontSize: 'clamp(1.4em,4vw,2em)', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace' }}>Add Word/Phrase</div>
            <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 8, padding: '0.8em 1em', marginBottom: '1.2em', fontSize: '0.9em', color: '#6c757d', lineHeight: 1.4, textAlign: 'center' }}>
              <strong style={{ color: '#495057' }}>Note:</strong> Our dataset has limited coverage. Some words may not have sign language matches available.
            </div>
            <input
              ref={addInputRef}
              type="text"
              value={addInput}
              onChange={e => { setAddInput(e.target.value); if (addInputError) setAddInputError(""); }}
              placeholder="Enter word or phrase"
              disabled={addLoading}
              autoFocus
              style={{ background: '#fff', color: '#2563eb', fontWeight: 600, fontSize: '1.1em', border: `2px solid ${addInputError ? '#dc3545' : '#334E7B'}`, borderRadius: 8, padding: '0.6em 1em', fontFamily: 'Inconsolata, monospace', outline: 'none', boxSizing: 'border-box' }}
            />
            {addInputError && <div style={{ color: '#dc3545', fontSize: '0.9em', fontFamily: 'Inconsolata, monospace', fontWeight: 500 }}>{addInputError}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1em', margin: '0.5em 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
              <span style={{ color: '#52677D', fontSize: '0.9em', fontFamily: 'Inconsolata, monospace', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
            </div>
            <button type="button" onClick={() => { setShowAddModal(false); setShowCategoryModal(true); }} disabled={addLoading} style={{ width: '100%', background: 'transparent', color: '#1C2E4A', border: '2px solid #1C2E4A', borderRadius: 12, padding: '0.8em', fontWeight: 700, fontSize: '1em', fontFamily: 'Inconsolata, monospace', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3em' }}>
              <span>Words with sign language available</span>
              <span style={{ fontSize: '0.85em', fontWeight: 500, opacity: 0.8 }}>Browse categories with verified signs</span>
            </button>
            <div style={{ display: 'flex', gap: '1em', marginTop: '1em' }}>
              <button type="submit" disabled={addLoading} style={{ flex: 1, background: '#1C2E4A', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.7em 0', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: addLoading ? 'not-allowed' : 'pointer', opacity: addLoading ? 0.7 : 1 }}>{addLoading ? "Adding..." : "Add"}</button>
              <button type="button" onClick={() => { setShowAddModal(false); setAddInput(""); setAddInputError(""); }} disabled={addLoading} style={{ flex: 1, background: '#52677D', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.7em 0', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: addLoading ? 'not-allowed' : 'pointer', opacity: addLoading ? 0.7 : 1 }}>Cancel</button>
            </div>
          </form>
          <MessagePopup open={popup.open} title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"} description={popup.message} onClose={() => setPopup(p => ({ ...p, open: false }))} style={{ zIndex: 3000 }} />
        </div>
      )}

      {!showAddModal && <MessagePopup open={popup.open} title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"} description={popup.message} onClose={() => setPopup(p => ({ ...p, open: false }))} />}

      {/* Category Modal */}
      {showCategoryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1em' }}>
          <div style={{ background: '#1C2E4A', borderRadius: 20, padding: 'clamp(1em,3vw,2em)', maxWidth: '500px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}>
            <h2 style={{ color: '#fff', fontFamily: 'Inconsolata, monospace', fontSize: 'clamp(1.1em,3vw,1.5em)', fontWeight: 700, marginBottom: '1.5em', textAlign: 'center' }}>Select Category</h2>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5em' }}>
              {Object.keys(categoryData).map((category) => {
                const CategoryIcon = getCategoryIcon(category);
                return (
                  <div key={category} onClick={() => handleCategorySelect(category)} style={{ display: 'flex', alignItems: 'center', gap: '1em', padding: '0.8em 1em', marginBottom: '0.5em', background: '#2E5C9A', borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#334E7B'} onMouseLeave={e => e.currentTarget.style.background = '#2E5C9A'}>
                    <div style={{ width: 45, height: 45, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CategoryIcon size={24} color="#1C2E4A" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontFamily: 'Inconsolata, monospace', fontSize: '1em', fontWeight: 700 }}>{formatCategoryName(category)}</div>
                      <div style={{ color: '#b8c5d6', fontFamily: 'Inconsolata, monospace', fontSize: '0.85em' }}>{categoryData[category].length} words</div>
                    </div>
                    <FaArrowRight size={18} color="#fff" />
                  </div>
                );
              })}
            </div>
            <button onClick={handleCancelCategorySelection} style={{ width: '100%', background: '#52677D', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.8em', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Word Modal */}
      {showWordModal && selectedCategory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1em' }}>
          <div style={{ background: '#1C2E4A', borderRadius: 20, padding: 'clamp(1em,3vw,2em)', maxWidth: '500px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '1.5em' }}>
              <button onClick={handleBackToCategories} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5em', display: 'flex', alignItems: 'center', borderRadius: 8 }}><FaArrowLeft size={20} /></button>
              <h2 style={{ color: '#fff', fontFamily: 'Inconsolata, monospace', fontSize: 'clamp(1.1em,3vw,1.5em)', fontWeight: 700, flex: 1, margin: 0 }}>{formatCategoryName(selectedCategory)}</h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5em' }}>
              {categoryData[selectedCategory].map((word, index) => (
                <div key={index} onClick={() => handleWordSelect(word)} style={{ padding: '0.9em 1.2em', marginBottom: '0.5em', background: '#2E5C9A', borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#334E7B'} onMouseLeave={e => e.currentTarget.style.background = '#2E5C9A'}>
                  <div style={{ color: '#fff', fontFamily: 'Inconsolata, monospace', fontSize: '1em', fontWeight: 600 }}>{word}</div>
                </div>
              ))}
            </div>
            <button onClick={handleCancelWordSelection} style={{ width: '100%', background: '#52677D', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.8em', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && selectedWord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1em' }}>
          <div style={{ background: '#1C2E4A', borderRadius: 20, padding: 'clamp(1em,3vw,2em)', maxWidth: '400px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}>
            <h2 style={{ color: '#fff', fontFamily: 'Inconsolata, monospace', fontSize: 'clamp(1em,3vw,1.3em)', fontWeight: 700, marginBottom: '1em', textAlign: 'center' }}>Add Word to Collection?</h2>
            <p style={{ color: '#b8c5d6', fontFamily: 'Inconsolata, monospace', fontSize: '1.1em', marginBottom: '1.5em', textAlign: 'center', fontWeight: 600 }}>"{selectedWord}"</p>
            <div style={{ display: 'flex', gap: '1em' }}>
              <button onClick={handleConfirmAddWord} disabled={addLoading} style={{ flex: 1, background: '#2E5C9A', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.8em', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: addLoading ? 'not-allowed' : 'pointer', opacity: addLoading ? 0.7 : 1 }}>{addLoading ? "Adding..." : "Add"}</button>
              <button onClick={handleCancelConfirmation} disabled={addLoading} style={{ flex: 1, background: '#52677D', color: '#fff', border: '2px solid #fff', borderRadius: 12, padding: '0.8em', fontWeight: 700, fontSize: '1.1em', fontFamily: 'Inconsolata, monospace', cursor: addLoading ? 'not-allowed' : 'pointer', opacity: addLoading ? 0.7 : 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Boy bubble */}
      {showBoyBubble && (
        <div style={{ position: 'fixed', bottom: '38px', right: '38px', zIndex: 1000, display: 'flex', alignItems: 'flex-end', pointerEvents: 'none', animation: 'boyFloat 2.2s ease-in-out infinite alternate' }}>
          <style>{`
            @keyframes boyFloat { 0% { transform: translateY(0); } 100% { transform: translateY(-18px); } }
            .speech-bubble { position: absolute; bottom: 130px; right: -5.9px; background: rgba(255,255,255,0.97); color: #1C2E4A; border-radius: 18px; box-shadow: 0 2px 12px #1C2E4A22; padding: 0.9em 1.2em; font-family: 'Roboto Mono', monospace; font-weight: 600; font-size: 1.08em; word-break: break-word; pointer-events: auto; border: 1.5px solid #1C2E4A; min-width: 120px; max-width: 260px; text-align: center; z-index: 2; line-height: 1.4; }
            .speech-bubble-tail { position: absolute; bottom: -18px; right: 38px; width: 0; height: 0; border-left: 16px solid transparent; border-right: 16px solid transparent; border-top: 18px solid #fff; }
            .speech-bubble-tail-border { position: absolute; bottom: -20px; right: 36px; width: 0; height: 0; border-left: 18px solid transparent; border-right: 18px solid transparent; border-top: 20px solid #1C2E4A; }
            .typed-text { display: inline-block; overflow: hidden; white-space: nowrap; border-right: 2.5px solid #1C2E4A; animation: typing 2.2s steps(32, end), blink-caret 0.7s step-end infinite; }
            @keyframes typing { from { width: 0 } to { width: 100% } }
            @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: #1C2E4A; } }
            /* FIX: hide boy bubble on very small screens so it doesn't block cards */
            @media (max-width: 480px) { .boy-bubble-wrapper { display: none !important; } }
          `}</style>
          <div className="boy-bubble-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="speech-bubble">
              <span className="typed-text">{boyBubbleMessage}</span>
              <span className="speech-bubble-tail" />
              <span className="speech-bubble-tail-border" />
            </div>
            <img src={boyImg} alt="boy" style={{ width: 90, height: 'auto', filter: 'drop-shadow(0 4px 16px rgba(44,62,80,0.18))', userSelect: 'none' }} />
          </div>
        </div>
      )}
    </div>
  );
}