import React, { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    // Only update if initialCards has truly changed (deep comparison might be needed for complex objects,
    // but for simple updates like status, direct assignment is usually fine)
    setCards(initialCards || []);
  }, [initialCards]);

  // Handle favorite/unfavorite toggle (with API)
  const handleFavorite = async (cardToUpdate, is_favorite) => { // Receive the full card object
    setUpdatingId(cardToUpdate.entry_id);
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
      } else {
        alert("Failed to update favorite status.");
      }
    } catch (e) {
      alert("Network error updating favorite.");
    }
    setUpdatingId(null);
  };

  const handleSpeak = (card) => {
    if (speakingId !== null) {
      synthRef.current.cancel();
      setSpeakingId(null);
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(card.words);
    setSpeakingId(card.entry_id);
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    synthRef.current.speak(utter);
  };

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
      <style>{`
        @media (max-width: 700px) {
          .card-list {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="card-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2vw',
        marginTop: '2vw',
        marginBottom: '2vw',
      }}>
        {cards.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aaa", marginTop: "4vw" }}>
            No cards found.
          </div>
        ) : (
          cards.map(card => (
            <div
              className="card-item"
              key={card.entry_id}
              onClick={e => {
                if (e.target.closest('.card-action-btn')) return;
                setSelectedCard(card);
              }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                background: '#fff',
                border: '1.5px solid #1C2E4A',
                borderRadius: '20px',
                minHeight: 60,
                height: 165,
                width: '80vw',
                maxWidth: 650,
                margin: '0 auto',
                padding: 0,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                boxShadow: 'none',
                fontFamily: 'Roboto Mono, sans-serif',
                overflow: 'hidden',
                position: 'relative', 
              }}
            >
              <div style={{
                width: 150,
                height: '100%',
                background: '#1d2e4e',
                borderRadius: '18px 0 0 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <div className="card-title" style={{ fontWeight: 600, fontSize: '1.18em', color: '#22223b', letterSpacing: '0.01em', fontFamily: 'Roboto Mono, monospace', textAlign: 'center', width: '100%' }}>{card.words}</div>
              </div>
              {/* Favorite icon - top left */}
              <button
                className="card-action-btn"
                title={card.is_favorite ? 'Unfavorite' : 'Favorite'}
                onClick={e => { e.stopPropagation(); handleFavorite(card, card.is_favorite); }}
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  fontSize: '1.7em',
                  color: card.is_favorite ? '#f7b731' : '#bfc9d1',
                  transition: 'color 0.2s',
                  padding: 0,
                  zIndex: 3
                }}
                disabled={updatingId === card.entry_id}
              >
                {card.is_favorite ? <FaStar /> : <FaRegStar />}
              </button>
            
              <div style={{
                position: 'absolute',
                right: 18,
                bottom: 18,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                zIndex: 2,
                color: '#1C2E4A',
              }}>
                <button
                  className="card-action-btn"
                  title="Speak"
                  onClick={e => { e.stopPropagation(); handleSpeak(card); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    fontSize: '1.7em',
                    color: speakingId === card.entry_id ? '#3a7bd5' : '#bfc9d1',
                    transition: 'color 0.2s',
                    padding: 0,
                  }}
                >
                  <svg width="1.1em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
                <button
                  className="card-action-btn"
                  title="Edit"
                  onClick={e => {
                    e.stopPropagation();
                    setEditCard(card);
                    setEditValue(card.words);
                    setEditError("");
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    fontSize: '1.7em',
                    color: '#bfc9d1',
                    transition: 'color 0.2s',
                    padding: 0,
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="card-action-btn"
                  title="Archive"
                  onClick={e => {
                    e.stopPropagation();
                    setArchiveCard(card);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    fontSize: '1.7em',
                    color: '#bfc9d1',
                    transition: 'color 0.2s',
                    padding: 0,
                  }}
                >
                  <FaArchive />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
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
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.08)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <form onSubmit={async e => {
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
          }} style={{
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
          }}>
            <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace', color: '#334E7B' }}>Edit Card</div>
            {editError && <div style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '0.5em', fontSize: '1em' }}>{editError}</div>}
            <div style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', marginBottom: '1.5em' }}>
              Changing the text will search for a matching sign language video
            </div>
            <label style={{ fontWeight: 800, fontSize: '1.1em', marginBottom: 2, color: '#334E7B' }}>Word or Phrase</label>
            <input
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              disabled={editLoading}
              required
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
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.08)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
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
          }}>
            <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace', color: '#334E7B' }}>
              Confirm Archive
            </div>
            <div style={{ color: '#334E7B', textAlign: 'center', marginBottom: '1.2em', fontSize: '1.1em', fontWeight: 800 }}>
              Are you sure you want to archive this card? It will be moved to your archive.
            </div>
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
          </div>
        </div>
      )}
    </>
  );
}