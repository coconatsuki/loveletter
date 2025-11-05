import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../utils/firebase";
import { generateNickname } from "../utils/names";
import landingMusic1 from "../sounds/landing1.mp3";
import landingMusic2 from "../sounds/landing2.mp3";
import landingMusic3 from "../sounds/landing3.mp3";
import "./LandingPage.css";

export default function Landing() {
  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [kickedMessage, setKickedMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const musicTracks = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fade utility functions for smooth volume transitions
  const fadeIn = (audio, targetVolume = 0.3, duration = 1000) => {
    return new Promise((resolve) => {
      if (!audio) {
        resolve();
        return;
      }

      // Clear any existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      audio.volume = 0;
      const steps = 50; // Number of volume steps
      const stepTime = duration / steps;
      const volumeIncrement = targetVolume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);

        if (currentStep >= steps) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          audio.volume = targetVolume;
          resolve();
        }
      }, stepTime);
    });
  };

  const fadeOut = (audio, duration = 800) => {
    return new Promise((resolve) => {
      if (!audio) {
        resolve();
        return;
      }

      // Clear any existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const initialVolume = audio.volume;
      const steps = 50;
      const stepTime = duration / steps;
      const volumeDecrement = initialVolume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(
          initialVolume - volumeDecrement * currentStep,
          0
        );

        if (currentStep >= steps || audio.volume <= 0) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          audio.volume = 0;
          audio.pause();
          resolve();
        }
      }, stepTime);
    });
  };

  // Check for kicked message
  useEffect(() => {
    if (location.state?.kickedMessage) {
      setKickedMessage(location.state.kickedMessage);
      // Clear the message after 5 seconds
      setTimeout(() => setKickedMessage(""), 5000);
    }
  }, [location.state]);

  // Initialize and shuffle music tracks
  useEffect(() => {
    console.log("🎵 MUSIC DEBUG: Initializing and shuffling tracks...");

    // Shuffle the three tracks randomly using Fisher-Yates
    const tracks = [
      { src: landingMusic1, name: "Landing Music 1" },
      { src: landingMusic2, name: "Landing Music 2" },
      { src: landingMusic3, name: "Landing Music 3" },
    ];

    const shuffled = [...tracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    musicTracks.current = shuffled;

    console.log("🎵 Track order:", {
      first: shuffled[0].name,
      second: shuffled[1].name,
      third: shuffled[2].name,
    });

    // Set up the first track
    if (audioRef.current) {
      audioRef.current.src = shuffled[0].src;
      audioRef.current.volume = 0.7;
      audioRef.current.load();

      console.log("🎵 Audio element prepared with first track:", {
        src: audioRef.current.src,
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
      });
    }
  }, []);

  // Handle track ending and switch to next
  useEffect(() => {
    const handleTrackEnd = () => {
      console.log("🎵 Track ended, switching to next...");

      const nextIndex = (currentTrackIndex + 1) % musicTracks.current.length;
      const nextTrack = musicTracks.current[nextIndex];

      console.log("🎵 Next track:", nextTrack.name);

      if (audioRef.current) {
        audioRef.current.src = nextTrack.src;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            console.log("🎵 Next track started playing");
            setCurrentTrackIndex(nextIndex);
            fadeIn(audioRef.current, 0.7, 2000);
          })
          .catch((error) => {
            console.error("🎵 Error playing next track:", error);
          });
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleTrackEnd);
      return () => {
        audioRef.current?.removeEventListener("ended", handleTrackEnd);
      };
    }
  }, [currentTrackIndex]);

  // Music setup and first-interaction trigger
  useEffect(() => {
    console.log(
      "🎵 MUSIC DEBUG: Landing page mounted, setting up first-interaction trigger..."
    );

    // Function to handle first user interaction
    const handleFirstInteraction = () => {
      if (!hasUserInteracted && audioRef.current) {
        console.log("🎵 FIRST INTERACTION DETECTED: Starting music...");
        console.log("🎵 Audio state before play:", {
          readyState: audioRef.current.readyState,
          networkState: audioRef.current.networkState,
          paused: audioRef.current.paused,
          currentTime: audioRef.current.currentTime,
          duration: audioRef.current.duration,
        });

        setHasUserInteracted(true);

        // Wait a moment to ensure audio is ready, then play with fade-in
        setTimeout(() => {
          audioRef.current
            .play()
            .then(() => {
              console.log(
                "🎵 SUCCESS: Music started after user interaction, fading in..."
              );
              setIsPlaying(true);
              // Fade in the music smoothly
              fadeIn(audioRef.current);
            })
            .catch((error) => {
              console.log(
                "🎵 ERROR: Could not start music after interaction -",
                error.message
              );
              console.log("🎵 Audio state after error:", {
                readyState: audioRef.current.readyState,
                networkState: audioRef.current.networkState,
                error: audioRef.current.error,
              });
              setIsPlaying(false);
            });
        }, 100); // Small delay to ensure audio is ready
      }
    };

    // Add event listeners for any user interaction
    const interactionEvents = ["click", "keydown", "keyup", "input", "change"];

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: false });
    });

    // Cleanup function
    return () => {
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });

      // Clear any fade intervals
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [hasUserInteracted]);

  // Music toggle function with smooth fade effects
  const toggleMusic = () => {
    if (audioRef.current) {
      console.log("🎵 TOGGLE MUSIC: Current state:", {
        isPlaying,
        paused: audioRef.current.paused,
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
        src: audioRef.current.src,
      });

      if (isPlaying) {
        console.log("🎵 Fading out music...");
        setIsPlaying(false);
        fadeOut(audioRef.current).then(() => {
          console.log("🎵 Music faded out and paused by user");
        });
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("🎵 Music started by user, fading in...");
            fadeIn(audioRef.current);
          })
          .catch((error) => {
            console.error("🎵 Error playing music:", error);
            console.log("🎵 Audio error details:", {
              readyState: audioRef.current.readyState,
              networkState: audioRef.current.networkState,
              error: audioRef.current.error,
            });
          });
      }
    }
  };

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
    // Always clear validation errors when user makes any change
    // This ensures the button becomes enabled again when user fixes their input
    setValidationErrors([]);
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
    // Clear validation errors since we're changing the nickname
    setValidationErrors([]);
    // Add visual feedback
    const button = document.querySelector(".generate-name-btn");
    if (button) {
      button.classList.add("success-glow");
      setTimeout(() => button.classList.remove("success-glow"), 600);
    }
  };

  return (
    <div className="royal-landing-container">
      {/* Audio element for background music */}
      <audio ref={audioRef} preload="auto" />

      {/* Music toggle button */}
      <button
        onClick={toggleMusic}
        className="music-toggle-btn"
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "2px solid #d4af37",
          background: isPlaying
            ? "linear-gradient(135deg, #4CAF50, #45a049)"
            : "linear-gradient(135deg, #666, #555)",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: isPlaying
            ? "0 0 20px rgba(76, 175, 80, 0.5)"
            : "0 2px 10px rgba(0,0,0,0.3)",
        }}
        title={isPlaying ? "Silence the Royal Orchestra" : "Play Music"}
      >
        {isPlaying ? "🎵" : "🔇"}
      </button>

      {/* Full width centered title */}
      <div className="royal-header">
        <img
          src="/img/love-letter.png"
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
          src="/img/love-letter.png"
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
            src="/img/princess-square.jpeg"
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
