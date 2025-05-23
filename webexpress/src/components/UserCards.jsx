import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdSpeakerPhone } from "react-icons/md";
import { RiSpeakerFill } from "react-icons/ri";
import UserCardDetailsModal from "./UserCardsDetails";

const FAVORITE_API_URL = import.meta.env.VITE_PHRASESWORDSISFAVORITEUPDATE;

export default function UserCards({ cards: initialCards, onCardUpdated }) {
  const [cards, setCards] = useState(initialCards || []);
  const [speakingId, setSpeakingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const synthRef = useRef(window.speechSynthesis);

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
        .card-list {
          flex: 1;
          overflow-y: auto;
          max-height: 40vh;
          min-height: 120px;
          padding-right: 2%;
        }
        .card-item {
          background: #f7f7fa;
          border-radius: 2vw;
          margin-bottom: 3%;
          padding: 3% 4%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background 0.15s;
        }
        .card-item:hover {
          background: #ecebff;
        }
        .card-content {
          flex: 1;
          min-width: 0;
        }
        .card-title {
          font-weight: bold;
          margin-bottom: 1vw;
          font-size: 1.1em;
        }
        .card-actions {
          display: flex;
          align-items: center;
          gap: 4vw;
          margin-left: 4vw;
        }
        .card-action-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 1.3em;
          cursor: pointer;
          padding: 0.2em;
          transition: color 0.2s;
        }
        .card-action-btn.fav {
          color: #f7b801;
        }
        .card-action-btn.speak {
          color: #6c63ff;
        }
        .card-action-btn.speak.active {
          color: #007bff;
        }
        .card-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .card-action-btn:hover {
          color: #007bff;
        }
        @media (max-width: 600px) {
          .card-list {
            max-height: 36vh;
          }
          .card-actions {
            gap: 6vw;
          }
        }
      `}</style>
      <div className="card-list">
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
                // Prevent modal open when clicking favorite/speak buttons
                if (e.target.closest(".card-action-btn")) return;
                setSelectedCard(card);
              }}
            >
              <div className="card-content">
                <div className="card-title">{card.words}</div>
              </div>
              <div className="card-actions">
                <button
                  className={`card-action-btn speak${speakingId === card.entry_id ? " active" : ""}`}
                  title="Speak"
                  onClick={e => {
                    e.stopPropagation();
                    handleSpeak(card);
                  }}
                >
                  {speakingId === card.entry_id ? <RiSpeakerFill /> : <MdSpeakerPhone />}
                </button>
                <button
                  className={`card-action-btn${card.is_favorite ? " fav" : ""}`}
                  title={card.is_favorite ? "Unfavorite" : "Favorite"}
                  onClick={e => {
                    e.stopPropagation();
                    handleFavorite(card, card.is_favorite); {/* Pass the full card object */}
                  }}
                  disabled={updatingId === card.entry_id}
                >
                  {card.is_favorite ? <FaStar /> : <FaRegStar />}
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
    </>
  );
}