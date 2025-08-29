import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import { generateNickname } from "../utils/names";
import { buildDeck } from "../utils/deckBuilder";
import "./LandingPage.css"; // Import royal styles
import waitingRoomPicture from "../img/waiting-room.jpeg";

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

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);

    if (nickname) {
      const playerRef = ref(db, `rooms/${roomCode}/players/${nickname}`);
      update(playerRef, {
        name: nickname,
        realName: realName || "",
        isOut: false,
        tokens: 0,
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

  const isHost = nickname === host;
  const playerCount = players.length;
  const canStartGame = playerCount >= 2 && playerCount <= 11;
  const isOverCapacity = playerCount > 11;

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
                  Some guests must depart before the tournament can begin...
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
