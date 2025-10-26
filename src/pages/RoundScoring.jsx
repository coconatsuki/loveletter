import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import { cards, getCardImage } from "../utils/cardsData";
import { buildDeck } from "../utils/deckBuilder";
import "./RoundScoring.css";

export default function RoundScoring() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;
  const realName = state?.realName;

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Listen to room data to get current game state
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      setRoomData(data);
      setLoading(false);

      // Trigger fade-in animation
      setTimeout(() => setFadeIn(true), 100);

      // Redirect back to game if someone starts a new round
      if (data?.gameState === "inRound") {
        console.log("🎮 New round started - Redirecting back to game");
        navigate(`/play/${roomCode}`, {
          state: { nickname, realName },
        });
      }

      // Redirect to Game Scoring if host ends the game
      if (data?.gameState === "gameEnd") {
        console.log("🏆 Game ended - Redirecting to Game Scoring");
        navigate(`/game_scoring/${roomCode}`, {
          state: { nickname, realName },
        });
      }
    });

    return () => unsubscribe();
  }, [roomCode, nickname, realName, navigate]);

  const startNewRound = async () => {
    if (!roomData || roomData.host !== nickname) return;

    try {
      console.log("🎮 Starting new round...");

      const activePlayers = Object.keys(roomData.players);
      const gameMode = roomData.mode || "normal";
      const lastRoundWinner = roomData.gameStats?.lastRoundWinner;

      // Build and shuffle new deck
      const shuffledDeck = buildDeck(gameMode);

      // Hide one card (first card from deck)
      const hiddenCard = shuffledDeck[0];
      const remainingDeck = shuffledDeck.slice(1);

      // Deal one card to each player
      const newRound = {
        deck: remainingDeck.slice(activePlayers.length), // Remove dealt cards from deck
        hiddenCard: hiddenCard,
        currentPlayer: lastRoundWinner || activePlayers[0], // LastRoundWinner goes first
        isFinalTurn: false,
      };

      // Reset all players' hands and discard piles
      const playerUpdates = {};
      activePlayers.forEach((playerKey, index) => {
        playerUpdates[`players/${playerKey}/hand`] = [remainingDeck[index]]; // Deal one card
        playerUpdates[`players/${playerKey}/discard`] = [];
        playerUpdates[`players/${playerKey}/isOut`] = false;
        playerUpdates[`players/${playerKey}/jesterToken`] = null; // 🃏 Clear jester tokens
        playerUpdates[`players/${playerKey}/chamberlainToken`] = null; // 🏰💰 Reset Chamberlain tokens to null
        playerUpdates[`players/${playerKey}/dukeToken`] = null; // 👑🐕 Clear Duke tokens
        playerUpdates[`players/${playerKey}/loveTokenOrigin`] = null; // 💕 Clear love token origin tracking
        playerUpdates[`players/${playerKey}/roundTokens`] = 0; // 🪙 Reset round tokens
      });

      // Increment round counter
      const newRoundNumber = (roomData.gameStats?.totalRoundsPlayed || 0) + 1;

      const updates = {
        gameState: "inRound",
        roundResult: null,
        round: newRound,
        notifications: null, // Clear notifications
        protectedPlayers: [], // Clear protected players
        guardPrompt: null,
        actionResult: null,
        priestTarget: null,
        baronTarget: null,
        targetMessage: null,
        [`gameStats/currentRound`]: newRoundNumber,
        ...playerUpdates,
      };

      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, updates);

      console.log("✅ New round started successfully!");
      // Navigation will happen automatically via the listener above
    } catch (error) {
      console.error("❌ Error starting new round:", error);
    }
  };

  const findNewLastRoundWinner = (remainingPlayers) => {
    // Find player(s) with highest love token count
    const maxTokens = Math.max(
      ...Object.values(remainingPlayers).map((p) => p.roundTokens || 0)
    );
    const topPlayers = Object.keys(remainingPlayers).filter(
      (playerKey) =>
        (remainingPlayers[playerKey].roundTokens || 0) === maxTokens
    );

    // If tie, choose randomly
    const randomIndex = Math.floor(Math.random() * topPlayers.length);
    return topPlayers[randomIndex];
  };

  const kickPlayer = async (playerNickname) => {
    if (!roomData || roomData.host !== nickname || playerNickname === nickname)
      return;

    const confirmKick = window.confirm(
      `🏰 Royal Decree: Are you sure you want to banish ${playerNickname} from the realm? They will be removed from future rounds.`
    );

    if (!confirmKick) return;

    try {
      const updates = {
        [`players/${playerNickname}`]: null, // Remove player from the game
      };

      // Check if kicked player was the LastRoundWinner
      const lastRoundWinner = roomData.gameStats?.lastRoundWinner;
      if (lastRoundWinner === playerNickname) {
        console.log(
          "🔄 Kicked player was LastRoundWinner, finding replacement..."
        );

        // Get remaining players (excluding the one being kicked)
        const remainingPlayers = { ...roomData.players };
        delete remainingPlayers[playerNickname];

        if (Object.keys(remainingPlayers).length > 0) {
          const newLastRoundWinner = findNewLastRoundWinner(remainingPlayers);
          updates[`gameStats/lastRoundWinner`] = newLastRoundWinner;
          console.log(`👑 New LastRoundWinner: ${newLastRoundWinner}`);
        } else {
          updates[`gameStats/lastRoundWinner`] = null;
        }
      }

      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, updates);

      console.log(
        `👑 Player ${playerNickname} has been banished from the realm`
      );
    } catch (error) {
      console.error("❌ Error kicking player:", error);
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

      console.log("🏁 Game ended - redirecting to Game Scoring");

      // Navigate to the final results page
      navigate(`/game_scoring/${roomCode}`, {
        state: { nickname, realName },
      });
    } catch (error) {
      console.error("❌ Error ending game:", error);
    }
  };

  const getFinalWinner = () => {
    if (!roomData?.players) return null;

    const players = Object.entries(roomData.players);
    const maxTokens = Math.max(
      ...players.map(([_, player]) => player.roundTokens || 0)
    );
    const winners = players.filter(
      ([_, player]) => (player.roundTokens || 0) === maxTokens
    );

    return winners.length === 1 ? winners[0][0] : winners.map(([name]) => name);
  };

  const getSortedPlayers = () => {
    if (!roomData?.players) return [];

    return Object.entries(roomData.players)
      .sort(([, a], [, b]) => (b.roundTokens || 0) - (a.roundTokens || 0))
      .map(([name, player]) => ({ name, ...player }));
  };

  const formatPlayerName = (player) => {
    // Prioritize nickname (chosen name) over real name
    const primaryName = player.name; // nickname
    const secondaryName = player.realName; // real name

    if (primaryName && secondaryName && primaryName !== secondaryName) {
      return { primary: primaryName, secondary: secondaryName };
    }

    return { primary: primaryName || secondaryName, secondary: null };
  };

  const getHiddenCard = () => {
    const hiddenCardId = roomData?.roundResult?.hiddenCard?.id;
    if (!hiddenCardId) return null;

    return cards.find((card) => card.id === hiddenCardId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-box">⏳ Loading the royal chronicles...</div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="loading-container">
        <div className="loading-box">❌ The royal court has vanished...</div>
      </div>
    );
  }

  const roundResult = roomData.roundResult;
  const isHost = roomData.host === nickname;
  const sortedPlayers = getSortedPlayers();
  const hiddenCard = getHiddenCard();

  return (
    <div className={`round-scoring-container ${fadeIn ? "fade-in" : ""}`}>
      <div className="round-scoring-main">
        {/* Decorative corner elements */}
        <div className="corner-decoration corner-top-left"></div>
        <div className="corner-decoration corner-top-right"></div>
        <div className="corner-decoration corner-bottom-left"></div>
        <div className="corner-decoration corner-bottom-right"></div>

        <div className="main-content">
          <h1 className="main-title">⚜️ Royal Scoring Chronicles ⚜️</h1>

          <div className="round-scoring-content-layout">
            <div className="main-column">
              {/* Round Winner Display */}
              {roundResult && (
                <div className="round-winner-section">
                  {roundResult.winners && roundResult.winners.length > 1 ? (
                    <h2 className="round-winner-title">
                      🎉 Round {roundResult.roundNumber} Winners:{" "}
                      <span className="round-winner-name">
                        {roundResult.winnerNames?.join(", ") ||
                          roundResult.winners.join(", ")}{" "}
                        🎉
                      </span>
                    </h2>
                  ) : (
                    <h2 className="round-winner-title">
                      🎉 Round {roundResult.roundNumber} Winner:{" "}
                      <span className="round-winner-name">
                        {roundResult.winnerNames?.[0] ||
                          roundResult.winnerName ||
                          roundResult.winner}{" "}
                        🎉
                      </span>
                    </h2>
                  )}
                  <div className="victory-type">
                    <span className="victory-type-label">Victory Type:</span>{" "}
                    <span className="victory-type-value">
                      {roundResult.type === "lastPlayerStanding"
                        ? "⚔️ Last Noble Standing"
                        : "🃏 Highest Card (Deck Exhausted)"}
                    </span>
                  </div>
                </div>
              )}

              {/* Love Tokens Leaderboard */}
              <div className="round-scoring-leaderboard-section">
                <h3 className="round-scoring-leaderboard-title">
                  💝 Love Tokens Leaderboard 💝
                </h3>
                <div className="round-scoring-leaderboard-list">
                  {sortedPlayers.map((player, index) => {
                    const nameFormat = formatPlayerName(player);
                    const isCurrentUser = player.name === nickname;

                    return (
                      <div
                        key={player.name}
                        className={`player-row ${
                          index === 0 ? "winner" : "regular"
                        }`}
                      >
                        <div className="player-info-section">
                          <span
                            className={`player-rank ${
                              index === 0 ? "winner" : "regular"
                            }`}
                          >
                            {index === 0 ? "👑" : `${index + 1}.`}
                          </span>
                          <div className="player-names">
                            <div className="player-nickname-container">
                              {/* Kick Player Button (Host Only) */}
                              {isHost && player.name !== nickname && (
                                <button
                                  onClick={() => kickPlayer(player.name)}
                                  className="banish-button"
                                  title={`Banish ${player.name} from the realm`}
                                >
                                  ⚔️ Banish
                                </button>
                              )}
                              <div className="player-nickname">
                                {nameFormat.primary}
                                {isCurrentUser && (
                                  <span className="player-you-indicator">
                                    (You)
                                  </span>
                                )}
                              </div>
                            </div>

                            {nameFormat.secondary && (
                              <div className="player-realname">
                                {nameFormat.secondary}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="player-actions">
                          <div className="love-token-container">
                            <div className="game-tokens tokens-bubble">
                              Total: {player.tokens || 0} 🩶
                            </div>
                            <div className="round-tokens tokens-bubble">
                              Round: {player.roundTokens || 0} 💖
                            </div>
                          </div>
                          {/* Love token breakdown - bottom right */}
                          {player.loveTokenOrigin && (
                            <div className="love-token-breakdown">
                              {[
                                player.loveTokenOrigin.roundWinner &&
                                  "+1 from Round Victory",
                                player.loveTokenOrigin.jesterBonus &&
                                  "+1 from Jester",
                                player.loveTokenOrigin.chamberlainToken &&
                                  "+1 from Chamberlain",
                                player.loveTokenOrigin.inquisitorGuess &&
                                  "+1 from Inquisitor",
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Host Actions */}
              {isHost && (
                <div className="host-actions">
                  <button
                    onClick={startNewRound}
                    className="action-button new-round-button"
                  >
                    🎮 Commence New Round
                  </button>
                  <button
                    onClick={endGame}
                    className="action-button end-game-button"
                  >
                    🏁 End Royal Tournament
                  </button>
                </div>
              )}

              {/* Non-host message */}
              {!isHost && (
                <div className="waiting-message">
                  🕰️ Awaiting the host's royal decree to begin the next round or
                  conclude the tournament...
                </div>
              )}
            </div>

            <div className="side-column">
              {/* Hidden Card Revelation */}
              {hiddenCard && (
                <div className="hidden-card-section">
                  <div className="hidden-card-label">🤫 COURT SECRET 🤫</div>
                  <h3 className="hidden-card-title">
                    🃏 The Hidden Card Revealed 🃏
                  </h3>

                  <div className="hidden-card-details">
                    <div
                      className="hidden-card-image"
                      style={{
                        backgroundImage: `url('/src/img/${getCardImage(
                          hiddenCard.name
                        )}')`,
                      }}
                    ></div>
                    <div className="hidden-card-name">{hiddenCard.name}</div>
                    <div className="hidden-card-info">
                      Strength: {hiddenCard.strength} |{" "}
                      <em>{hiddenCard.effect}</em>
                    </div>
                  </div>
                  <p className="hidden-card-flavor">
                    This card was secretly discarded at the round's beginning...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
