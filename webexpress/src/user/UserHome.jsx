import React, { useState, useEffect } from "react";
import { FaFilter, FaStar, FaQuestionCircle } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserBottomNavBar from '../components/UserBottomNavBar';
import UserCards from '../components/UserCards';
import { getUserData } from '../data/UserData';
import MessagePopup from '../components/MessagePopup';
import { useNavigate } from "react-router-dom";
import bgImage from '../assets/background.png'; // Import the background image
import expressLogo from '../assets/express_logo.png';
import '../CSS/UserHome.css';

// Get the API endpoint from .env
const API_URL = import.meta.env.VITE_PHRASESWORDSBYIDGET;
const INSERT_API_URL = import.meta.env.VITE_PHRASESWORDSINSERT;
const TRYSEARCH_API_URL = import.meta.env.VITE_TRYSEARCH;
const UPDATE_STATUS_API_URL = import.meta.env.VITE_PHRASESWORDSSTATUSUPDATE; // Assuming you have an API endpoint for status updates

export default function UserHome() {
  const [activeTab, setActiveTab] = useState("wave");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showMeatball, setShowMeatball] = useState(false);
  const [sortBy, setSortBy] = useState("date-new");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadCards, setReloadCards] = useState(0);
  const navigate = useNavigate();

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addInput, setAddInput] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Message popup state
  const [popup, setPopup] = useState({ open: false, message: "", type: "info" });

  const showPopup = (message, type = "info", timeout = 5000) => {
    setPopup({ open: true, message, type });
    setTimeout(() => setPopup(p => ({ ...p, open: false })), timeout);
  };

  // Get user_id from user data utility
  const userData = getUserData();
  const user_id = userData?.user_id || "";

  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}?user_id=${encodeURIComponent(user_id)}`);
        const json = await res.json();
        // Only store active cards in the main 'cards' state
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
      // If the card is archived, filter it out from the current list
      if (updatedCard.status === "archived") {
        return prevCards.filter(card => card.entry_id !== updatedCard.entry_id);
      } else {
        // Otherwise, update the card's properties
        return prevCards.map(card =>
          card.entry_id === updatedCard.entry_id ? { ...card, ...updatedCard } : card
        );
      }
    });
  };

  // Helper: get the string to use for search/sort
  const getCardString = (card) =>
    (card.words || card.wordsphrases || card.title || "").toString();

  // Filtering and sorting
  let filteredCards = cards;
  // The 'cards' state itself now only holds active cards, so this filter is redundant here for 'active'
  // filteredCards = filteredCards.filter(card => card.status === "active");
  if (activeTab === "favorite") {
    filteredCards = filteredCards.filter(card => card.is_favorite === 1);
  }

  if (search.trim() !== "") {
    filteredCards = filteredCards.filter(card =>
      getCardString(card).toLowerCase().includes(search.toLowerCase())
    );
  }

  // Natural sort for strings with numbers
  function naturalCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }

  if (sortBy === "alpha") {
    filteredCards = [...filteredCards].sort((a, b) =>
      naturalCompare(getCardString(a), getCardString(b))
    );
  } else if (sortBy === "alpha-rev") {
    filteredCards = [...filteredCards].sort((a, b) =>
      naturalCompare(getCardString(b), getCardString(a))
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

  // Close dropdowns when clicking outside
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

  const normalize = str =>
    (str || "")
      .replace(/'/g, "")
      .trim()
      .toLowerCase();

  const handleAddWord = async () => {
    if (!addInput.trim()) return;

    // Prevent duplicates (case-insensitive, ignore apostrophes)
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
        body: JSON.stringify({
          user_id,
          words: addInput,
          sign_language: sign_language_url,
          is_match
        })
      });
      const insertJson = await insertRes.json();
      if (insertJson.status === 201 || insertJson.status === "201") {
        // Here's the key change: Add the new card to the beginning of the 'cards' state
        setCards(prev => [
          {
            entry_id: insertJson.entry_id, // Assuming your API returns the new entry_id
            words: addInput,
            sign_language: sign_language_url,
            is_favorite: 0, // Default to not favorited
            created_at: new Date().toISOString(), // Use current date for sorting
            status: "active" // Ensure the new card is active
          },
          ...prev
        ]);
        setShowAddModal(false);
        setAddInput("");
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

  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <>
      {/* Help Icon - Top Left */}
      <button
        className="help-icon-btn"
        title="Help"
        onClick={() => setShowHelpModal(true)}
      >
        <FaQuestionCircle size={32} color="#334E7B" />
      </button>
      {showHelpModal && (
        <div className="help-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="help-modal" onClick={e => e.stopPropagation()}>
            <h2>How to Use Your Cards</h2>
            <ul>
              <li><b>Search:</b> Use the search bar to quickly find cards by keyword.</li>
              <li><b>Sort/Filter:</b> Click the filter icon to sort cards alphabetically or by date.</li>
              <li><b>Favorite:</b> Click the star icon on a card to add it to your favorites tab.</li>
              <li><b>Archive:</b> Use the meatball (three dots) menu to archive cards you no longer need.</li>
              <li><b>Add:</b> Click the meatball menu and select "Add Word/Phrases" to create a new card.</li>
              <li><b>Edit:</b> Click on a card to view or edit its details (if supported).</li>
              <li><b>Restore:</b> Visit the Archive page to restore or permanently delete archived cards.</li>
            </ul>
            <button className="help-modal-close" onClick={() => setShowHelpModal(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="search-main-container">
        <div className="search-two-col-container">
          {/* Left: App Info */}
          <div className="search-app-info-col">
            <div className="search-app-logo-row">
              {/* Logo: Use image if available, else styled text */}
              <img src={expressLogo} alt="exPress Logo" className="search-app-logo-img" onError={e => {e.target.style.display='none'; e.target.parentNode.querySelector('.search-app-logo-fallback').style.display='block';}} />
              <div className="search-app-logo-fallback" style={{display:'none'}}>
                <div className="search-app-logo-text">
                  <span className="ex-logo-e">E</span><span className="ex-logo-x">X</span>
                  <span className="ex-logo-p">P</span><span className="ex-logo-r">R</span><span className="ex-logo-e2">E</span><span className="ex-logo-s">S</span><span className="ex-logo-s2">S</span>
                  <span className="ex-logo-owlets">owlets</span>
                </div>
              </div>
            </div>
            <div className="search-app-title"><span className="ex-logo-e">ex</span><span className="ex-logo-p">Press</span></div>
            <div className="search-app-desc">
              is a mobile and web application<br />
              designed to allow abled people to connect within<br />
              deaf-mute communities seamlessly. With features<br />
              like sign language to text and text/audio to sign<br />
              language conversion for mobile, and audio-text to<br />
              sign for web
            </div>
            <div className="search-app-download-row">
              <a href="#" className="search-app-social-link" title="Facebook" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook" /></a>
              <a href="mailto:info@express.com" className="search-app-social-link" title="Email"><i className="fa fa-envelope" /></a>
            </div>
          </div>
          {/* Right: Search/cards UI */}
          <div className="search-content-box">
            {/* Search bar and filter/meatball icons */}
            <div className="search-bar-row">
              <input
                className="search-input"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className="filter-icon-btn"
                title="Sort"
                onClick={() => {
                  setShowFilter(v => !v);
                  setShowMeatball(false);
                }}
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
              <button
                className="meatball-icon-btn"
                title="Menu"
                onClick={() => {
                  setShowMeatball(v => !v);
                  setShowFilter(false);
                }}
              >
                <BsThreeDotsVertical />
              </button>
              {showMeatball && (
                <div className="meatball-dropdown">
                  <button className="meatball-option" onClick={() => {
                    setShowMeatball(false);
                    navigate("/userarchived");
                    }}>
                    Archive
                  </button>
                  <button
                    className="meatball-option"
                    onClick={() => {
                      setShowMeatball(false);
                      setShowAddModal(true);
                    }}
                  >
                    Add Word/Phrases
                  </button>
                </div>
              )}
            </div>
            {/* Tabs */}
            <div className="tab-row">
              <button
                className={`tab-btn${activeTab === "wave" ? " active" : ""}`}
                onClick={() => setActiveTab("wave")}
                title="Your cards"
              >
                <MdOutlineWavingHand />
              </button>
              <button
                className={`tab-btn${activeTab === "favorite" ? " active" : ""}`}
                onClick={() => setActiveTab("favorite")}
                title="Favorite"
              >
                <FaStar />
              </button>
            </div>
            {/* Scrollable card list */}
            {loading ? (
              <div style={{ textAlign: "center", color: "#aaa", marginTop: "4vw" }}>Loading...</div>
            ) : (
            <UserCards
              cards={filteredCards}
              onCardUpdated={handleCardUpdated}
            />
            )}
          </div>
        </div>
      </div>
      <UserBottomNavBar />

      {/* Add Word/Phrases Modal */}
      {showAddModal && (
        <div className="add-modal-overlay">
          <div className="add-modal">
            <h3>Add Word/Phrase</h3>
            <input
              className="add-modal-input"
              type="text"
              value={addInput}
              onChange={e => setAddInput(e.target.value)}
              placeholder="Enter word or phrase"
              disabled={addLoading}
              autoFocus
            />
            <div className="add-modal-actions">
              <button
                className="add-modal-btn"
                onClick={handleAddWord}
                disabled={addLoading || !addInput.trim()}
              >
                {addLoading ? "Adding..." : "Add"}
              </button>
              <button
                className="add-modal-btn cancel"
                onClick={() => setShowAddModal(false)}
                disabled={addLoading}
              >
                Cancel
              </button>
            </div>
          </div>
          <MessagePopup
            open={popup.open}
            title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"}
            description={popup.message}
            onClose={() => setPopup(p => ({ ...p, open: false }))}
            style={{ zIndex: 3000 }}
          />
        </div>
      )}

      {!showAddModal && (
        <MessagePopup
          open={popup.open}
          title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"}
          description={popup.message}
          onClose={() => setPopup(p => ({ ...p, open: false }))}
        />
      )}
    </>
  );
}