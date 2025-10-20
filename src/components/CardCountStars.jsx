import React, { useEffect } from "react";

// CSS styles for card effect formatting
const cardStarsStyles = `/* Card count stars */
.card-count-stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-top: auto;
  padding-top: 4px;
  margin-bottom: 0.3rem;
}

.card-count-star {
  font-size: 0.8rem;
  color: #d72d29;
  text-shadow: 1px 1px 2px rgba(139, 0, 0, 0.6);
  filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.4));
  line-height: 1;
}
  `;

const CardCountStars = ({ count }) => {
  if (count === 0) return null; // Don't show anything if count is 0

  return (
    <>
      <style>{cardStarsStyles}</style>
      <div className="card-count-stars">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="card-count-star">
            ★
          </span>
        ))}
      </div>
    </>
  );
};

export default CardCountStars;
