import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { generateNickname } from "../utils/names";
import { buildDeck } from "../utils/deckBuilder";
import "./LandingPage.css"; // Import royal styles
import waitingRoomPicture from "../img/waiting-room.jpeg";
import medievalMusic from "../sounds/medieval-ambient.mp3";

export default function Room() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;
  const realName = state?.realName;
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roomMode, setRoomMode] = useState("normal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Fade utility functions for smooth volume transitions
  const fadeIn = (audio, targetVolume = 0.7, duration = 1000) => {
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

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);

    if (nickname) {
      const playerRef = ref(db, `rooms/${roomCode}/players/${nickname}`);
      update(playerRef, {
        name: nickname,
        realName: realName || "",
        isOut: false,
        tokens: 0,
        gameTokens: 0,
      });
    }

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.players) {
        setPlayers(Object.values(data.players));
      }
      if (data?.host) {
        setHost(data.host);
      }
      if (data?.mode) {
        setRoomMode(data.mode);
      }
      if (data?.gameState === "inRound") {
        setGameStarted(true);
      }
    });

    return () => unsubscribe();
  }, [roomCode, nickname, realName]);

  useEffect(() => {
    if (gameStarted) {
      navigate(`/play/${roomCode}`, { state: { nickname } });
    }
  }, [gameStarted, navigate, roomCode, nickname]);

  // Check if current player was kicked (player no longer exists in the room)
  useEffect(() => {
    if (nickname && players.length > 0) {
      const playerExists = players.some((player) => player.name === nickname);
      if (!playerExists) {
        console.log(`Player ${nickname} was kicked from the room`);
        navigate("/", {
          state: {
            kickedMessage:
              "You were removed from the royal court by the Game Master.",
          },
        });
      }
    }
  }, [players, nickname, navigate]);

  // Music setup for Room page (manual control only)
  useEffect(() => {
    console.log(
      "🎵 MUSIC DEBUG: Room page mounted, setting up manual music control..."
    );

    if (audioRef.current) {
      // Set up audio properties
      audioRef.current.loop = true;
      audioRef.current.volume = 0; // Start at 0 for fade-in

      // Ensure audio is loaded before attempting to play
      audioRef.current.load();

      console.log("🎵 Audio element prepared:", {
        src: audioRef.current.src,
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
      });
    }

    // Cleanup function
    return () => {
      // Clear any fade intervals
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Music toggle function with smart timing and smooth fades
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
        console.log("🎵 Fading out medieval music...");
        setIsPlaying(false);
        fadeOut(audioRef.current).then(() => {
          console.log("🎵 Medieval music faded out and paused by user");
        });
      } else {
        // Smart timing: Start at 6 seconds on first play (skip silence), 0 seconds on subsequent plays
        if (!hasUserInteracted) {
          console.log("🎵 First play - starting at 6 seconds to skip silence");
          audioRef.current.currentTime = 6; // Skip the 6 seconds of silence
          setHasUserInteracted(true);
        } else {
          console.log(
            "🎵 Subsequent play - starting at 0 seconds (natural loop)"
          );
          audioRef.current.currentTime = 0; // Natural loop with silence as rest
        }

        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("🎵 Medieval music started, fading in smoothly...");
            // Bring back the smooth fade-in for polished experience
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

  const isHost = nickname === host;
  const playerCount = players.length;
  const canStartGame = playerCount >= 2 && playerCount <= 11;
  const isOverCapacity = playerCount > 11;

  const kickPlayer = async (playerToKick) => {
    if (!isHost || playerToKick === host) {
      console.warn("Cannot kick: either not host or trying to kick host");
      return;
    }

    // Royal confirmation popup
    const confirmed = window.confirm(
      `⚔️ Art thou certain thou wishest to banish ${playerToKick} from the royal court? This action cannot be undone! 👑`
    );

    if (!confirmed) {
      return; // User cancelled, do nothing
    }

    try {
      const playerRef = ref(db, `rooms/${roomCode}/players/${playerToKick}`);
      await remove(playerRef);
      console.log(
        `Player ${playerToKick} has been banished from the royal court`
      );
    } catch (error) {
      console.error("Failed to kick player:", error);
    }
  };

  const startGame = () => {
    // Double-check validation before starting
    if (playerCount < 2 || playerCount > 11) {
      console.warn(
        `Cannot start game with ${playerCount} players. Must be 2-11 players.`
      );
      return;
    }

    const roomRef = ref(db, `rooms/${roomCode}`);
    onValue(
      roomRef,
      (snapshot) => {
        const roomData = snapshot.val();
        if (!roomData?.players) return;

        console.log("Starting game / roomData.players:", roomData.players);

        const playerNames = Object.keys(roomData.players);
        const fullDeck = buildDeck(roomData.mode || "normal");
        const shuffled = [...fullDeck];

        const hiddenCard = shuffled.shift();

        const hands = {};
        playerNames.forEach((name) => {
          hands[name] = {
            ...roomData.players[name],
            hand: [shuffled.shift()],
            discard: [],
            isOut: false,
          };
        });

        const startingPlayer =
          playerNames[Math.floor(Math.random() * playerNames.length)];

        update(roomRef, {
          gameState: "inRound",
          players: hands,
          round: {
            hiddenCard,
            deck: shuffled,
            currentPlayer: startingPlayer,
          },
        });
      },
      { onlyOnce: true }
    );
  };

  return (
    <div className="royal-landing-container">
      {/* Audio element for background music */}
      <audio ref={audioRef} src={medievalMusic} preload="auto" />

      {/* Music toggle button */}
      <button
        onClick={toggleMusic}
        className="music-toggle-btn"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "none",
          background: isPlaying ? "#4CAF50" : "#666",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
        title={isPlaying ? "Stop Music" : "Play Music"}
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>

      {/* 🏰 Royal Header */}
      <div className="royal-header">
        <div className="royal-header-text">
          <h1 className="royal-title-centered floating">
            THE ROYAL ANTECHAMBER
          </h1>
          <p className="royal-subtitle-centered">
            "Sacred Court Code: <strong>{roomCode}</strong>"
          </p>
        </div>
      </div>

      <div className="royal-main-content">
        {/* 📜 Left Panel - The Royal Guest List */}
        <div className="royal-form-panel">
          <div className="royal-guest-section">
            <h3 className="royal-section-title">
              ⚔️ Noble Guests in Attendance{" "}
              <span
                className={`guest-counter ${
                  isOverCapacity ? "over-capacity" : ""
                }`}
              >
                ({playerCount}/11)
              </span>{" "}
              ⚔️
            </h3>

            <div className="royal-guest-list">
              {players.map((player, index) => (
                <div key={index} className="royal-guest-card">
                  <div className="guest-position-number">{index + 1}</div>
                  <div className="guest-info">
                    <div className="guest-nickname">
                      {player.name === host && "👑 "}
                      {player.name}
                      {"   "}
                      <span className="guest-realname">
                        ({player.realName})
                      </span>
                      {"   "}
                      {player.name === nickname && " ← you"}
                    </div>
                  </div>
                  <div className="guest-status">
                    {player.name === host
                      ? "Host & Game Master"
                      : "Noble Guest"}
                  </div>

                  {/* Kick button - only show for host, not for the host themselves, and when useful */}
                  {isHost &&
                    player.name !== host &&
                    (isOverCapacity || playerCount > 2) && (
                      <button
                        onClick={() => kickPlayer(player.name)}
                        className="kick-player-button"
                        title={`Banish ${player.name} from the royal court`}
                      >
                        🚫 Banish
                      </button>
                    )}
                </div>
              ))}
            </div>

            {players.length < 2 && (
              <div className="waiting-notice">
                <p>
                  🕰️ The court requires at least 2 noble souls to begin the
                  tournament...
                </p>
                <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  Share the sacred code "<strong>{roomCode}</strong>" with
                  fellow courtiers!
                </p>
              </div>
            )}

            {isOverCapacity && (
              <div className="over-capacity-notice">
                <p>
                  ⚠️ The royal court is overflowing! Maximum 11 noble guests
                  allowed.
                </p>
                <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  {isHost
                    ? "Use the 'Banish' buttons to remove guests before starting the tournament..."
                    : "The Game Master must remove some guests before the tournament can begin..."}
                </p>
              </div>
            )}
          </div>

          {isHost && canStartGame && (
            <button
              onClick={startGame}
              className="royal-button royal-start-button"
            >
              🎺 COMMENCE THE ROYAL TOURNAMENT 🎺
            </button>
          )}

          {isHost && !canStartGame && (
            <button
              disabled
              className="royal-button royal-start-button"
              style={{
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            >
              {playerCount < 2
                ? "⏳ Awaiting More Noble Guests ⏳"
                : "⚠️ Too Many Guests in Court ⚠️"}
            </button>
          )}

          {!isHost && (
            <div className="non-host-message">
              <p>
                ⏳ Awaiting the Game Master's call to begin the tournament...
              </p>
            </div>
          )}
        </div>

        {/* 🖼️ Right Panel - Royal Portrait Frame */}
        <div className="royal-artwork-panel">
          <div className="welcome-message-container">
            <p className="welcome-message">
              🏰 Welcome to the Royal Antechamber,{" "}
              <strong className="noble-name">{nickname}</strong>! 🏰
            </p>
            <p
              style={{ fontSize: "0.9rem", opacity: 0.9, marginTop: "0.5rem" }}
            >
              The royal court awaits more noble souls before the tournament of
              hearts may commence.
            </p>
          </div>
          <img
            src={waitingRoomPicture}
            alt="Royal Waiting Chamber"
            className="waiting-room-artwork"
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
