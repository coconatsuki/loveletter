import React, { useEffect } from "react";
import { getCardImage } from "../utils/cardsData";
import CardCountStars from "./CardCountStars";

// CSS styles for card effect formatting
const effectTextStyles = `
  .effect-title {
    font-weight: bold;
    font-size: 1.1em;
    color: #d4af37;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    margin: 0 0 1.5em 0;
    text-align: center;
  }

  .effect-player {
    font-weight: bold;
    color: #87ceeb;
  }

  .effect-card {
    font-weight: bold;
    color: #ffd700;
  }

  .effect-strength {
    font-weight: bold;
    color: #ff6b6b;
  }

  .effect-quote {
    font-style: italic;
    color: #daa520;
    margin: 1em 0 0;
    padding: 0.15em;
    border-left: 3px solid #daa520;
    padding-left: 1em;
  }

  .effect-signature {
    font-style: italic;
    text-align: right;
    color: #c0c0c0;
    margin-top: 0.25em;
  }

  .effect-description {
    line-height: 1.5;
    margin-bottom: 0.7em;
    font-size: 1.3rem;
  }

  .effect-description.top {
    margin-top: 0;
  }

  .effect-description.phantom-king, .effect-description.confessor, .effect-description.baroness {
    font-size: 1.2rem;
    text-align: justify;
  }

  .quotation {
    font-style: italic;
    color: rgb(244 135 182);
  }

  .effect-description.justify {
    text-align: justify;
  }

  .quotation.duke {
    color: #dfdf73;
  }

  .effect-warning {
    color: #ff4444;
    font-weight: bold;
  }

  .effect-success {
    color: #44ff44;
    font-weight: bold;
  }

.effect-technical {
    border-top: 1px #dfdf73 dashed;
    padding-top: 1rem;
    margin-top: 1.2rem;
    text-align: center;
    color: #dfdf73;
}
`;

export default function EffectResultModal({
  resultText,
  cardDetails = null,
  selectedCardId = -1, // Should never be -1 if properly called - will help us catch bugs
  role = "unknown", // Should never be "unknown" if properly called - will help us catch bugs
  swappedCards = null, // For Phantom King or Royal Confessor cards-swap details
  isSelfTarget = false, // To identify self-targeting effects (for Royal Confessor)
  princessDiscarded = false, // To indicate if the Princess was eliminated (for Duke)
  onClose,
}) {
  // 🐛 DEBUG: Log props to ensure we never get invalid values
  useEffect(() => {
    console.log("🎭 EffectResultModal mounted with props:", {
      selectedCardId,
      role,
      resultText: resultText?.substring(0, 100) + "...", // Truncate for readability
      hasCardDetails: !!cardDetails,
    });

    // 🚨 Alert us if we get invalid values
    if (
      selectedCardId === -1 ||
      selectedCardId === null ||
      selectedCardId === undefined
    ) {
      console.error(
        "🚨 EffectResultModal: selectedCardId is invalid!",
        selectedCardId
      );
    }
    if (role === "unknown" || role === null || role === undefined) {
      console.error("🚨 EffectResultModal: role is invalid!", role);
    }
  }, [selectedCardId, role, resultText, cardDetails]);
  // Helper function to render HTML text directly (no more markdown conversion needed)
  const formatText = (text) => {
    if (!text) return "";

    // If the text contains HTML tags, render it directly
    if (text.includes("<")) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    // Fallback for plain text (legacy support during transition)
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Effect detection based on selectedCardId (more reliable than text parsing)
  const isHandmaidProtection = selectedCardId === 4;
  const isJesterEffect = selectedCardId === 0;
  const isGuardEffect = selectedCardId === 1;
  const isPriestEffect = selectedCardId === 2;
  const isCourtWhispererEffect = selectedCardId === 12;
  const isInquisitorEffect = selectedCardId === 9;
  const isChamberlainEffect = selectedCardId === 10;
  const isPhantomKingEffect = selectedCardId === 6 && swappedCards;
  const isCountessEffect = selectedCardId === 7;
  const isRoyalConfessorEffect = selectedCardId === 13 && swappedCards;
  const isBaronessEffect = selectedCardId === 15;
  const isBaronessAttacker =
    isBaronessEffect && cardDetails && role === "attacker";
  const isBaronessTarget = isBaronessEffect && role === "target";
  const isDukeEffect = selectedCardId === 16;
  const isPrinceEffect = selectedCardId === 5;
  const isPrinceSelfTarget = isPrinceEffect && isSelfTarget;
  const isPrinceExternalTarget =
    isPrinceEffect && !isSelfTarget && role === "target";
  const isPrinceAttacker =
    isPrinceEffect && role === "attacker" && !isSelfTarget;

  // Court Whisperer: distinguish between attacker and target
  const isCourtWhispererAttacker =
    isCourtWhispererEffect && role === "attacker";
  const isCourtWhispererTarget = isCourtWhispererEffect && role === "target";

  // Priest: distinguish between attacker and target for special styling
  const isPriestAttacker = isPriestEffect && role === "attacker";
  const isPriestTarget = isPriestEffect && role === "target";

  // Extract card information for Priest effect
  let revealedCard = null;
  if (isPriestAttacker && cardDetails) {
    revealedCard = cardDetails["Revealed Card"];
  }

  return (
    <>
      <style>{effectTextStyles}</style>
      <div className="modal" style={modalOverlayStyle}>
        <div
          className="modal-content"
          style={{
            ...modalContentStyle,
            ...(isHandmaidProtection ? handmaidModalStyle : {}),
            ...(isPriestTarget ? priestTargetModalStyle : {}),
            ...(isPriestAttacker ? priestModalStyle : {}),
            ...(isJesterEffect ? jesterModalStyle : {}),
            ...(isCourtWhispererEffect ? courtWhispererModalStyle : {}),
            ...(isPhantomKingEffect ? phantomKingModalStyle : {}),
            ...(isRoyalConfessorEffect ? royalConfessorModalStyle : {}),
            ...(isBaronessEffect ? baronessModalStyle : {}),
            ...(isDukeEffect ? dukeModalStyle : {}),
          }}
        >
          {/* Crown decoration */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              background: isPriestEffect
                ? "rgb(41 17 69)"
                : isJesterEffect
                ? "rgb(22 3 3)"
                : isCourtWhispererEffect
                ? "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)"
                : isPhantomKingEffect
                ? "linear-gradient(135deg, rgb(25, 25, 45) 0%, rgb(74, 144, 226) 100%)"
                : isRoyalConfessorEffect
                ? "linear-gradient(135deg, rgb(101, 67, 33) 0%, rgb(139, 69, 19) 100%)"
                : isBaronessEffect
                ? "linear-gradient(135deg, #4a1625 0%, #2d0e18 100%)"
                : isDukeEffect
                ? "linear-gradient(135deg, rgb(26, 31, 58) 0%, rgb(82 101 205) 100%)"
                : isHandmaidProtection
                ? "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)"
                : "#8b0000",
              border: `3px solid ${
                isPriestEffect
                  ? "#9b59b6"
                  : isJesterEffect
                  ? "#ff6b35"
                  : isCourtWhispererEffect
                  ? "#FF1493"
                  : isPhantomKingEffect
                  ? "rgb(247 105 166)"
                  : isRoyalConfessorEffect
                  ? "#d4af37"
                  : isBaronessEffect
                  ? "#ff69b4"
                  : isDukeEffect
                  ? "#dc143c"
                  : isHandmaidProtection
                  ? "#8bc34a"
                  : "#ffd700"
              }`,
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.6)",
              zIndex: 1001,
            }}
          >
            {isPriestTarget
              ? "👁️"
              : isPriestAttacker
              ? "🔍"
              : isInquisitorEffect
              ? "🕵️"
              : isJesterEffect
              ? "🎭"
              : isCourtWhispererEffect
              ? "💅"
              : isPhantomKingEffect
              ? "👻"
              : isRoyalConfessorEffect
              ? "🕯️"
              : isBaronessEffect
              ? "💄"
              : isDukeEffect
              ? "🐶"
              : isChamberlainEffect
              ? "💰"
              : isHandmaidProtection
              ? "🛡️"
              : isGuardEffect
              ? "⚔️"
              : isPrinceEffect && !princessDiscarded
              ? "🤴"
              : isPrinceEffect && princessDiscarded
              ? "💔"
              : isCountessEffect
              ? "🥀"
              : "📜"}
          </div>
          <h3
            style={getHeaderStyle(
              isHandmaidProtection,
              isPriestEffect,
              isInquisitorEffect,
              isJesterEffect,
              isCourtWhispererEffect,
              isPhantomKingEffect,
              isRoyalConfessorEffect,
              isBaronessEffect,
              isDukeEffect
            )}
          >
            {isPriestEffect
              ? "Priest's Divine Revelation"
              : isInquisitorEffect
              ? "Inquisitor's Investigation"
              : isJesterEffect
              ? "🎪 Jester's Fool's Favor 🎭"
              : isCourtWhispererAttacker
              ? "🪄 A Little Word in the Right Ear…"
              : isCourtWhispererTarget
              ? "📜 Your Name's on Every Scroll!"
              : isCourtWhispererEffect
              ? "💅 Court Whisperer Effect 💅"
              : isPhantomKingEffect
              ? "🍷 The Boozy Benevolence"
              : isRoyalConfessorEffect
              ? "🕯️ The Mutual Confession Ritual"
              : isBaronessEffect
              ? "💄 The Court's Matchmaker"
              : isDukeEffect
              ? "🐾 A Noble Pat and a Loyal Paw 🐾"
              : isHandmaidProtection
              ? "Protected by the Handmaid"
              : isPrinceSelfTarget && !princessDiscarded
              ? "👑✨ ROYAL SELF-REFLECTION! ✨👑"
              : isPrinceExternalTarget && !princessDiscarded
              ? "👑✨ ROYAL DECREE EXECUTED! ✨👑"
              : isPrinceAttacker
              ? "👑✨ ROYAL COMMAND! ✨👑"
              : isPrinceEffect && princessDiscarded && !isPrinceAttacker
              ? "😱💔 ROYAL CATASTROPHE! 💔😱"
              : isCountessEffect
              ? "🥀 The Countess turns away...🪭"
              : "Effect Result"}
          </h3>
          {/* Special Priest Layout with Card Display */}
          {isPriestAttacker && revealedCard ? (
            <div style={priestLayoutStyle}>
              {/* Left side - The revealed card */}
              <div style={priestCardContainerStyle}>
                <div style={priestCardStyle}>
                  <div style={priestCardStrengthStyle}>
                    {revealedCard.strength}
                  </div>
                  <div
                    style={{
                      ...priestCardImageStyle,
                      backgroundImage: `url('/src/img/${getCardImage(
                        revealedCard.name
                      )}')`,
                    }}
                  ></div>
                  <div style={priestCardContentStyle}>
                    <div style={priestCardNameStyle}>{revealedCard.name}</div>
                    <div style={priestCardEffectStyle}>
                      {revealedCard.effect}
                    </div>
                    <CardCountStars count={revealedCard.count} />
                  </div>
                </div>
              </div>

              {/* Right side - The spying message */}
              <div style={priestMessageContainerStyle}>
                <div style={priestMessageIconStyle}>
                  <div style={priestMessageStyle}>{formatText(resultText)}</div>
                </div>
                <div
                  style={{
                    ...buttonContainerStyle,
                    ...priestButtonContainerStyle,
                  }}
                >
                  <button
                    onClick={onClose}
                    style={{
                      ...buttonStyle,
                      ...(isPriestEffect && priestButtonStyle),
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#ffd700";
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(106, 76, 147) 0%, rgb(74, 0, 40) 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.7)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(74, 0, 40) 0%, rgb(106, 76, 147) 100%)";
                      e.target.style.transform = "translateY(0px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.5)";
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : isPhantomKingEffect && swappedCards ? (
            /* Special Phantom King Layout with Card Swap Display */
            <div style={phantomKingLayoutStyle}>
              {/* Left side - The swapped cards */}
              <div style={phantomKingCardsContainerStyle}>
                <div style={phantomKingCardRowStyle}>
                  {/* Card given away */}
                  <div style={phantomCardContainerStyle}>
                    <div style={phantomKingCardStyle}>
                      <div style={phantomKingCardStrengthStyle}>
                        {role === "attacker"
                          ? swappedCards.attackerGave.strength
                          : swappedCards.targetGave.strength}
                      </div>
                      <div
                        style={{
                          ...phantomKingCardImageStyle,
                          backgroundImage: `url(/src/img/${getCardImage(
                            role === "attacker"
                              ? swappedCards.attackerGave.name
                              : swappedCards.targetGave.name
                          )})`,
                        }}
                      ></div>
                      <div style={phantomKingCardNameStyle}>
                        {role === "attacker"
                          ? swappedCards.attackerGave.name
                          : swappedCards.targetGave.name}
                      </div>
                      <div style={phantomKingCardEffectStyle}>
                        {role === "attacker"
                          ? swappedCards.attackerGave.effect
                          : swappedCards.targetGave.effect}
                      </div>
                      <CardCountStars
                        count={
                          role === "attacker"
                            ? swappedCards.attackerGave.count
                            : swappedCards.targetGave.count
                        }
                      />
                    </div>
                    <p style={cardLabelStyle}>You Gave</p>
                  </div>

                  <div style={phantomKingArrowStyle}>↔️</div>

                  {/* Card received */}
                  <div style={phantomCardContainerStyle}>
                    <div style={phantomKingCardStyle}>
                      <div style={phantomKingCardStrengthStyle}>
                        {role === "attacker"
                          ? swappedCards.attackerReceived.strength
                          : swappedCards.targetReceived.strength}
                      </div>
                      <div
                        style={{
                          ...phantomKingCardImageStyle,
                          backgroundImage: `url(/src/img/${getCardImage(
                            role === "attacker"
                              ? swappedCards.attackerReceived.name
                              : swappedCards.targetReceived.name
                          )})`,
                        }}
                      ></div>
                      <div style={phantomKingCardNameStyle}>
                        {role === "attacker"
                          ? swappedCards.attackerReceived.name
                          : swappedCards.targetReceived.name}
                      </div>
                      <div style={phantomKingCardEffectStyle}>
                        {role === "attacker"
                          ? swappedCards.attackerReceived.effect
                          : swappedCards.targetReceived.effect}
                      </div>
                      <CardCountStars
                        count={
                          role === "attacker"
                            ? swappedCards.attackerReceived.count
                            : swappedCards.targetReceived.count
                        }
                      />
                    </div>
                    <p style={cardLabelStyle}>You Received</p>
                  </div>
                </div>
              </div>

              {/* Right side - The ghostly message */}
              <div style={phantomKingMessageContainerStyle}>
                <div style={phantomKingMessageStyle}>
                  {formatText(resultText)}
                </div>
                <div
                  style={{
                    ...buttonContainerStyle,
                    ...phantomKingButtonContainerStyle,
                  }}
                >
                  <button
                    onClick={onClose}
                    style={{
                      ...buttonStyle,
                      ...phantomKingButtonStyle,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#1e3d59";
                      e.target.style.background =
                        "linear-gradient(135deg, #74b9ff 0%, #c2d9ff 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(74, 144, 226, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#c2d9ff";
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(30, 30, 60) 0%, rgb(74, 144, 226) 100%)";
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : isRoyalConfessorEffect && swappedCards ? (
            /* Special Royal Confessor Layout with Card Swap Display */
            <div style={royalConfessorLayoutStyle}>
              {/* Left side - The swapped cards */}
              <div style={royalConfessorCardsContainerStyle}>
                <div style={royalConfessorCardRowStyle}>
                  {/* Card given away */}
                  <div style={royalConfessorCardContainerStyle}>
                    <div style={royalConfessorCardStyle}>
                      <div style={royalConfessorCardStrengthStyle}>
                        {swappedCards.targetGave.strength}
                      </div>
                      <div
                        style={{
                          ...royalConfessorCardImageStyle,
                          backgroundImage: `url(/src/img/${getCardImage(
                            swappedCards.targetGave.name
                          )})`,
                        }}
                      ></div>
                      <div style={royalConfessorCardNameStyle}>
                        {swappedCards.targetGave.name}
                      </div>
                      <div style={royalConfessorCardEffectStyle}>
                        {swappedCards.targetGave.effect}
                      </div>
                    </div>
                    <p style={royalConfessorCardLabelStyle}>You Gave</p>
                  </div>

                  <div style={royalConfessorArrowStyle}>⇄</div>

                  {/* Card received */}
                  <div style={royalConfessorCardContainerStyle}>
                    <div style={royalConfessorCardStyle}>
                      <div style={royalConfessorCardStrengthStyle}>
                        {swappedCards.targetReceived.strength}
                      </div>
                      <div
                        style={{
                          ...royalConfessorCardImageStyle,
                          backgroundImage: `url(/src/img/${getCardImage(
                            swappedCards.targetReceived.name
                          )})`,
                        }}
                      ></div>
                      <div style={royalConfessorCardNameStyle}>
                        {swappedCards.targetReceived.name}
                      </div>
                      <div style={royalConfessorCardEffectStyle}>
                        {swappedCards.targetReceived.effect}
                      </div>
                    </div>
                    <p style={royalConfessorCardLabelStyle}>You Received</p>
                  </div>
                </div>
              </div>

              {/* Right side - The confession message */}
              <div style={royalConfessorMessageContainerStyle}>
                <div style={royalConfessorMessageStyle}>
                  {formatText(resultText)}
                </div>
                <div
                  style={{
                    ...buttonContainerStyle,
                    ...royalConfessorButtonContainerStyle,
                  }}
                >
                  <button
                    onClick={onClose}
                    style={{
                      ...buttonStyle,
                      ...royalConfessorButtonStyle,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#2a1a0a";
                      e.target.style.background =
                        "linear-gradient(135deg, #f4e5c2 0%, #d4af37 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(212, 175, 55, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#f4e5c2";
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(42, 20, 8) 0%, rgb(139, 69, 19) 100%)";
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : isBaronessAttacker && cardDetails ? (
            /* Special Baroness Layout with Revealed Cards Display */
            <div style={baronessLayoutStyle}>
              {/* Left side - The revealed cards */}
              <div style={baronessCardsContainerStyle}>
                <div style={baronessCardRowStyle}>
                  {/* Target 1's card */}
                  <div style={baronessCardContainerStyle}>
                    <div style={baronessCardStyle}>
                      <div style={phantomKingCardStrengthStyle}>
                        {cardDetails.target1Card.strength}
                      </div>
                      <div
                        style={{
                          ...phantomKingCardImageStyle,
                          backgroundImage: `url(/src/img/${getCardImage(
                            cardDetails.target1Card.name
                          )})`,
                        }}
                      ></div>
                      <div style={phantomKingCardNameStyle}>
                        {cardDetails.target1Card.name}
                      </div>
                      <div style={phantomKingCardEffectStyle}>
                        {cardDetails.target1Card.effect}
                      </div>
                    </div>
                    <p style={baronessCardLabelStyle}>
                      {cardDetails.target1Name}'s ally
                    </p>
                  </div>

                  {/* Target 2's card (if exists) */}
                  {cardDetails.target2Card && (
                    <div style={baronessCardContainerStyle}>
                      <div style={baronessCardStyle}>
                        <div style={phantomKingCardStrengthStyle}>
                          {cardDetails.target2Card.strength}
                        </div>
                        <div
                          style={{
                            ...phantomKingCardImageStyle,
                            backgroundImage: `url(/src/img/${getCardImage(
                              cardDetails.target2Card.name
                            )})`,
                          }}
                        ></div>
                        <div style={phantomKingCardNameStyle}>
                          {cardDetails.target2Card.name}
                        </div>
                        <div style={phantomKingCardEffectStyle}>
                          {cardDetails.target2Card.effect}
                        </div>
                      </div>
                      <p style={baronessCardLabelStyle}>
                        {cardDetails.target2Name}'s ally
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - The romantic message */}
              <div style={baronessMessageContainerStyle}>
                <div style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                  {formatText(resultText)}
                </div>
                <div style={buttonContainerStyle}>
                  <button
                    onClick={onClose}
                    style={{
                      ...buttonStyle,
                      background:
                        "linear-gradient(135deg, #c2185b 0%, #e91e63 100%)",
                      color: "#fff",
                      border: "2px solid #ff69b4",
                      boxShadow: "0 4px 12px rgba(233, 30, 99, 0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background =
                        "linear-gradient(135deg, #e91e63 0%, #f06292 100%)";
                      e.target.style.color = "#fff";
                      e.target.style.borderColor = "#ffb6c1";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 18px rgba(233, 30, 99, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        "linear-gradient(135deg, #c2185b 0%, #e91e63 100%)";
                      e.target.style.color = "#fff";
                      e.target.style.borderColor = "#ff69b4";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(233, 30, 99, 0.4)";
                    }}
                  >
                    ☕ Continue
                  </button>
                </div>
              </div>
            </div>
          ) : isBaronessTarget ? (
            /* Special Baroness Target Layout - Simple romantic themed message */
            <div
              style={{
                padding: "1.5rem",
                color: "#ffe4e6",
                fontFamily: "Lora, serif",
                textAlign: "justify",
              }}
            >
              <div
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                  marginBottom: "2rem",
                }}
              >
                {formatText(resultText)}
              </div>
              <div style={buttonContainerStyle}>
                <button
                  onClick={onClose}
                  style={{
                    ...buttonStyle,
                    background:
                      "linear-gradient(135deg, rgb(96 34 119) 0%, rgb(238 112 149) 100%)",
                    color: "#fff",
                    border: "2px solid #ff69b4",
                    boxShadow: "0 4px 12px rgba(233, 30, 99, 0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg, rgb(238 112 149) 0%, rgb(96 34 119) 100%)";
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = "#ffb6c1";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 18px rgba(233, 30, 99, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg, rgb(96 34 119) 0%, rgb(238 112 149) 100%)";
                    e.target.style.color = "#fff";
                    e.target.style.borderColor = "#ff69b4";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(233, 30, 99, 0.4)";
                  }}
                >
                  💋 Continue
                </button>
              </div>
            </div>
          ) : (
            <div style={getMessageStyle(isCourtWhispererEffect, isDukeEffect)}>
              {formatText(resultText)}
              <div
                style={{
                  ...buttonContainerStyle,
                }}
              >
                <button
                  onClick={onClose}
                  style={{
                    ...buttonStyle,
                    ...(isHandmaidProtection ? handmaidButtonStyle : {}),
                    ...(isJesterEffect ? jesterButtonStyle : {}),
                    ...(isCourtWhispererEffect
                      ? courtWhispererButtonStyle
                      : {}),
                    ...(isDukeEffect ? dukeButtonStyle : {}),
                    ...(isPriestTarget ? priestButtonStyle : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (isJesterEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, #0017a2 0%, #c24e16 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 107, 53, 0.6)";
                      e.target.style.border = "2px solid rgb(45, 27, 27)";
                    } else if (isCourtWhispererEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(255 205 212) 0%, rgb(202 75 139) 50%, rgb(99 9 57) 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 20, 147, 0.6)";
                      e.target.style.border = "2px solid #FF69B4";
                    } else if (isDukeEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, #dc143c 0%, #1a1f3a 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(220, 20, 60, 0.6)";
                      e.target.style.border = "2px solid #f0f8ff";
                    } else if (isHandmaidProtection) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(46 116 50) 0%,rgb(11 28 11)  100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(76, 175, 80, 0.5)";
                    } else if (isPriestTarget) {
                      e.target.style.color = "#ffd700";
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(106, 76, 147) 0%, rgb(74, 0, 40) 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.7)";
                    } else {
                      e.target.style.background =
                        "linear-gradient(135deg, #fff 0%, #ffd700 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isJesterEffect) {
                      e.target.style.background = "rgb(22 3 3)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(255, 107, 53, 0.4)";
                      e.target.style.color = "rgb(255, 215, 0)";
                      e.target.style.border = "2px solid rgb(106 92 48)";
                    } else if (isCourtWhispererEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(99 9 57) 0%, rgb(202 75 139) 50%, rgb(255 205 212) 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(255, 20, 147, 0.4)";
                      e.target.style.color = "white";
                      e.target.style.border = "2px solid #FF1493";
                    } else if (isDukeEffect) {
                      e.target.style.background =
                        "linear-gradient(135deg, #1a1f3a 0%, #dc143c 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(220, 20, 60, 0.4)";
                      e.target.style.color = "#f0f8ff";
                      e.target.style.border = "2px solid #dc143c";
                    } else if (isHandmaidProtection) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(0, 0, 0, 0.4)";
                    } else if (isPriestTarget) {
                      e.target.style.background =
                        "linear-gradient(135deg, rgb(74, 0, 40) 0%, rgb(106, 76, 147) 100%)";
                      e.target.style.transform = "translateY(0px)";
                      e.target.style.boxShadow =
                        "0 6px 25px rgba(255, 215, 0, 0.5)";
                    } else {
                      e.target.style.background =
                        "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 15px rgba(0, 0, 0, 0.4)";
                    }
                  }}
                >
                  {isJesterEffect
                    ? "🎪✨ Marvelous! ✨🎭"
                    : isCourtWhispererEffect
                    ? "💅✨ Fabulous Gossip! ✨💋"
                    : isDukeEffect
                    ? "Thanks, your grace! 🙏🏼"
                    : isHandmaidProtection
                    ? "🍰✨ Very Well ✨🫖"
                    : "Continue"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Enhanced royal styling
const modalOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(8px) brightness(0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  animation: "effectModalFadeIn 0.3s ease-out",
};

const modalContentStyle = {
  background: "linear-gradient(135deg, #2d1b1b 0%, #4a0000 50%, #8b0000 100%)",
  padding: "0",
  borderRadius: "20px",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)",
  maxWidth: "900px",
  width: "75%",
  textAlign: "center",
  border: "4px solid #ffd700",
  position: "relative",
  fontFamily: '"Cinzel", serif',
  animation: "effectModalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
};

const handmaidModalStyle = {
  background: "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)",
  border: "4px solid #8bc34a",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(139, 195, 74, 0.4), inset 0 1px 0 rgba(139, 195, 74, 0.3)",
};

// 🎭 Jester Modal Style - Colorful and joyful! 🎪
const jesterModalStyle = {
  background:
    "linear-gradient(135deg, #ff6b35 0%, #ffa500 30%, #ffcc00 70%, #ff6b35 100%)",
  border: "4px solid #ff6b35",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(255, 107, 53, 0.6), inset 0 1px 0 rgba(255, 204, 0, 0.4)",
};

// Define headerStyle as a function that takes parameters
const getHeaderStyle = (
  isHandmaidProtection,
  isPriestEffect,
  isInquisitorEffect,
  isJesterEffect,
  isCourtWhispererEffect,
  isPhantomKingEffect,
  isRoyalConfessorEffect,
  isBaronessEffect,
  isDukeEffect
) => ({
  background: isPriestEffect
    ? "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)"
    : isJesterEffect
    ? "linear-gradient(135deg, #0017a2 0%, #c24e16 100%)"
    : isCourtWhispererEffect
    ? "linear-gradient(135deg, rgb(99 9 57) 0%, rgb(202 75 139) 50%, rgb(255 205 212) 100%)"
    : isHandmaidProtection
    ? "linear-gradient(135deg, rgb(15 44 15) 0%, rgb(46, 125, 50) 100%)"
    : isInquisitorEffect
    ? "linear-gradient(135deg, rgb(26, 26, 46) 0%, rgb(22, 33, 62) 50%, rgb(15, 52, 96) 100%)"
    : isPhantomKingEffect
    ? "linear-gradient(135deg, rgb(0 0 14) 0%, rgb(10 23 39) 100%)"
    : isRoyalConfessorEffect
    ? "linear-gradient(135deg, rgb(42, 20, 8) 0%, rgb(101, 67, 33) 50%, rgb(139, 69, 19) 100%)"
    : isBaronessEffect
    ? "linear-gradient(135deg, #4a1625 0%, #2d0e18 50%, #1a0a10 100%)"
    : isDukeEffect
    ? "linear-gradient(135deg, #1a1f3a 0%, #2c1810 50%, #dc143c 100%)"
    : "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
  color: isCourtWhispererEffect
    ? "rgb(242 242 242)"
    : isPhantomKingEffect
    ? "rgb(247 105 166)"
    : isRoyalConfessorEffect
    ? "#f4e5c2"
    : isBaronessEffect
    ? "#ffe4e6"
    : isDukeEffect
    ? "#f0f8ff"
    : "#ffd700",
  margin: "0",
  padding: "35px 25px 15px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: isCourtWhispererEffect
    ? "2px 2px 4px rgba(139, 0, 0, 0.8)"
    : "2px 2px 4px rgba(0, 0, 0, 0.8)",
  borderBottom: `2px solid ${
    isPriestEffect
      ? "#9b59b6"
      : isCourtWhispererEffect
      ? "#FF1493"
      : isHandmaidProtection
      ? "rgb(139, 195, 74)"
      : isPhantomKingEffect
      ? "rgb(247 105 166)"
      : isDukeEffect
      ? "#dc143c"
      : "#ffd700"
  }`,
  borderRadius: "20px 17px 0 0",
  position: "relative",
});

const getMessageStyle = (isCourtWhispererEffect, isDukeEffect) => ({
  fontSize: "1.3rem",
  textAlign: "justify",
  lineHeight: "1.6",
  color: isCourtWhispererEffect ? "#faebd7" : "white",
  margin: "0",
  padding: "25px",
  background: isDukeEffect
    ? "linear-gradient(135deg, rgb(19 25 52) 0%, rgb(51 73 190) 100%)"
    : "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)",
  fontFamily: '"Lora", serif',
  borderRadius: "0 0 20px 20px",
});

const classicResultTextContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
};

const cardDetailsStyle = {
  margin: "0",
  padding: "20px 25px",
  background: "linear-gradient(135deg, #f0ead6 0%, #e8dcc0 100%)",
  textAlign: "left",
  borderTop: "2px solid #d4af37",
  borderBottom: "2px solid #d4af37",
  fontFamily: '"Lora", serif',
};

const buttonContainerStyle = {
  display: "flex",
  padding: "15px 25px 0",
  marginTop: "1rem",
  borderRadius: "0 0 20px 20px",
  justifyContent: "center",
};

const buttonStyle = {
  padding: "12px 24px",
  fontSize: "1.2rem",
  background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
  color: "#8b0000",
  border: "2px solid #8b4513",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
  minWidth: "140px",
  width: "55%",
};

const handmaidButtonStyle = {
  width: "70%",
  background: "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)",
  color: "rgb(255, 215, 0)",
  border: "2px solid #8bc34a",
};

const jesterButtonStyle = {
  width: "55%",
  background: "rgb(22 3 3)",
  color: "rgb(255, 215, 0)",
  border: "2px solid rgb(106 92 48)",
  fontWeight: "700",
};

const courtWhispererButtonStyle = {
  width: "60%",
  background:
    "linear-gradient(135deg, rgb(99 9 57) 0%, rgb(202 75 139) 50%, rgb(255 205 212) 100%)",
  color: "white",
  border: "2px solid #FF1493",
  fontWeight: "700",
  textShadow: "1px 1px 2px rgba(139, 0, 0, 0.8)",
};

// �🐕 Duke Button Style - Royal noble theme
const dukeButtonStyle = {
  width: "65%",
  background: "linear-gradient(135deg, #1a1f3a 0%, #dc143c 100%)",
  color: "#f0f8ff",
  border: "2px solid #dc143c",
  fontWeight: "700",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
  fontFamily: "Cinzel, serif",
};

// �🗣️ Court Whisperer Modal Style - Gossip magazine theme! 💅📰
const courtWhispererModalStyle = {
  background:
    "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 25%, #FFC0CB 50%, #FFEFD5 75%, #FF69B4 100%)",
  border: "4px solid #FF1493",
  boxShadow:
    "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(255, 20, 147, 0.6), inset 0 1px 0 rgba(255, 105, 180, 0.4)",
};

// Priest-specific modal styles
const priestModalStyle = {
  width: "90%",
  maxWidth: "800px",
  background:
    "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 50%, rgb(139, 0, 0) 100%)",
  border: "4px solid #9b59b6",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(155, 89, 182, 0.4)",
};

// Priest TARGET-specific modal styles - Holy Revelation theme
const priestTargetModalStyle = {
  width: "90%",
  maxWidth: "80%",
  background: "linear-gradient(135deg, #8b0051 0%, #4a0028 50%, #2a0015 100%)",
  border: "4px solid rgb(155, 89, 182)",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 249, 196, 0.3)",
};

const priestLayoutStyle = {
  display: "flex",
  gap: "30px",
  alignItems: "flex-start",
  margin: "3% 0",
  justifyContent: "space-around",
  height: "100%",
};

const priestCardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "30%",
  height: "100%",
};

const priestCardStyle = {
  position: "relative",
  backgroundColor: "white",
  borderRadius: "8px",
  width: "200px",
  height: "330px",
  display: "flex",
  flexDirection: "column",
  cursor: "default",
  boxShadow:
    "0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(255, 215, 0, 0.4)",
  transition: "all 0.2s ease",
  transform: "perspective(1000px) rotateY(-3deg) rotateX(2deg)",
};

const priestCardStrengthStyle = {
  position: "absolute",
  top: "-10px",
  left: "-10px",
  background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
  color: "#007bff",
  borderRadius: "50%",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "1.1rem",
  fontFamily: '"Cinzel", serif',
  border: "3px solid #8b4513",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
  zIndex: 10,
  margin: "0",
};

const priestCardImageStyle = {
  width: "initial%",
  height: "60%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  margin: "0",
  border: "2px solid #d4af37",
  borderRadius: "8px 8px 0 0",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
};

const priestCardContentStyle = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  height: "40%",
};

const priestCardNameStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "#8b0000",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  fontFamily: '"Cinzel", serif',
  margin: "3% 0",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const priestCardEffectStyle = {
  padding: "0 4%",
  fontWeight: "300",
  fontSize: "1rem",
  lineHeight: "1.3",
  color: "#3a2a1a",
  textAlign: "justify",
  fontFamily: '"Lora", serif',
  fontStyle: "italic",
};

const priestMessageContainerStyle = {
  width: "55%",
  height: "-webkit-fill-available",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  textAlign: "center",
};

const priestMessageIconStyle = {
  display: "flex",
  flexDirection: "column",
};

const priestMessageStyle = {
  fontSize: "1.2rem",
  color: "#e6d7b0",
  lineHeight: "1.6",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  fontFamily: '"Lora", serif',
};

const priestButtonContainerStyle = {
  background: "initial",
  width: "100%",
  padding: "0",
};

const priestButtonStyle = {
  background:
    "linear-gradient(135deg, rgb(74, 0, 40) 0%, rgb(106, 76, 147) 100%)",
  color: "#ffd700",
  transition: "all 0.3s ease",
  width: "70%",
};

// Add the animation CSS (this would normally be in a CSS file)
const priestGlowAnimation = `
@keyframes priestGlow {
  0% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 10px rgba(155, 89, 182, 0.3));
  }
  100% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 20px rgba(155, 89, 182, 0.6));
  }
}
`;

// Phantom King-specific modal styles (ghostly atmosphere)
const phantomKingModalStyle = {
  width: "80%",
  maxWidth: "80%",
  background:
    "linear-gradient(135deg, rgb(25, 25, 45) 0%, rgb(30, 30, 60) 50%, rgb(15, 15, 35) 100%)",
  border: "4px solid rgb(247 105 166)",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(74, 144, 226, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
};

const phantomKingLayoutStyle = {
  display: "flex",
  gap: "2rem",
  alignItems: "flex-start",
  padding: "2rem 1rem",
  justifyContent: "space-between",
  height: "100%",
};

const phantomKingCardsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "47%",
  height: "-webkit-fill-available",
  gap: "15px",
};

const phantomKingCardRowStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "-webkit-fill-available",
};

const phantomCardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "-webkit-fill-available",
  justifyContent: "space-between",
};

const phantomKingCardStyle = {
  position: "relative",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "8px",
  width: "180px",
  height: "280px",
  display: "flex",
  flexDirection: "column",
  cursor: "default",
  boxShadow:
    "0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(74, 144, 226, 0.4)",
  transition: "all 0.3s ease",
  transform: "perspective(1000px) rotateY(-2deg) rotateX(1deg)",
  border: "2px solid rgba(74, 144, 226, 0.3)",
};

const cardLabelStyle = {
  width: "100%",
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.95)",
  margin: "0",
  marginTop: "0.7rem",
  fontWeight: "500",
  fontSize: "1.2rem",
};

const phantomKingArrowStyle = {
  fontSize: "2rem",
  color: "#4a90e2",
  filter:
    "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 15px rgba(74, 144, 226, 0.8))",
  animation: "ghostlyFloat 3s ease-in-out infinite alternate",
};

const phantomKingCardStrengthStyle = {
  position: "absolute",
  top: "-10px",
  left: "-10px",
  background: "linear-gradient(135deg, #4a90e2 0%, #74b9ff 100%)",
  color: "white",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "1rem",
  fontFamily: '"Cinzel", serif',
  border: "3px solid #1e3d59",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
  zIndex: 10,
};

const phantomKingCardImageStyle = {
  width: "100%",
  height: "60%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  border: "2px solid rgba(74, 144, 226, 0.4)",
  borderRadius: "8px 8px 0 0",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
};

const phantomKingCardNameStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  color: "#1e3d59",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  fontFamily: '"Cinzel", serif',
  margin: "3% 0",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const phantomKingCardEffectStyle = {
  padding: "0 4%",
  fontWeight: "300",
  fontSize: "0.9rem",
  lineHeight: "1.3",
  color: "#3a2a1a",
  textAlign: "justify",
  fontFamily: '"Lora", serif',
  fontStyle: "italic",
};

const phantomKingMessageContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  textAlign: "center",
  height: "-webkit-fill-available",
};

const phantomKingMessageStyle = {
  fontSize: "1.2rem",
  color: "#c2d9ff",
  lineHeight: "1.6",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  fontFamily: '"Lora", serif',
};

const phantomKingButtonContainerStyle = {
  background: "initial",
  width: "100%",
  padding: "0",
};

const phantomKingButtonStyle = {
  background:
    "linear-gradient(135deg, rgb(30, 30, 60) 0%, rgb(74, 144, 226) 100%)",
  color: "#c2d9ff",
  transition: "all 0.3s ease",
  width: "70%",
  border: "2px solid rgba(74, 144, 226, 0.6)",
};

// Royal Confessor-specific modal styles (religious/church atmosphere)
const royalConfessorModalStyle = {
  width: "85%",
  maxWidth: "85%",
  background:
    "linear-gradient(135deg, rgb(20, 10, 5) 0%, rgb(42, 20, 8) 50%, rgb(65, 35, 15) 100%)",
  border: "4px solid #d4af37",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(212, 175, 55, 0.6), inset 0 1px 0 rgba(244, 229, 194, 0.1)",
};

const royalConfessorLayoutStyle = {
  display: "flex",
  gap: "2rem",
  alignItems: "flex-start",
  padding: "2rem 1rem",
  justifyContent: "space-between",
  height: "100%",
};

const royalConfessorCardsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "47%",
  height: "-webkit-fill-available",
  gap: "15px",
};

const royalConfessorCardRowStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  height: "-webkit-fill-available",
};

const royalConfessorCardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "-webkit-fill-available",
  justifyContent: "space-between",
};

const royalConfessorCardStyle = {
  position: "relative",
  backgroundColor: "rgba(244, 229, 194, 0.95)",
  borderRadius: "8px",
  width: "180px",
  height: "280px",
  display: "flex",
  flexDirection: "column",
  cursor: "default",
  boxShadow:
    "0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(139, 69, 19, 0.6)",
  transition: "all 0.3s ease",
  transform: "perspective(1000px) rotateY(-2deg) rotateX(1deg)",
  border: "2px solid rgba(212, 175, 55, 0.5)",
};

const royalConfessorCardLabelStyle = {
  width: "100%",
  textAlign: "center",
  color: "rgba(244, 229, 194, 0.95)",
  margin: "0",
  marginTop: "0.7rem",
  fontWeight: "500",
  fontSize: "1.2rem",
  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
};

const royalConfessorArrowStyle = {
  fontSize: "2rem",
  color: "#d4af37",
  filter:
    "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 15px rgba(212, 175, 55, 0.8))",
  animation: "candleFlicker 2s ease-in-out infinite alternate",
};

const royalConfessorCardStrengthStyle = {
  position: "absolute",
  top: "-10px",
  left: "-10px",
  background: "linear-gradient(135deg, #d4af37 0%, #f4e5c2 100%)",
  color: "#2a1a0a",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "1rem",
  fontFamily: '"Cinzel", serif',
  border: "3px solid #8b4513",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
  zIndex: 10,
};

const royalConfessorCardImageStyle = {
  width: "100%",
  height: "60%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  border: "2px solid rgba(139, 69, 19, 0.4)",
  borderRadius: "8px 8px 0 0",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
};

const royalConfessorCardNameStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  color: "#2a1a0a",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  padding: "0.5rem",
  fontFamily: '"Cinzel", serif',
};

const royalConfessorCardEffectStyle = {
  fontSize: "0.9rem",
  color: "#5d4037",
  padding: "0 4%",
  lineHeight: "1.3",
  fontWeight: "300",
  display: "flex",
  alignItems: "center",
  fontStyle: "italic",
  fontFamily: '"Lora", serif',
  textAlign: "justify",
};

const royalConfessorMessageContainerStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  paddingLeft: "1rem",
};

const royalConfessorMessageStyle = {
  fontSize: "1.2rem",
  lineHeight: "1.6",
  color: "#f4e5c2",
  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
  fontFamily: '"Lora", serif',
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  textAlign: "justify",
};

const royalConfessorButtonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "1rem",
};

const royalConfessorButtonStyle = {
  background:
    "linear-gradient(135deg, rgb(42, 20, 8) 0%, rgb(139, 69, 19) 100%)",
  color: "#f4e5c2",
  transition: "all 0.3s ease",
  width: "70%",
  border: "2px solid rgba(212, 175, 55, 0.6)",
  fontFamily: '"Cinzel", serif',
};

// Add ghostly float animation
const ghostlyFloatAnimation = `
@keyframes ghostlyFloat {
  0% {
    transform: translateY(0px);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 10px rgba(74, 144, 226, 0.3));
  }
  100% {
    transform: translateY(-8px);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 20px rgba(74, 144, 226, 0.6));
  }
}
`;

// Add candle flicker animation for Royal Confessor
const candleFlickerAnimation = `
@keyframes candleFlicker {
  0% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 15px rgba(212, 175, 55, 0.4));
    transform: translateY(0px) scale(1);
  }
  50% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 25px rgba(212, 175, 55, 0.8));
    transform: translateY(-2px) scale(1.05);
  }
  100% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 20px rgba(212, 175, 55, 0.6));
    transform: translateY(-1px) scale(1.02);
  }
}
`;

// Baroness-specific modal styles (romantic matchmaker theme)
const baronessModalStyle = {
  width: "80%",
  maxWidth: "80%",
  background: "linear-gradient(145deg, #4a1625 0%, #2d0e18 50%, #1a0a10 100%)",
  border: "4px solid #ff69b4",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(255, 105, 180, 0.6), inset 0 1px 0 rgba(255, 182, 193, 0.1)",
};

const baronessLayoutStyle = {
  display: "flex",
  gap: "2rem",
  alignItems: "flex-start",
  padding: "2rem 1rem",
  justifyContent: "space-between",
  height: "100%",
};

const baronessCardsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "47%",
  height: "-webkit-fill-available",
  gap: "15px",
};

const baronessCardRowStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "2rem",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
};

const baronessCardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  height: "-webkit-fill-available",
};

const baronessCardStyle = {
  position: "relative",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "8px",
  width: "180px",
  height: "280px",
  display: "flex",
  flexDirection: "column",
  cursor: "default",
  border: "3px solid #ff69b4",
  boxShadow: "0 8px 25px rgba(255, 105, 180, 0.4)",
  transition: "all 0.3s ease",
};

const baronessCardLabelStyle = {
  display: "flex",
  flexWrap: "wrap",
  color: "#ffb6c1",
  fontSize: "1.1rem",
  fontFamily: "Cinzel, serif",
  fontWeight: "bold",
  textAlign: "center",
  margin: "0",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
  paddingTop: "1rem",
};

const baronessMessageContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  color: "#ffe4e6",
  fontFamily: "Lora, serif",
  fontSize: "1.1rem",
  lineHeight: "1.6",
};

// 👑🐕 Duke modal styling - Royal crimson & deep blue colors
const dukeModalStyle = {
  width: "85%",
  maxWidth: "85%",
  background: "linear-gradient(145deg, #1a1f3a 0%, #2c1810 50%, #4a0e2f 100%)",
  border: "4px solid #dc143c",
  boxShadow:
    "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(220, 20, 60, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  color: "#f0f8ff", // Alice blue for text
  fontFamily: "Cinzel, serif",
};

// Inject the animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent =
    priestGlowAnimation + ghostlyFloatAnimation + candleFlickerAnimation;
  document.head.appendChild(style);
}
