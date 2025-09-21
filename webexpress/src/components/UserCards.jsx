import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaStar, FaRegStar, FaTrash, FaEdit, FaArchive } from "react-icons/fa";
import { MdSpeakerPhone } from "react-icons/md";
import { RiSpeakerFill } from "react-icons/ri";
import UserCardDetailsModal from "./UserCardsDetails";


const FAVORITE_API_URL = import.meta.env.VITE_PHRASESWORDSISFAVORITEUPDATE;
const EDIT_API_URL = import.meta.env.VITE_PHRASESWORDSEDIT;
const STATUS_UPDATE_API_URL = import.meta.env.VITE_PHRASESWORDSSTATUSUPDATE;
const TRYSEARCH_API_URL = import.meta.env.VITE_TRYSEARCH;

export default function UserCards({ cards: initialCards, onCardUpdated }) {
  const [cards, setCards] = useState(initialCards || []);
  const [speakingId, setSpeakingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const synthRef = useRef(window.speechSynthesis);
  const [editCard, setEditCard] = useState(null); // card being edited
  const [editValue, setEditValue] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [archiveCard, setArchiveCard] = useState(null); // card being archived
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [announcement, setAnnouncement] = useState(""); // For screen reader announcements

  useEffect(() => {
    // Only update if initialCards has truly changed (deep comparison might be needed for complex objects,
    // but for simple updates like status, direct assignment is usually fine)
    setCards(initialCards || []);
  }, [initialCards]);

  // Handle favorite/unfavorite toggle (with API)
  const handleFavorite = useCallback(async (cardToUpdate, is_favorite) => { // Receive the full card object
    setUpdatingId(cardToUpdate.entry_id);
    const action = is_favorite ? "Removing from favorites" : "Adding to favorites";
    setAnnouncement(`${action}: ${cardToUpdate.words}`);
    
    try {
      const newFavoriteStatus = is_favorite ? 0 : 1;
      const res = await fetch(FAVORITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry_id: cardToUpdate.entry_id, is_favorite: newFavoriteStatus }),
      });
      const json = await res.json();
      if (json.status === 200) {
        const updatedCard = { ...cardToUpdate, is_favorite: newFavoriteStatus };
        // Update the local state first
        setCards(prevCards =>
          prevCards.map(card =>
            card.entry_id === updatedCard.entry_id
              ? updatedCard
              : card
          )
        );
        // Notify the parent about the updated card
        onCardUpdated(updatedCard);
        const successMessage = newFavoriteStatus 
          ? `${cardToUpdate.words} added to favorites` 
          : `${cardToUpdate.words} removed from favorites`;
        setAnnouncement(successMessage);
      } else {
        setAnnouncement("Failed to update favorite status. Please try again.");
        alert("Failed to update favorite status.");
      }
    } catch (e) {
      setAnnouncement("Network error updating favorite. Please try again.");
      alert("Network error updating favorite.");
    }
    setUpdatingId(null);
  }, [onCardUpdated]);

  const handleSpeak = useCallback((card) => {
    if (speakingId !== null) {
      synthRef.current.cancel();
      setSpeakingId(null);
      setAnnouncement("Speech stopped");
      return;
    }
    
    try {
      const utter = new window.SpeechSynthesisUtterance(card.words);
      setSpeakingId(card.entry_id);
      setAnnouncement(`Speaking: ${card.words}`);
      utter.onend = () => {
        setSpeakingId(null);
        setAnnouncement("Speech finished");
      };
      utter.onerror = () => {
        setSpeakingId(null);
        setAnnouncement("Speech error occurred");
      };
      synthRef.current.speak(utter);
    } catch (error) {
      setSpeakingId(null);
      setAnnouncement("Speech not available");
    }
  }, [speakingId]);

  // Keyboard navigation handlers
  const handleCardKeyDown = useCallback((event, card) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedCard(card);
    } else if (event.key === 'Escape') {
      event.target.blur();
    }
  }, []);

  const handleActionKeyDown = useCallback((event, action, card) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      action(card);
    } else if (event.key === 'Escape') {
      event.target.blur();
    }
  }, []);

  // Navigation for modal
  const handlePrev = () => {
    if (!selectedCard) return;
    const idx = cards.findIndex(c => c.entry_id === selectedCard.entry_id);
    if (idx > 0) setSelectedCard(cards[idx - 1]);
  };
  const handleNext = () => {
    if (!selectedCard) return;
    const idx = cards.findIndex(c => c.entry_id === selectedCard.entry_id);
    if (idx < cards.length - 1) setSelectedCard(cards[idx + 1]);
  };

  const handleCardUpdatedInternal = (updatedCard) => {
    // This function is called from the modal (UserCardDetailsModal)
    // If the card is archived, remove it from the local state
    if (updatedCard.status === "archived") {
      setCards(prevCards => prevCards.filter(card => card.entry_id !== updatedCard.entry_id));
      setSelectedCard(null); // Close the modal if the card is archived
    } else {
      // Otherwise, update the card in the local state
      setCards(prevCards =>
        prevCards.map(card =>
          card.entry_id === updatedCard.entry_id ? updatedCard : card
        )
      );
      // Keep the modal open with the updated card if it's still active
      setSelectedCard(updatedCard);
    }
    // Always inform the parent component about the change
    onCardUpdated(updatedCard);
  };

  return (
    <>
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      
      <style>{`
        @media (max-width: 700px) {
          .card-list {
            grid-template-columns: 1fr !important;
          }
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .card-item:focus,
        .card-item:focus-visible {
          outline: 3px solid #4285f4;
          outline-offset: 2px;
        }
        .card-action-btn:focus,
        .card-action-btn:focus-visible {
          outline: 2px solid #4285f4;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-item {
            transition: none;
          }
          .card-action-btn {
            transition: none;
          }
        }
      `}</style>
      
      <main className="card-list" role="main" aria-label="User cards collection" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2vw',
        marginTop: '2vw',
        marginBottom: '2vw',
      }}>
        {cards.length === 0 ? (
          <div role="status" aria-live="polite" style={{ textAlign: "center", color: "#aaa", marginTop: "4vw", gridColumn: "1 / -1" }}>
            <p>No cards found.</p>
          </div>
        ) : (
          <>
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {cards.length} card{cards.length === 1 ? '' : 's'} available
            </div>
            {cards.map(card => (
              <article
                className="card-item"
                key={card.entry_id}
                onClick={e => {
                  if (e.target.closest('.card-action-btn')) return;
                  setSelectedCard(card);
                }}
                onKeyDown={e => handleCardKeyDown(e, card)}
                tabIndex={0}
                role="button"
                aria-label={`Card: ${card.words}. Click to view details.`}
                aria-describedby={`card-actions-${card.entry_id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  background: '#fff',
                  border: '1.5px solid #334E7B',
                  borderRadius: '20px',
                  minHeight: 60,
                  height: 165,
                  width: '80vw',
                  maxWidth: 650,
                  margin: '0 auto',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.15s',
                  boxShadow: 'none',
                  fontFamily: 'Roboto Mono, sans-serif',
                  overflow: 'hidden',
                  position: 'relative', 
                }}
              >
                <div style={{
                  width: 150,
                  height: '100%',
                  background: '#334E7B',
                  borderRadius: '18px 0 0 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }} role="presentation" aria-hidden="true" />
                
                <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  <h3 className="card-title" style={{ 
                    fontWeight: 600, 
                    fontSize: '1.18em', 
                    color: '#22223b', 
                    letterSpacing: '0.01em', 
                    fontFamily: 'Roboto Mono, monospace', 
                    textAlign: 'center', 
                    width: '100%',
                    margin: 0
                  }}>{card.words}</h3>
                </div>
                
                {/* Favorite icon - top left */}
                <button
                  className="card-action-btn"
                  title={card.is_favorite ? `Remove ${card.words} from favorites` : `Add ${card.words} to favorites`}
                  aria-label={card.is_favorite ? `Remove "${card.words}" from favorites` : `Add "${card.words}" to favorites`}
                  aria-pressed={card.is_favorite}
                  onClick={e => { e.stopPropagation(); handleFavorite(card, card.is_favorite); }}
                  onKeyDown={e => handleActionKeyDown(e, (c) => handleFavorite(c, c.is_favorite), card)}
                  disabled={updatingId === card.entry_id}
                  type="button"
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: 'none',
                    border: 'none',
                    cursor: updatingId === card.entry_id ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    fontSize: '1.7em',
                    color: card.is_favorite ? '#f7b731' : '#bfc9d1',
                    transition: 'color 0.2s, transform 0.15s',
                    padding: 4,
                    borderRadius: '4px',
                    zIndex: 3
                  }}
                >
                  {updatingId === card.entry_id ? (
                    <span aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                  ) : card.is_favorite ? (
                    <FaStar aria-hidden="true" />
                  ) : (
                    <FaRegStar aria-hidden="true" />
                  )}
                </button>
              
                <div 
                  id={`card-actions-${card.entry_id}`}
                  role="group" 
                  aria-label={`Actions for ${card.words}`}
                  style={{
                    position: 'absolute',
                    right: 18,
                    bottom: 18,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    zIndex: 2,
                  }}
                >
                  <button
                    className="card-action-btn"
                    title={speakingId === card.entry_id ? `Stop speaking "${card.words}"` : `Speak "${card.words}"`}
                    aria-label={speakingId === card.entry_id ? `Stop speaking "${card.words}"` : `Speak "${card.words}"`}
                    aria-pressed={speakingId === card.entry_id}
                    onClick={e => { e.stopPropagation(); handleSpeak(card); }}
                    onKeyDown={e => handleActionKeyDown(e, handleSpeak, card)}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                      fontSize: '1.7em',
                      transition: 'color 0.2s, transform 0.15s',
                      padding: 4,
                      borderRadius: '4px',
                    }}
                  >
                    <svg width="1.1em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
                      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </button>
                  
                  <button
                    className="card-action-btn"
                    title={`Edit "${card.words}"`}
                    aria-label={`Edit card "${card.words}"`}
                    onClick={e => {
                      e.stopPropagation();
                      setEditCard(card);
                      setEditValue(card.words);
                      setEditError("");
                      setAnnouncement(`Opening edit form for: ${card.words}`);
                    }}
                    onKeyDown={e => handleActionKeyDown(e, (c) => {
                      setEditCard(c);
                      setEditValue(c.words);
                      setEditError("");
                      setAnnouncement(`Opening edit form for: ${c.words}`);
                    }, card)}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                      fontSize: '1.7em',
                      transition: 'color 0.2s, transform 0.15s',
                      padding: 4,
                      borderRadius: '4px',
                    }}
                  >
                    <FaEdit aria-hidden="true" />
                  </button>
                  
                  <button
                    className="card-action-btn"
                    title={`Archive "${card.words}"`}
                    aria-label={`Archive card "${card.words}"`}
                    onClick={e => {
                      e.stopPropagation();
                      setArchiveCard(card);
                      setAnnouncement(`Archive confirmation for: ${card.words}`);
                    }}
                    onKeyDown={e => handleActionKeyDown(e, (c) => {
                      setArchiveCard(c);
                      setAnnouncement(`Archive confirmation for: ${c.words}`);
                    }, card)}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                      fontSize: '1.7em',
                      transition: 'color 0.2s, transform 0.15s',
                      padding: 4,
                      borderRadius: '4px',
                    }}
                  >
                    <FaArchive aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </>
        )}
      </main>
      {selectedCard && (
        <UserCardDetailsModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={cards.findIndex(c => c.entry_id === selectedCard.entry_id) > 0}
          hasNext={cards.findIndex(c => c.entry_id === selectedCard.entry_id) < cards.length - 1}
          onCardUpdated={handleCardUpdatedInternal}
        />
      )}

      {editCard && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.08)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !editLoading) {
              setEditCard(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !editLoading) {
              setEditCard(null);
            }
          }}
        >
          <form 
            onSubmit={async e => {
              e.preventDefault();
              setEditLoading(true);
              setEditError("");
              try {
                // First, search for sign language video if the text has changed
                let sign_language_url = editCard.sign_language || "";
                let is_match = editCard.is_match || 0;
                
                if (editValue.trim() !== editCard.words.trim()) {
                  try {
                    const searchRes = await fetch(`${TRYSEARCH_API_URL}?q=${encodeURIComponent(editValue)}`);
                    const searchJson = await searchRes.json();
                    if (searchJson?.public_id && Array.isArray(searchJson.all_files)) {
                      const file = searchJson.all_files.find(f => f.public_id === searchJson.public_id);
                      if (file) {
                        sign_language_url = file.url;
                        is_match = 1;
                      } else {
                        // If no match found, keep existing video but mark as no match
                        is_match = 0;
                      }
                    } else {
                      // If search fails or no results, keep existing video but mark as no match
                      is_match = 0;
                    }
                  } catch (searchError) {
                    // If search API fails, continue with edit but keep existing sign language
                    console.warn('Sign language search failed:', searchError);
                  }
                }

                // Now update the card with both text and sign language
                const res = await fetch(EDIT_API_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    entry_id: editCard.entry_id,
                    words: editValue,
                    sign_language: sign_language_url,
                    is_match: is_match
                  })
                });
                const json = await res.json();
                if (json.status === 200 || json.status === "200") {
                  const updatedCard = { 
                    ...editCard, 
                    words: editValue, 
                    sign_language: sign_language_url, 
                    is_match: is_match 
                  };
                  setCards(prevCards => prevCards.map(card => card.entry_id === editCard.entry_id ? updatedCard : card));
                  onCardUpdated(updatedCard);
                  setEditCard(null);
                } else {
                  setEditError(json.message || "Failed to save.");
                }
              } catch (e) {
                setEditError("Error saving changes.");
              }
              setEditLoading(false);
            }} 
            style={{
              borderRadius: 20,
              border: '2px solid #334E7B',
              background: '#fff',
              width: '95%',
              maxWidth: 440,
              padding: '2.5em 2.5em 2em 2.5em',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              color: '#334E7B',
              fontFamily: 'Roboto Mono, monospace',
              alignItems: 'stretch',
              gap: '0.7em',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              id="edit-modal-title"
              style={{ 
                fontWeight: 700, 
                fontSize: '2em', 
                textAlign: 'center', 
                marginBottom: '1.2em', 
                fontFamily: 'Inconsolata, monospace', 
                color: '#334E7B',
                margin: 0 
              }}
            >
              Edit Card
            </h2>
            {editError && (
              <div 
                role="alert"
                aria-live="assertive"
                style={{ 
                  color: '#ff4d4d', 
                  textAlign: 'center', 
                  marginBottom: '0.5em', 
                  fontSize: '1em' 
                }}
              >
                {editError}
              </div>
            )}
            <div style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', marginBottom: '1.5em' }}>
              Changing the text will search for a matching sign language video
            </div>
            <label 
              htmlFor="edit-card-input"
              style={{ 
                fontWeight: 800, 
                fontSize: '1.1em', 
                marginBottom: 2, 
                color: '#334E7B' 
              }}
            >
              Word or Phrase
            </label>
            <input
              id="edit-card-input"
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              disabled={editLoading}
              required
              aria-describedby="edit-help-text"
              autoFocus
              style={{
                background: '#fff',
                color: '#2563eb',
                fontWeight: 600,
                fontSize: '1.1em',
                border: '1px #334E7B',
                borderRadius: 8,
                padding: '0.6em 1em',
                marginBottom: 8,
                fontFamily: 'Inconsolata, monospace',
                outline: '2px solid #334E7B',
                boxSizing: 'border-box',
                transition: 'outline 0.2s',
              }}
            />
            <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
              <button
                type="submit"
                disabled={editLoading || !editValue.trim()}
                aria-describedby={editLoading ? "save-loading" : undefined}
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
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {editLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditCard(null)}
                disabled={editLoading}
                aria-label="Cancel editing"
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
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      
      {archiveCard && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-modal-title"
          aria-describedby="archive-modal-description"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.08)', zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !archiveLoading) {
              setArchiveCard(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !archiveLoading) {
              setArchiveCard(null);
            }
          }}
        >
          <div 
            style={{
              borderRadius: 20,
              border: '2px solid #334E7B',
              background: '#fff',
              width: '95%',
              maxWidth: 440,
              padding: '2.5em 2.5em 2em 2.5em',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              color: '#334E7B',
              fontFamily: 'Roboto Mono, monospace',
              alignItems: 'stretch',
              gap: '0.7em',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              id="archive-modal-title"
              style={{ 
                fontWeight: 700, 
                fontSize: '2em', 
                textAlign: 'center', 
                marginBottom: '1.2em', 
                fontFamily: 'Inconsolata, monospace', 
                color: '#334E7B',
                margin: 0 
              }}
            >
              Confirm Archive
            </h2>
            <p 
              id="archive-modal-description"
              style={{ 
                color: '#334E7B', 
                textAlign: 'center', 
                marginBottom: '1.2em', 
                fontSize: '1.1em', 
                fontWeight: 800,
                margin: 0 
              }}
            >
              Are you sure you want to archive this card? It will be moved to your archive.
            </p>
            <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
              <button
                type="button"
                onClick={async () => {
                  setArchiveLoading(true);
                  try {
                    const res = await fetch(STATUS_UPDATE_API_URL, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ entry_id: archiveCard.entry_id, status: "archived" })
                    });
                    const json = await res.json();
                    if (json.status === 200 || json.status === "200" || json.status === 201 || json.status === "201") {
                      setCards(prevCards => prevCards.filter(card => card.entry_id !== archiveCard.entry_id));
                      onCardUpdated({ ...archiveCard, status: "archived" });
                      setArchiveCard(null);
                    } else {
                      alert(json.message || "Failed to archive.");
                    }
                  } catch (e) {
                    alert("Network error archiving card.");
                  }
                  setArchiveLoading(false);
                }}
                disabled={archiveLoading}
                aria-describedby={archiveLoading ? "archive-loading" : undefined}
                autoFocus
                style={{
                  flex: 1,
                  background: '#ef7070ff',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 12,
                  padding: '0.7em 0',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {archiveLoading ? 'Archiving...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setArchiveCard(null)}
                disabled={archiveLoading}
                aria-label="Cancel archiving"
                style={{
                  flex: 1,
                  background: '#334E7B',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: 12,
                  padding: '0.7em 0',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  fontFamily: 'Inconsolata, monospace',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}