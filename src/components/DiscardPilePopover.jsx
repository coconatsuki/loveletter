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
  isYou = false,
}) => {
  if (!isVisible || !player) {
    return null;
  }

  const hasDiscardedCards = player.discard && player.discard.length > 0;
  const hasHand = isYou && player.hand && player.hand.length > 0;

  return (
    <div className={`discard-pile-popover ${showOnLeft ? "show-left" : ""}`}>
      {/* Show hand section first if it's the current player */}
      {hasHand && (
        <>
          <div className="discard-pile-title">Your Hand</div>
          <div className="discard-pile-content your-hand-section">
            {player.hand.map((card, index) => {
              const cardData = cards.find((c) => c.id === card.id);
              const count = getCardCount(card.id, gameMode, cards);

              return (
                <div key={`hand-${index}`} className="discard-pile-item">
                  <span className="discard-card-name">
                    {cardData?.name?.toUpperCase() || "Unknown"}
                  </span>
                  <span className="popover-discard-card-details">
                    (Str: {card.strength}, Count: {count})
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Show discard pile section */}
      <div className="discard-pile-title">
        {isYou ? "Your Discard Pile" : `${player.name} Discard Pile`}
      </div>
      <div className="discard-pile-content">
        {hasDiscardedCards ? (
          player.discard.map((card, index) => {
            const cardData = cards.find((c) => c.id === card.id);
            const count = getCardCount(card.id, gameMode, cards);

            return (
              <div key={`discard-${index}`} className="discard-pile-item">
                <span className="discard-card-name">
                  {cardData?.name?.toUpperCase() || "Unknown"}
                </span>
                <span className="popover-discard-card-details">
                  (Str: {card.strength}, Count: {count})
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
