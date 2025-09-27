import React from "react";
import { cards } from "../utils/cardsData";
import { getCardCount } from "../utils/gamehelpers";
import "./DiscardPilePopover.css";

// Component to display a player's discard pile in a popover
const DiscardPilePopover = ({
  player,
  gameMode,
  isVisible,
  showOnLeft = false,
}) => {
  if (!isVisible || !player) {
    return null;
  }

  const hasDiscardedCards = player.discard && player.discard.length > 0;

  return (
    <div className={`discard-pile-popover ${showOnLeft ? "show-left" : ""}`}>
      <div className="discard-pile-title">{player.name} discard pile</div>
      <div className="discard-pile-content">
        {hasDiscardedCards ? (
          player.discard.map((card, index) => {
            const cardData = cards.find((c) => c.id === card.id);
            const count = getCardCount(card.id, gameMode, cards);

            return (
              <div key={index} className="discard-pile-item">
                <span className="discard-card-name">
                  {cardData?.name || "Unknown"}
                </span>
                <span className="discard-card-details">
                  (Strength: {card.strength}, Count: {count})
                </span>
              </div>
            );
          })
        ) : (
          <div className="discard-pile-empty">(empty)</div>
        )}
      </div>
    </div>
  );
};

export default DiscardPilePopover;
