import React, { useState, useEffect } from "react";
import { FaFilter, FaStar } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserBottomNavBar from '../components/UserBottomNavBar';
import UserCards from '../components/UserCards';
import { getUserData } from '../data/UserData';
import MessagePopup from '../components/MessagePopup';
import { useNavigate } from "react-router-dom";

// Get the API endpoint from .env
const API_URL = import.meta.env.VITE_PHRASESWORDSBYIDGET;
const INSERT_API_URL = import.meta.env.VITE_PHRASESWORDSINSERT;
const TRYSEARCH_API_URL = import.meta.env.VITE_TRYSEARCH;
const UPDATE_STATUS_API_URL = import.meta.env.VITE_PHRASESWORDSSTATUSUPDATE; // Assuming you have an API endpoint for status updates

export default function UserSearch() {
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

  return (
    <>
      <style>{`
          .search-main-container {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f8fc;
          }
          .search-content-box {
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
          .search-bar-row {
            display: flex;
            align-items: center;
            margin-bottom: 4vw;
            position: relative;
          }
          .search-input {
            flex: 1;
            padding: 2.5vw 2vw;
            font-size: 1.1em;
            border: 1px solid #ccc;
            border-radius: 1vw;
            outline: none;
          }
          .filter-icon-btn, .meatball-icon-btn {
            background: none;
            border: none;
            margin-left: 2vw;
            font-size: 1.7em;
            color: #888;
            cursor: pointer;
            position: relative;
          }
          .filter-dropdown, .meatball-dropdown {
            position: absolute;
            top: 110%;
            background: #fff;
            border: 1px solid #eee;
            border-radius: 1vw;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            z-index: 10;
          }
          .filter-dropdown {
            right: 48px;
            min-width: 60vw;
            max-width: 220px;
          }
          .meatball-dropdown {
            right: 0;
            min-width: 120px;
          }
          .filter-option, .meatball-option {
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
          .meatball-option:hover {
            background: #f3f1ff;
            color: #6c63ff;
          }
          .tab-row {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: stretch;
            margin-bottom: 3vw;
            gap: 0;
          }
          .tab-btn {
            flex: 1 1 0;
            background: none;
            border: none;
            font-size: 1.5em;
            color: #bbb;
            cursor: pointer;
            padding: 2vw 0;
            border-bottom: 3px solid transparent;
            transition: color 0.2s, border-bottom 0.2s, background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tab-btn.active {
            color: #6c63ff;
            border-bottom: 3px solid #6c63ff;
            background: #f3f1ff;
          }
          @media (max-width: 600px) {
            .search-content-box {
              width: 98vw;
              max-width: 99vw;
              padding: 6vw 2vw 3vw 2vw;
            }
            .search-input {
              font-size: 1em;
              padding: 3vw 2vw;
            }
            .tab-row {
              gap: 0;
            }
            .tab-btn {
              font-size: 1.2em;
              padding: 3vw 0;
            }
            .filter-dropdown {
              min-width: 70vw;
            }
          }
            .search-main-container {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f8fc;
          }
          .search-content-box {
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
          /* ...other styles... */
          .add-modal-overlay {
            position: fixed;
            z-index: 2000;
            left: 0; top: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .add-modal {
            background: #fff;
            border-radius: 3vw;
            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
            width: 90vw;
            max-width: 350px;
            min-width: 60vw;
            padding: 8vw 6vw 6vw 6vw;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }
          .add-modal h3 {
            margin-bottom: 5vw;
            text-align: center;
            font-size: 1.2em;
          }
          .add-modal-input {
            padding: 3vw 2vw;
            font-size: 1.1em;
            border: 1px solid #ccc;
            border-radius: 2vw;
            margin-bottom: 6vw;
            outline: none;
          }
          .add-modal-actions {
            display: flex;
            justify-content: space-between;
            gap: 4vw;
          }
          .add-modal-btn {
            flex: 1;
            background: #6c63ff;
            color: #fff;
            border: none;
            border-radius: 2vw;
            padding: 3vw 0;
            font-size: 1em;
            cursor: pointer;
            transition: background 0.2s;
          }
          .add-modal-btn.cancel {
            background: #bbb;
          }
          .add-modal-btn:disabled {
            background: #eee;
            color: #aaa;
            cursor: not-allowed;
          }
          @media (max-width: 600px) {
            .add-modal {
              width: 96vw;
              min-width: 0;
              max-width: 99vw;
              padding: 10vw 4vw 8vw 4vw;
              border-radius: 4vw;
            }
            .add-modal-input {
              font-size: 1em;
              padding: 4vw 2vw;
            }
          }
        `}</style>
        <div className="search-main-container">
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
                title="Wave"
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