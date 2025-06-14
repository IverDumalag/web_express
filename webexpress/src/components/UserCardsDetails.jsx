import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { MdSpeakerPhone, MdArrowBack } from "react-icons/md";
import { RiSpeakerFill } from "react-icons/ri";
import { getUserData } from '../data/UserData';
import ConfirmationPopup from "./ConfirmationPopup";
import MessagePopup from "./MessagePopup"; // <-- Add this import
import '../CSS/UserCardsDetails.css';

// API endpoints
const EDIT_API_URL = import.meta.env.VITE_PHRASESWORDSEDIT;
const TRYSEARCH_API_URL = import.meta.env.VITE_TRYSEARCH;
const CARDS_API_URL = import.meta.env.VITE_PHRASESWORDSBYIDGET;
const STATUS_UPDATE_API_URL = import.meta.env.VITE_PHRASESWORDSSTATUSUPDATE;

export default function UserCardDetailsModal({ card, onClose, onPrev, onNext, hasPrev, hasNext, onCardUpdated }) {
  const [speaking, setSpeaking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [editWords, setEditWords] = useState(card.words);
  const [editSignLanguage, setEditSignLanguage] = useState(card.sign_language || "");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Message popup state
  const [popup, setPopup] = useState({ open: false, message: "", type: "info" });

  // Video slider
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const [allCards, setAllCards] = useState([]);
  const userData = getUserData();
  const userId = userData?.user_id || "";

  const [showMeatballModal, setShowMeatballModal] = useState(false);

  useEffect(() => {
    if (!userId || !card) return;
    if (!editMode) return;
    let ignore = false;
    async function fetchCards() {
      try {
        const res = await fetch(`${CARDS_API_URL}?user_id=${encodeURIComponent(userId)}`);
        const json = await res.json();
        if (!ignore) setAllCards(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        if (!ignore) setAllCards([]);
      }
    }
    fetchCards();
    return () => { ignore = true; };
  }, [userId, card, editMode]);

  const normalize = str =>
    (str || "")
      .replace(/'/g, "")
      .trim()
      .toLowerCase();

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const updateTime = () => setVideoTime(video.currentTime);
      const updateDuration = () => setVideoDuration(video.duration || 0);
      video.addEventListener("timeupdate", updateTime);
      video.addEventListener("loadedmetadata", updateDuration);
      return () => {
        video.removeEventListener("timeupdate", updateTime);
        video.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, [card?.sign_language]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    setEditWords(card.words);
    setEditSignLanguage(card.sign_language || "");
    setEditError("");
    setEditSuccess("");
    setEditMode(false);
  }, [card]);

  if (!card) return null;

  const handleSpeak = () => {
    if (speaking) {
      synthRef.current.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(card.words);
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synthRef.current.speak(utter);
  };

  const handlePlaybackRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
  };

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setVideoTime(time);
  };

  const isVideo = card.sign_language && card.sign_language.toLowerCase().endsWith(".mp4");
  const mediaUrl = card.sign_language
    ? card.sign_language.startsWith("http")
      ? card.sign_language
      : `/media/${card.sign_language}`
    : null;

  // --- Edit Handlers ---
  const handleEdit = () => {
    setEditMode(true);
    setEditWords(card.words);
    setEditError("");
    setEditSuccess("");
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditWords(card.words);
    setEditError("");
    setEditSuccess("");
  };

  // TrySearch + Save (media url is always auto)
  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");

    let cardsToCheck = [];
    try {
      const res = await fetch(`${CARDS_API_URL}?user_id=${encodeURIComponent(userId)}`);
      const json = await res.json();
      cardsToCheck = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      cardsToCheck = allCards.length > 0 ? allCards : [card];
      console.error('Failed to fetch cards, using fallback data:', cardsToCheck);
    }

    const normalizedInput = normalize(editWords);
    const isDuplicate = cardsToCheck.some(
      c =>
        c.entry_id !== card.entry_id &&
        normalize(c.words) === normalizedInput
    );

    if (isDuplicate) {
      setEditError("Duplicate entry not allowed.");
      setEditLoading(false);
      return;
    }

    let newSignLanguageUrl = "";
    let isMatch = 0;
    try {
      const searchRes = await fetch(`${TRYSEARCH_API_URL}?q=${encodeURIComponent(editWords)}`);
      const searchJson = await searchRes.json();
      if (searchJson?.public_id && Array.isArray(searchJson.all_files)) {
        const file = searchJson.all_files.find(f => f.public_id === searchJson.public_id);
        if (file) {
          newSignLanguageUrl = file.url;
          isMatch = 1;
        }
      }
      if (!newSignLanguageUrl) {
        newSignLanguageUrl = card.sign_language || "";
      }

      // Save to database
      const res = await fetch(EDIT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_id: card.entry_id,
          words: editWords,
          sign_language: newSignLanguageUrl,
          is_match: isMatch
        })
      });
      const json = await res.json();
      if (json.status === 200 || json.status === "200") {
        setEditSuccess(isMatch ? "Match found and saved!" : "No match found, but saved!");
        setEditMode(false);
        if (onCardUpdated) {
          onCardUpdated({
            ...card,
            words: editWords,
            sign_language: newSignLanguageUrl
          });
          onClose();
        }
        if (onClose) onClose();
      } else {
        setEditError(json.message || "Failed to save.");
      }
    } catch (e) {
      setEditError("Error saving changes.");
    }
    setEditLoading(false);
    onClose();
  };

  // ARCHIVE/DELETE HANDLER
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(STATUS_UPDATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_id: card.entry_id,
          status: "archived"
        })
      });
      const json = await res.json();
      // Accept both 200 and 201 as success
      if (json.status === 200 || json.status === "200" || json.status === 201 || json.status === "201") {
        setPopup({ open: true, message: "Card archived successfully.", type: "success" });
        setShowConfirm(false);
        setDeleteLoading(false);
        setTimeout(() => {
          setPopup({ open: false, message: "", type: "info" });
          if (onCardUpdated) onCardUpdated({ ...card, status: "archived" });
          onClose();
        }, 1200);
        return;
      } else {
        setPopup({ open: true, message: json.message || "Failed to archive.", type: "error" });
      }
    } catch (e) {
      setPopup({ open: true, message: "Network error archiving card.", type: "error" });
    }
    setDeleteLoading(false);
    setTimeout(() => setPopup({ open: false, message: "", type: "info" }), 2000);
    onClose();
  };

  return (
    <div className="ucd-modal-overlay">
      <div className="ucd-modal" style={{
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        background: 'rgba(255, 255, 255, 0.69)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
        <div className="ucd-modal-header">
          <button className="ucd-back-btn" onClick={onClose} title="Back">
            <MdArrowBack />
          </button>
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ height: 26 }} />
        <div className="ucd-modal-body">
          {/* Centered top word and speak button */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span className="ucd-words" style={{ fontSize: '3.0em', fontWeight: 600, textAlign: 'center' }}>{card.words}</span>
              {!editMode && (
                <button
                  className={`ucd-speak-btn${speaking ? " active" : ""}`}
                  title="Hear aloud"
                  onClick={handleSpeak}
                  style={{ padding: 0, background: 'none', border: 'none', boxShadow: 'none', minWidth: 0, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {speaking ? <MdSpeakerPhone size={60} /> : <RiSpeakerFill size={60} />}
                </button>
              )}
            </div>
          </div>
          <div className="ucd-words-row" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 1 }} />
            <button
              className="ucd-meatball-btn"
              title="More options"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                marginLeft: 0,
                marginRight: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                top: '-40px',
                left: '-100px',
              }}
              onClick={() => setShowMeatballModal(true)}
            >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ padding: 0, margin: 0, display: 'block' }}>
                <circle cx="14" cy="6" r="3.5" fill="#444"/>
                <circle cx="14" cy="14" r="3.5" fill="#444"/>
                <circle cx="14" cy="22" r="3.5" fill="#444"/>
              </svg>
            </button>
            {showMeatballModal && (
              <div
                style={{
                  position: 'absolute',
                  top: (() => {
                    const btn = document.querySelector('.ucd-meatball-btn');
                    if (btn) {
                      const rect = btn.getBoundingClientRect();
                      // Position relative to parent flex row
                      return `${btn.offsetTop + btn.offsetHeight + 8}px`;
                    }
                    return '40px'; // fallback
                  })(),
                  left: (() => {
                    const btn = document.querySelector('.ucd-meatball-btn');
                    if (btn) {
                      return `${btn.offsetLeft - 120}px`;
                    }
                    return '60vw'; // fallback
                  })(),
                  minWidth: 0,
                  width: 180,
                  background: '#fff',
                  borderRadius: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  padding: '0.5em 0.7em',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  fontFamily: 'inherit',
                  fontSize: '1.08em',
                  border: '1px solid #1C2E4A', // updated border color
                  zIndex: 3003,
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1.08em',
                    color: '#334E7B',
                    textAlign: 'left',
                    padding: '0.5em 0.2em',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onClick={() => { setShowMeatballModal(false); handleEdit(); }}
                >
                  Edit Text
                </button>
                <hr style={{ border: 'none', borderTop: '1px solid #334E7B', margin: '0.3em 0 0.2em 0' }} />
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1.08em',
                    color: '#334E7B',
                    textAlign: 'left',
                    padding: '0.5em 0.2em',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onClick={() => { setShowMeatballModal(false); setShowConfirm(true); }}
                  disabled={deleteLoading}
                >
                  Archive
                </button>
              </div>
            )}
          </div>
          {/* Meatball Modal */}
          <div className="ucd-media-row">
            {(() => {
              const isVideo = (editMode ? card.sign_language : card.sign_language) && (card.sign_language || "").toLowerCase().endsWith(".mp4");
              const mediaUrl = card.sign_language
                ? card.sign_language.startsWith("http")
                  ? card.sign_language
                  : `/media/${card.sign_language}`
                : null;
              if (mediaUrl) {
                if (isVideo) {
                  return (
                    <div className="ucd-video-controls">
                      <div className="ucd-media-square">
                        <video
                          ref={videoRef}
                          src={mediaUrl}
                          controls
                          className="ucd-media-content"
                          style={{ width: '100%', height: '540px', maxHeight: '48vw', borderRadius: 5, objectFit: 'cover', background: '#e9eef7' }}
                        />
                      </div>
                      <div className="ucd-prev-next-row">
                        <button
                          className="ucd-prevnext-btn"
                          onClick={onPrev}
                          disabled={!hasPrev}
                        >
                          Previous
                        </button>
                        <button
                          className="ucd-prevnext-btn"
                          onClick={onNext}
                          disabled={!hasNext}
                          style={{ marginLeft: "6%" }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <>
                      <div className="ucd-media-square">
                        <img
                          src={mediaUrl}
                          alt={card.words}
                          className="ucd-media-content"
                        />
                      </div>
                      <div className="ucd-prev-next-row">
                        <button
                          className="ucd-prevnext-btn"
                          onClick={onPrev}
                          disabled={!hasPrev}
                        >
                          Previous
                        </button>
                        <button
                          className="ucd-prevnext-btn"
                          onClick={onNext}
                          disabled={!hasNext}
                          style={{ marginLeft: "6%" }}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  );
                }
              } else {
                return (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.2em' }}>
                      <div style={{ color: "#334E7B", fontFamily: 'Roboto Mono, monospace', fontWeight: '800', textAlign: "center", fontSize: '1.4em', marginBottom: '0.8em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6em' }}>
                        No media available yet, please wait for future's updates
                        <svg width="36" height="36" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
                          <rect x="10" y="18" width="34" height="22" rx="7" fill="#334E7B"/>
                          <rect x="18" y="8" width="18" height="14" rx="6" fill="#7FB3FF"/>
                          <rect x="22" y="2" width="10" height="8" rx="3" fill="#334E7B"/>
                          <circle cx="18.5" cy="29.5" r="2.5" fill="#fff"/>
                          <circle cx="35.5" cy="29.5" r="2.5" fill="#fff"/>
                          <rect x="24" y="36" width="6" height="3" rx="1.5" fill="#fff"/>
                          <rect x="6" y="24" width="4" height="10" rx="2" fill="#7FB3FF"/>
                          <rect x="44" y="24" width="4" height="10" rx="2" fill="#7FB3FF"/>
                        </svg>
                      </div>
                    </div>
                    <div className="ucd-prev-next-row">
                      <button
                        className="ucd-prevnext-btn"
                        onClick={onPrev}
                        disabled={!hasPrev}
                      >
                        Previous
                      </button>
                      <button
                        className="ucd-prevnext-btn"
                        onClick={onNext}
                        disabled={!hasNext}
                        style={{ marginLeft: "6%" }}
                      >
                        Next
                      </button>
                    </div>
                  </>
                );
              }
            })()}
          </div>
          {editMode && (
            <div className="ucd-edit-modal-bg" style={{
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
              <form className="ucd-edit-modal" onSubmit={e => { e.preventDefault(); handleEditSave(); }} style={{
                borderRadius: 20,
                border: '1px solid #1C2E4A',
                background: 'rgba(255, 255, 255, 0.10)',
                boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
                backdropFilter: 'blur(18.3px)',
                WebkitBackdropFilter: 'blur(18.3px)',
                width: '95%',
                maxWidth: 440,
                padding: '2.5em 2.5em 2em 2.5em',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                color: card.is_match === 0 ? '#22314a' : '#fff',
                fontFamily: 'Roboto Mono, monospace',
                alignItems: 'stretch',
                gap: '0.7em',
                position: 'relative',
              }}>
                <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace', color: card.is_match === 0 ? '#334E7B' : '#fff' }}>Edit Card Text</div>
                {editError && <div style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '0.5em', fontSize: '1em' }}>{editError}</div>}
                <label style={{ fontWeight: 800, fontSize: '1.1em', marginBottom: 2, color: card.is_match === 0 ? '#334E7B' : '#fff' }}>Word or Phrase</label>
                <input
                  className="ucd-edit-input"
                  value={editWords}
                  onChange={e => setEditWords(e.target.value)}
                  disabled={editLoading}
                  required
                  style={{
                    background: '#fff',
                    color: '#2563eb',
                    fontWeight: 600,
                    fontSize: '1.1em',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.6em 1em',
                    marginBottom: 8,
                    fontFamily: 'Inconsolata, monospace',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
                  <button
                    type="submit"
                    disabled={editLoading || !editWords.trim()}
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
                    onClick={handleEditCancel}
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
        </div>
      </div>
      {/* Archive Confirmation Modal (glassmorphism style) */}
      {showConfirm && (
        <div className="ucd-edit-modal-bg" style={{
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
          <div className="ucd-edit-modal" style={{
            borderRadius: 20,
            border: '1px solid #1C2E4A',
            background: 'rgba(255, 255, 255, 0.10)',
            boxShadow: '0 0.25rem 2rem rgba(0,0,0,0.18)',
            backdropFilter: 'blur(18.3px)',
            WebkitBackdropFilter: 'blur(18.3px)',
            width: '95%',
            maxWidth: 440,
            padding: '2.5em 2.5em 2em 2.5em',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            color: card.is_match === 0 ? '#22314a' : '#fff',
            fontFamily: 'Roboto Mono, monospace',
            alignItems: 'stretch',
            gap: '0.7em',
            position: 'relative',
          }}>
            <div style={{ fontWeight: 700, fontSize: '2em', textAlign: 'center', marginBottom: '1.2em', fontFamily: 'Inconsolata, monospace', color: card.is_match === 0 ? '#334E7B' : '#fff' }}>
              Confirm Archive
            </div>
            <div style={{ color: card.is_match === 0 ? '#334E7B' : '#fff', textAlign: 'center', marginBottom: '1.2em', fontSize: '1.1em', fontWeight: 800 }}>
              Are you sure you want to archive this card? It will be moved to your archive.
            </div>
            <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{
                  flex: 1,
                  background: '#B91C1C',
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
                {deleteLoading ? 'Archiving...' : 'Archive'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={deleteLoading}
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
      {/* End Archive Confirmation Modal */}
      {/* MessagePopup remains unchanged */}
      <MessagePopup
        open={popup.open}
        title={popup.type === "success" ? "Success!" : popup.type === "error" ? "Error" : "Info"}
        description={popup.message}
        onClose={() => {
          setPopup(p => ({ ...p, open: false }));
          if (popup.type === "success") {
            onClose();
          }
        }}
        style={{ zIndex: 3001 }}
      />
    </div>
  );
}