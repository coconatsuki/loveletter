import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../utils/firebase";
import { generateNickname } from "../utils/names";
import princessImage from "../img/princess-square.jpeg";
import loveLetterImage from "../img/love-letter.png";
import "./LandingPage.css";

export default function Landing() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [kickedMessage, setKickedMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for kicked message
  useEffect(() => {
    if (location.state?.kickedMessage) {
      setKickedMessage(location.state.kickedMessage);
      // Clear the message after 5 seconds
      setTimeout(() => setKickedMessage(""), 5000);
    }
  }, [location.state]);

  const validateForm = async () => {
    const errors = [];

    // Basic empty field validation
    if (!nickname.trim()) {
      errors.push("⚔️ A noble nickname is required to enter the court!");
    }
    if (!realName.trim()) {
      errors.push("👑 Thy true name must be revealed to join!");
    }
    if (!roomCode.trim()) {
      errors.push("🏰 A sacred room code is required for entry!");
    }

    // Length validations
    if (realName.trim() && realName.trim().length < 3) {
      errors.push("📜 Thy true name must be at least 3 characters long!");
    }
    if (realName.trim() && realName.trim().length > 30) {
      errors.push("📜 Thy true name must be less than 30 characters!");
    }
    if (nickname.trim() && nickname.trim().length < 3) {
      errors.push("⚔️ Thy noble nickname must be at least 3 characters long!");
    }
    if (nickname.trim() && nickname.trim().length > 30) {
      errors.push("⚔️ Thy noble nickname must be less than 30 characters!");
    }

    // If basic validations fail, don't proceed to Firebase checks
    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }

    // Firebase validations
    try {
      setIsValidating(true);

      // Check if room exists
      const roomRef = ref(db, `rooms/${roomCode.trim()}`);
      const roomSnapshot = await get(roomRef);

      if (!roomSnapshot.exists()) {
        errors.push("🚫 This mystical chamber does not exist in our realm!");
        setValidationErrors(errors);
        return false;
      }

      // Check if nickname or real name is already taken in this room
      const playersRef = ref(db, `rooms/${roomCode.trim()}/players`);
      const playersSnapshot = await get(playersRef);

      if (playersSnapshot.exists()) {
        const players = playersSnapshot.val();
        const playerList = Object.values(players);

        // Check for duplicate nickname
        const nicknameExists = playerList.some(
          (player) =>
            player.name.toLowerCase() === nickname.trim().toLowerCase()
        );
        if (nicknameExists) {
          errors.push(
            "👥 This noble nickname is already taken in this chamber!"
          );
        }

        // Check for duplicate real name
        const realNameExists = playerList.some(
          (player) =>
            player.realName.toLowerCase() === realName.trim().toLowerCase()
        );
        if (realNameExists) {
          errors.push("👥 This true name is already known in this chamber!");
        }
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Validation error:", error);
      errors.push("⚡ A mystical error occurred while checking the chamber!");
      setValidationErrors(errors);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Clear validation errors when user types
  const handleInputChange = (setter, value) => {
    setter(value);
    if (validationErrors.length > 0) {
      setValidationErrors([]); // Clear errors when user starts typing
    }
  };

  const handleJoin = async () => {
    const isValid = await validateForm();
    if (isValid) {
      navigate(`/room/${roomCode.trim()}`, {
        state: { nickname: nickname.trim(), realName: realName.trim() },
      });
    }
  };

  const handleGenerateName = () => {
    const generatedName = generateNickname(preferredGender);
    setNickname(generatedName);
    // Add visual feedback
    const button = document.querySelector(".generate-name-btn");
    if (button) {
      button.classList.add("success-glow");
      setTimeout(() => button.classList.remove("success-glow"), 600);
    }
  };

  return (
    <div className="royal-landing-container">
      {/* Full width centered title */}
      <div className="royal-header">
        <img
          src={loveLetterImage}
          alt="Love Letter"
          className="royal-header-image"
        />
        <div className="royal-header-text">
          <h1 className="royal-title-centered floating">LOVE LETTER</h1>
          <p className="royal-subtitle-centered">
            "Who wants to win a princess's heart... and her noble crown?"
          </p>
        </div>
        <img
          src={loveLetterImage}
          alt="Love Letter"
          className="royal-header-image"
        />
      </div>

      <div className="royal-main-content">
        {/* 📜 Left Panel - The Royal Court Entry Form */}
        <div className="royal-form-panel">
          {kickedMessage && (
            <div className="kicked-message">
              <p>⚔️ {kickedMessage} ⚔️</p>
              <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                Fear not, noble soul! You may join another royal court below.
              </p>
            </div>
          )}

          <div className="royal-form-group">
            <label className="royal-label">Thy True Name:</label>
            <input
              className="royal-input"
              value={realName}
              onChange={(e) => handleInputChange(setRealName, e.target.value)}
              placeholder="By what name art thou known in the realm?"
            />
          </div>

          <fieldset className="royal-fieldset">
            <legend className="royal-legend">
              Choose Thy Courtly Title & Moniker
            </legend>
            <div className="name-generator-container">
              <div className="name-generator-input royal-form-group">
                <input
                  className="royal-input"
                  value={nickname}
                  onChange={(e) =>
                    handleInputChange(setNickname, e.target.value)
                  }
                  placeholder="Enter thy courtly nickname"
                />
              </div>
              <button
                className="royal-button generate-name-btn"
                onClick={handleGenerateName}
              >
                🎲 Generate Noble Name
              </button>
            </div>

            <div className="gender-options">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={preferredGender === "female"}
                  onChange={(e) => setPreferredGender(e.target.value)}
                />
                <span className="gender-option-label">👸 Lady name</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={preferredGender === "male"}
                  onChange={(e) => setPreferredGender(e.target.value)}
                />
                <span className="gender-option-label">🤴 Lord name</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value=""
                  checked={preferredGender === ""}
                  onChange={(e) => setPreferredGender(e.target.value)}
                />
                <span className="gender-option-label">⚡ Neutral name</span>
              </label>
            </div>
          </fieldset>

          <div className="royal-form-group room-code-group">
            <label className="royal-label">Sacred Room Code:</label>
            <input
              className="royal-input"
              value={roomCode}
              onChange={(e) => handleInputChange(setRoomCode, e.target.value)}
              placeholder="Enter the mystical chamber code..."
            />
          </div>

          {/* Error Messages Display */}
          {validationErrors.length > 0 && (
            <div className="validation-errors">
              {validationErrors.map((error, index) => (
                <div key={index} className="error-message">
                  {error}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleJoin}
            className="royal-button"
            disabled={
              !nickname?.trim() ||
              !realName?.trim() ||
              !roomCode?.trim() ||
              validationErrors.length > 0 ||
              isValidating
            }
            style={{
              width: "100%",
              fontSize: "1.2rem",
              opacity:
                !nickname?.trim() ||
                !realName?.trim() ||
                !roomCode?.trim() ||
                validationErrors.length > 0 ||
                isValidating
                  ? 0.6
                  : 1,
              cursor:
                !nickname?.trim() ||
                !realName?.trim() ||
                !roomCode?.trim() ||
                validationErrors.length > 0 ||
                isValidating
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isValidating
              ? "⏳ Verifying Royal Credentials..."
              : "🏰 Enter the Royal Court 🏰"}
          </button>
        </div>

        {/* 🖼️ Right Panel - Princess Artwork */}
        <div className="royal-artwork-panel">
          <div className="story-container">
            <p className="story-1">
              ⚔️ The throne is vacant: the King is dead, the Queen a traitor.
            </p>
            <p className="story-2">
              👑 Only Princess Charlotte remains, drowning in sorrow and gossip.
            </p>
            <p className="story-2">
              ❤️‍🔥 Could you be the one to heal her misery…
            </p>
            <p className="story-2">
              …and upgrade yourself from nobody to sovereign?
            </p>
            <p className="story-1 story-4">HOW?</p>
            <p className="story-3">
              💌 Find a fool brave enough to carry your love letter past locked
              doors. <br />
              Only then may she read your plea… or laugh at it over tea. 🫖
            </p>
          </div>

          <img
            src={princessImage}
            alt="Princess of the Royal Court"
            className="princess-artwork"
          />
        </div>
      </div>

      {/* 👑 Royal Footer */}
      <footer className="royal-footer">
        <p className="royal-footer-text">
          Made by Amandine & Archie, with love ❤️‍🔥
        </p>
      </footer>
    </div>
  );
}
