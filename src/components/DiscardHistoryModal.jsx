import React, { useState, useEffect } from "react";

export default function DiscardHistoryModal({
  isOpen,
  onClose,
  players,
  roomData,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState("");

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
      const firstWithDiscard = playersWithDiscardInfo.find((p) => p.hasDiscard);
      const defaultPlayer = firstWithDiscard || playersWithDiscardInfo[0];
      setSelectedPlayer(defaultPlayer.nickname);
    }
  }, [isOpen, playersWithDiscardInfo]);

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
      <div className="discard-history-overlay" onClick={handleOverlayClick} />

      {/* The actual modal */}
      <div className={`discard-history-modal ${isOpen ? "open" : ""}`}>
        <style>{`
          .discard-history-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999;
            pointer-events: ${isOpen ? "auto" : "none"};
          }

          .discard-history-modal {
            position: absolute;
            top: -20px;
            right: calc(100% + 20px);
            width: 300px;
            max-height: 400px;
            background: linear-gradient(145deg, #f4f1e8 0%, #e8dcc0 50%, #d4c4a0 100%);
            border: 3px solid #8b4513;
            border-radius: 12px;
            box-shadow: 
              0 8px 25px rgba(0, 0, 0, 0.4),
              inset 0 1px 3px rgba(255, 255, 255, 0.3);
            z-index: 1000;
            font-family: 'Cinzel', serif;
            transform: translateX(100%) scale(0.8);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
            overflow: hidden;
          }

          .discard-history-modal.open {
            transform: translateX(0) scale(1);
            opacity: 1;
            pointer-events: auto;
          }

          .discard-modal-header {
            background: linear-gradient(145deg, #8b4513 0%, #a0522d 100%);
            color: #f4f1e8;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #654321;
            position: relative;
          }

          .discard-modal-title {
            font-size: 1.1rem;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .discard-modal-close {
            background: none;
            border: none;
            color: #f4f1e8;
            font-size: 1.4rem;
            font-weight: bold;
            cursor: pointer;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .discard-modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
          }

          .discard-modal-content {
            padding: 16px;
            max-height: 320px;
            overflow-y: auto;
          }

          .discard-player-select {
            width: 100%;
            padding: 8px 12px;
            border: 2px solid #8b4513;
            border-radius: 6px;
            background: #fff;
            font-family: inherit;
            font-size: 0.9rem;
            color: #333;
            margin-bottom: 16px;
            cursor: pointer;
          }

          .discard-player-select option:disabled {
            color: #999;
            font-style: italic;
          }

          .discard-cards-list {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid #b8860b;
            border-radius: 8px;
            padding: 12px;
            min-height: 60px;
          }

          .discard-cards-empty {
            color: #666;
            font-style: italic;
            text-align: center;
            padding: 20px;
            font-size: 0.9rem;
          }

          .discard-cards-text {
            font-size: 0.9rem;
            color: #654321;
            line-height: 1.5;
            font-weight: 500;
            word-wrap: break-word;
          }

          /* Custom scrollbar for the modal */
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

          /* Ancient parchment texture effect */
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
        `}</style>

        <div className="discard-modal-header">
          <h3 className="discard-modal-title">📜 Discard History</h3>
          <button
            className="discard-modal-close"
            onClick={onClose}
            aria-label="Close discard history"
          >
            ✕
          </button>
        </div>

        <div className="discard-modal-content">
          <select
            className="discard-player-select"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            {playersWithDiscardInfo.map(
              ({ nickname, displayName, hasDiscard }) => (
                <option key={nickname} value={nickname} disabled={!hasDiscard}>
                  {displayName} {!hasDiscard ? "(No cards played)" : ""}
                </option>
              )
            )}
          </select>

          <div className="discard-cards-list">
            {selectedPlayerData && selectedPlayerData.discard.length > 0 ? (
              <div className="discard-cards-text">
                {selectedPlayerData.discard
                  .slice() // Create copy to avoid mutating original
                  .reverse() // Most recent first
                  .map((card, index) => `${card.name} (${card.strength})`)
                  .join(", ")}
              </div>
            ) : (
              <div className="discard-cards-empty">
                📜 This player hasn't discarded any cards yet
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
