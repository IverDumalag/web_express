import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdSpeakerPhone } from "react-icons/md";
import { RiSpeakerFill } from "react-icons/ri";
import UserCardDetailsModal from "./UserCardsDetails";
import '../CSS/UserCards.css';

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
                flexDirection: 'row', // Ensure horizontal layout
                alignItems: 'center',
                background: '#fff',
                border: '1.5px solid #bfc9d1',
                borderRadius: '20px',
                minHeight: 60,
                height: 150,
                width: '80vw',
                maxWidth: 650,
                margin: '0 auto',
                padding: 0,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                boxShadow: 'none',
                fontFamily: 'Roboto Mono, sans-serif',
                overflow: 'hidden',
              }}
            >
              <div style={{
                width: 150, // Increased from 28 to 44 for a wider navy rectangle
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