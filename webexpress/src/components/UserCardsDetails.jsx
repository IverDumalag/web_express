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
      <div className="ucd-modal">
        <div className="ucd-modal-header">
          <button className="ucd-back-btn" onClick={onClose} title="Back">
            <MdArrowBack />
          </button>
          <div style={{ flex: 1 }} />
          {!editMode && (
            <button className="ucd-icon-btn" title="Edit" onClick={handleEdit}>
              <FaEdit />
            </button>
          )}
          <button className="ucd-icon-btn" title="Archive" onClick={() => setShowConfirm(true)} disabled={deleteLoading}>
            <FaTrash />
          </button>
        </div>
        <div className="ucd-modal-body">
          <div className="ucd-words-row">
            {editMode ? (
              <input
                className="ucd-edit-input"
                value={editWords}
                onChange={e => setEditWords(e.target.value)}
                disabled={editLoading}
                style={{ flex: 1, fontSize: "1.1em", marginRight: "2%" }}
              />
            ) : (
              <span className="ucd-words">{card.words}</span>
            )}
            {!editMode && (
              <button
                className={`ucd-speak-btn${speaking ? " active" : ""}`}
                title="Speak"
                onClick={handleSpeak}
              >
                {speaking ? <RiSpeakerFill /> : <MdSpeakerPhone />}
              </button>
            )}
          </div>
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
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={videoDuration}
                        step={0.01}
                        value={videoTime}
                        onChange={handleSliderChange}
                        style={{ width: "100%" }}
                      />
                      <div className="ucd-video-extra-controls">
                        <label style={{ fontSize: "90%" }}>
                          Speed:
                          <select
                            value={playbackRate}
                            onChange={handlePlaybackRateChange}
                            style={{ marginLeft: "4%" }}
                          >
                            <option value={0.5}>0.5x</option>
                            <option value={0.75}>0.75x</option>
                            <option value={1}>1x</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                          </select>
                        </label>
                        <span style={{ float: "right", fontSize: "90%" }}>
                          {Math.floor(videoTime)}/{Math.floor(videoDuration)}s
                        </span>
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
                    <div style={{ color: "#aaa", textAlign: "center" }}>No media available</div>
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
            <div style={{ marginTop: "2em", display: "flex", gap: "1.2em", justifyContent: "center", alignItems: "center", width: "100%" }}>
              <button
                className="ucd-prevnext-btn ucd-save-btn"
                onClick={handleEditSave}
                disabled={editLoading || !editWords.trim()}
                style={{ width: "40%" }}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="ucd-prevnext-btn ucd-cancel-btn"
                onClick={handleEditCancel}
                disabled={editLoading}
                style={{ width: "40%" }}
              >
                Cancel
              </button>
              {editError && <span style={{ color: "red", marginLeft: "2%" }}>{editError}</span>}
              {editSuccess && <span style={{ color: "green", marginLeft: "2%" }}>{editSuccess}</span>}
            </div>
          )}
        </div>
      </div>
      <ConfirmationPopup
        open={showConfirm}
        title="Confirm Archive"
        message="Are you sure you want to archive this card? It will be moved to your archive."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={deleteLoading}
      />
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