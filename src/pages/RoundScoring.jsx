import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";

export default function RoundScoring() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;
  const realName = state?.realName;

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to room data to get current game state
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setRoomData(data);
      setLoading(false);

      // Redirect back to game if someone starts a new round
      if (data?.gameState === "inRound") {
        console.log("🎮 New round started - Redirecting back to game");
        navigate(`/play/${roomCode}`, {
          state: { nickname, realName },
        });
      }
    });

    return () => unsubscribe();
  }, [roomCode, nickname, realName, navigate]);

  const startNewRound = async () => {
    if (!roomData || roomData.host !== nickname) return;

    try {
      // Reset game state for new round
      const updates = {
        gameState: "inRound",
        roundResult: null,
        round: null, // Will be rebuilt when players join the new round
      };

      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, updates);

      console.log("🎮 Starting new round...");
      // Navigation will happen automatically via the listener above
    } catch (error) {
      console.error("❌ Error starting new round:", error);
    }
  };

  const endGame = async () => {
    if (!roomData || roomData.host !== nickname) return;

    try {
      const updates = {
        gameState: "gameEnd",
        finalResults: {
          completedRounds: roomData.gameStats?.totalRoundsPlayed || 0,
          finalWinner: getFinalWinner(),
          timestamp: Date.now(),
        },
      };

      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, updates);

      console.log("🏁 Game ended");
      // Could navigate to a final results page here
    } catch (error) {
      console.error("❌ Error ending game:", error);
    }
  };

  const getFinalWinner = () => {
    if (!roomData?.players) return null;

    const players = Object.entries(roomData.players);
    const maxTokens = Math.max(
      ...players.map(([_, player]) => player.tokens || 0)
    );
    const winners = players.filter(
      ([_, player]) => (player.tokens || 0) === maxTokens
    );

    return winners.length === 1 ? winners[0][0] : winners.map(([name]) => name);
  };

  const getSortedPlayers = () => {
    if (!roomData?.players) return [];

    return Object.entries(roomData.players)
      .sort(([, a], [, b]) => (b.tokens || 0) - (a.tokens || 0))
      .map(([name, player]) => ({ name, ...player }));
  };

  const formatPlayerName = (player) => {
    return player.realName || player.name;
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        ⏳ Loading round results...
      </div>
    );
  }

  if (!roomData) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        ❌ Room not found
      </div>
    );
  }

  const roundResult = roomData.roundResult;
  const isHost = roomData.host === nickname;
  const sortedPlayers = getSortedPlayers();

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2c3e50",
            marginBottom: "2rem",
            fontSize: "2.5rem",
          }}
        >
          🏆 Round Scoring Board 🏆
        </h1>

        <div
          style={{
            textAlign: "center",
            color: "#7f8c8d",
            fontSize: "1.2rem",
            marginBottom: "2rem",
          }}
        >
          Room: <strong>{roomCode}</strong>
        </div>

        {/* Round Winner Display */}
        {roundResult && (
          <div
            style={{
              backgroundColor: "#f8f9fa",
              border: "2px solid #28a745",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#28a745", marginBottom: "1rem" }}>
              🎉 Round {roundResult.roundNumber || "?"} Results 🎉
            </h2>
            {roundResult.winners && roundResult.winners.length > 1 ? (
              <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                Round {roundResult.roundNumber} Winners:{" "}
                {roundResult.winnerNames?.join(", ") ||
                  roundResult.winners.join(", ")}
              </p>
            ) : (
              <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                Round {roundResult.roundNumber} Winner:{" "}
                {roundResult.winnerNames?.[0] ||
                  roundResult.winnerName ||
                  roundResult.winner}
              </p>
            )}
            <p style={{ color: "#6c757d", fontSize: "1rem" }}>
              Victory Type:{" "}
              {roundResult.type === "lastPlayerStanding"
                ? "Last Player Standing"
                : "Highest Card (Deck Empty)"}
            </p>
          </div>
        )}

        {/* Love Tokens Leaderboard */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              color: "#495057",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            💝 Love Tokens Leaderboard 💝
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {sortedPlayers.map((player, index) => (
              <div
                key={player.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  backgroundColor: index === 0 ? "#fff3cd" : "white",
                  border:
                    index === 0 ? "2px solid #ffc107" : "1px solid #dee2e6",
                  borderRadius: "4px",
                  fontWeight: index === 0 ? "bold" : "normal",
                }}
              >
                <span>
                  {index === 0 && "👑 "}
                  {formatPlayerName(player)}
                  {player.name === nickname && " (You)"}
                </span>
                <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                  {player.tokens || 0} token
                  {(player.tokens || 0) !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Host Actions */}
        {isHost && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={startNewRound}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              🎮 Play Another Round
            </button>
            <button
              onClick={endGame}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
            >
              🏁 End Game Now
            </button>
          </div>
        )}

        {/* Non-host message */}
        {!isHost && (
          <div
            style={{
              textAlign: "center",
              color: "#6c757d",
              fontSize: "1rem",
              fontStyle: "italic",
            }}
          >
            Waiting for the host to start the next round or end the game...
          </div>
        )}
      </div>
    </div>
  );
}
