import React from "react";
import "./CardEffectPopover.css";

const CardEffectPopover = ({ card, position, isVisible }) => {
  if (!isVisible || !card?.effectDetails) {
    return null;
  }

  return (
    <div className={`card-effect-popover ${position}`}>
      <div className="card-effect-popover-title">{card.name}</div>
      <div className="card-effect-popover-content">{card.effectDetails}</div>
      {/* Arrow pointing to the card */}
      <div className={`card-effect-popover-arrow ${position}`}></div>
    </div>
  );
};

export default CardEffectPopover;
