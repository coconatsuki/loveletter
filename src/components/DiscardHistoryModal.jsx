import React, { useState, useEffect } from "react";
import { cards } from "../utils/cardsData";

// Style constants
const discardHistoryOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
  background: "rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(1px) brightness(0.9)",
};

const discardHistoryModalBase = {
  position: "absolute",
  top: "-15%",
  right: "-30%",
  maxWidth: "500px",
  maxHeight: "550px",
  background: "linear-gradient(145deg, #f4f1e8 0%, #e8dcc0 50%, #d4c4a0 100%)",
  border: "3px solid #8b4513",
  borderRadius: "12px",
  boxShadow:
    "0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.3)",
  zIndex: 1000,
  fontFamily: "'Cinzel', serif",
  transform: "translateX(100%) scale(0.8)",
  opacity: 0,
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  pointerEvents: "none",
  overflow: "hidden",
};

const discardHistoryModalOpen = {
  ...discardHistoryModalBase,
  transform: "translateX(0) scale(1)",
  opacity: 1,
  pointerEvents: "auto",
};

const discardModalHeader = {
  background: "linear-gradient(145deg, #8b4513 0%, #a0522d 100%)",
  color: "#f4f1e8",
  padding: "0.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "2px solid #654321",
  position: "relative",
};

const discardModalTitle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const discardModalClose = {
  background: "none",
  border: "none",
  color: "#f4f1e8",
  fontSize: "1.4rem",
  fontWeight: "bold",
  cursor: "pointer",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

const discardModalContent = {
  padding: "0.5rem",
  maxHeight: "320px",
  overflowY: "auto",
};

const discardPlayerSelect = {
  width: "100%",
  padding: "8px 12px",
  border: "2px solid #8b4513",
  borderRadius: "6px",
  background: "#fff",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  color: "#333",
  marginBottom: "16px",
  cursor: "pointer",
};

const discardCardsList = {
  /* minHeight: "60px", */
};

const discardCardsColumn = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  fontSize: "0.9rem",
  color: "#654321",
  lineHeight: "1.6",
  fontWeight: 500,
};

const discardCardItem = {
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "8px",
  gap: "8px",
};

const discardCardBullet = {
  color: "#8b4513",
  fontSize: "1rem",
  minWidth: "12px",
  flexShrink: 0,
  marginTop: "2px",
};

const discardCardsEmpty = {
  color: "#666",
  fontStyle: "italic",
  textAlign: "center",
  padding: "0.5rem",
  fontSize: "0.9rem",
};

export default function DiscardHistoryModal({
  isOpen,
  onClose,
  players,
  roomData,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState("");

  // Helper function to get card count based on game mode
  const getCardCount = (cardId, gameMode) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return 0;
    return gameMode === "premium" ? card.countPremium : card.countNormal;
  };

  // Get players in grid order with discard info
  const playersWithDiscardInfo = Object.entries(players).map(
    ([nickname, playerData]) => {
      const hasDiscard = playerData.discard && playerData.discard.length > 0;
      const displayName = playerData.realName
        ? `${playerData.name} (${playerData.realName})`
        : playerData.name;

      return {
        nickname,
        displayName,
        hasDiscard,
        discard: playerData.discard || [],
        playerData,
      };
    }
  );

  // Set first player with discard as default, or first player if none have discard
  useEffect(() => {
    if (isOpen && playersWithDiscardInfo.length > 0) {
      // Only set default if no player is selected or if modal is opening fresh
      if (!selectedPlayer) {
        const firstWithDiscard = playersWithDiscardInfo.find(
          (p) => p.hasDiscard
        );
        const defaultPlayer = firstWithDiscard || playersWithDiscardInfo[0];
        setSelectedPlayer(defaultPlayer.nickname);
      }
    }
    // Reset when modal closes
    if (!isOpen) {
      setSelectedPlayer("");
    }
  }, [isOpen]); // Only depend on isOpen

  const selectedPlayerData = playersWithDiscardInfo.find(
    (p) => p.nickname === selectedPlayer
  );

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !players || Object.keys(players).length === 0) return null;

  return (
    <>
      {/* Invisible overlay for click outside detection */}
      <div
        style={{
          ...discardHistoryOverlay,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={handleOverlayClick}
      />

      {/* The actual modal */}
      <div style={isOpen ? discardHistoryModalOpen : discardHistoryModalBase}>
        <div style={discardModalHeader}>
          <h3 style={discardModalTitle}>📜 Discard History</h3>
          <button
            style={discardModalClose}
            onClick={onClose}
            aria-label="Close discard history"
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
              e.target.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            ...discardModalContent,
            // Custom scrollbar styles need to be in CSS
            scrollbarWidth: "thin",
            scrollbarColor: "#8b4513 rgba(139, 69, 19, 0.1)",
          }}
        >
          <select
            style={discardPlayerSelect}
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            {playersWithDiscardInfo.map(
              ({ nickname, displayName, hasDiscard }) => (
                <option
                  key={nickname}
                  value={nickname}
                  disabled={!hasDiscard}
                  style={{
                    color: !hasDiscard ? "#999" : "#333",
                    fontStyle: !hasDiscard ? "italic" : "normal",
                  }}
                >
                  {displayName} {!hasDiscard ? "(No cards played)" : ""}
                </option>
              )
            )}
          </select>

          <div style={discardCardsList}>
            {selectedPlayerData && selectedPlayerData.discard.length > 0 ? (
              <ul style={discardCardsColumn}>
                {selectedPlayerData.discard
                  .slice() // Create copy to avoid mutating original
                  .reverse() // Most recent first
                  .map((card, index) => {
                    const cardCount = getCardCount(
                      card.id,
                      roomData?.mode || "normal"
                    );
                    return (
                      <li key={index} style={discardCardItem}>
                        <span style={discardCardBullet}>•</span>
                        <span>
                          {card.name} (str: {card.strength} / count: {cardCount}
                          )
                        </span>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <div style={discardCardsEmpty}>
                📜 This player hasn't discarded any cards yet
              </div>
            )}
          </div>
        </div>

        {/* Ancient parchment texture effect - needs to be in CSS for pseudo-element */}
        <style>{`
          .discard-history-modal::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(160, 82, 45, 0.1) 0%, transparent 50%);
            border-radius: 12px;
            pointer-events: none;
          }

          /* Custom scrollbar styles that can't be in JS */
          .discard-modal-content::-webkit-scrollbar {
            width: 6px;
          }

          .discard-modal-content::-webkit-scrollbar-track {
            background: rgba(139, 69, 19, 0.1);
            border-radius: 3px;
          }

          .discard-modal-content::-webkit-scrollbar-thumb {
            background: #8b4513;
            border-radius: 3px;
          }

          .discard-modal-content::-webkit-scrollbar-thumb:hover {
            background: #654321;
          }
        `}</style>
      </div>
    </>
  );
}
