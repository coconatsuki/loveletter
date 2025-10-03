import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { ref, onValue, update, set } from "firebase/database";
import TargetModal from "../components/TargetModal";
import InquisitorTargetModal from "../components/InquisitorTargetModal";
import EffectResultModal from "../components/EffectResultModal";
import AssassinPromptModal from "../components/AssassinPromptModal";
import PriestTargetModal from "../components/PriestTargetModal";
import BaronResultModal from "../components/BaronResultModal";
import RoundEndModal from "../components/RoundEndModal";
import DiscardPilePopover from "../components/DiscardPilePopover";
import DiscardHistoryModal from "../components/DiscardHistoryModal";
import {
  applyGuardEffect,
  resolveAssassinDefense,
  executeAssassinationElimination,
  applyPriestEffect,
  applyBaronEffect,
  applyHandmaidEffect,
  applyPrinceEffect,
  applyKingEffect,
  applyPhantomKingEffect,
  applyCountessEffect,
  applyAssassinEffect,
  applyPrincessEffect,
  applyInquisitorEffect,
  awardLoveToken,
  shouldAdvanceTurnOnModal,
} from "../utils/cardEffects";
import { pushNotification } from "../utils/pushNotification";
import {
  logRoundEndCheck,
  checkRoundEndConditions,
  triggerRoundEnd,
} from "../utils/roundEndDetection";
import { cards, getCardImage } from "../utils/cardsData";
import { getCardCount } from "../utils/gamehelpers";
import { useGridLayout } from "../utils/useGridLayout";
import "./Play.css";

const cardNames = {
  0: "Jester",
  1: "Guard",
  2: "Priest",
  3: "Baron",
  4: "Handmaid",
  5: "Prince",
  6: "Phantom King",
  7: "Countess",
  8: "Princess",
  9: "Inquisitor",
  10: "Chamberlain",
  11: "Regent Queen",
  12: "Court Whisperer",
  13: "Royal Confessor",
  14: "Assassin",
  15: "Baroness",
  16: "Duke",
};

// Component to render star icons for card count
const CardCountStars = ({ cardId, gameMode }) => {
  const count = getCardCount(cardId, gameMode, cards);

  if (count === 0) return null; // Don't show anything if count is 0

  return (
    <div className="card-count-stars">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="card-count-star">
          ★
        </span>
      ))}
    </div>
  );
};

export default function Play() {
  const { id: roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nickname = state?.nickname;

  const [roomData, setRoomData] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCardForUI, setSelectedCardForUI] = useState(null); // For UI positioning only
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [resultModalData, setResultModalData] = useState(null);
  const [guardTargetPromptData, setGuardTargetPromptData] = useState(null);
  const [showGuardTargetPrompt, setShowGuardTargetPrompt] = useState(false);
  const [inquisitorResultModalData, setInquisitorResultModalData] =
    useState(null);
  const [priestTargetModalData, setPriestTargetModalData] = useState(null);
  const [resultContent, setResultContent] = useState("");
  const [baronResultModalData, setBaronResultModalData] = useState(null);
  const [baronTargetModalData, setBaronTargetModalData] = useState(null);
  const [targetMessageModalData, setTargetMessageModalData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [roundEndModalData, setRoundEndModalData] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [showDiscardHistory, setShowDiscardHistory] = useState(false); // For discard pile popover
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);

  // Grid layout hook for dynamic popover positioning
  const totalPlayers = roomData?.players
    ? Object.keys(roomData.players).length
    : 0;
  const { gridRef, playersPerRow, shouldShowPopoverOnLeft } =
    useGridLayout(totalPlayers); // Prevents flash during modal transitions

  // Helper function to check if any modal is currently active
  const hasActiveModal = () => {
    return !!(
      resultModalData ||
      inquisitorResultModalData ||
      priestTargetModalData ||
      baronResultModalData ||
      baronTargetModalData ||
      targetMessageModalData ||
      showGuardTargetPrompt ||
      roundEndModalData ||
      isModalTransitioning
    );
  };

  // Helper function to handle smooth modal transitions
  const handleModalTransition = async (closeCallback) => {
    setIsModalTransitioning(true);
    await closeCallback();
    setIsModalTransitioning(false);
  };

  /**
   * FIREBASE LISTENERS - Real-time data synchronization
   * These effects set up Firebase listeners to keep the game state in sync
   */

  // Listen to room data changes (players, game state) and update player data
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);

    // Debounce Firebase updates to prevent race conditions during rapid updates
    let debounceTimer = null;

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      // Clear existing debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Debounce the state update to handle rapid Firebase changes
      debounceTimer = setTimeout(() => {
        // DIAGNOSTIC: Track when currentPlayer changes
        const oldCurrentPlayer = roomData?.round?.currentPlayer;
        const newCurrentPlayer = data?.round?.currentPlayer;
        const isFinalTurn = data?.round?.isFinalTurn;

        // Only log if we have valid data and meaningful change
        if (
          oldCurrentPlayer !== newCurrentPlayer &&
          oldCurrentPlayer &&
          newCurrentPlayer
        ) {
          console.log("🔄 CURRENT PLAYER CHANGED:", {
            oldCurrentPlayer,
            newCurrentPlayer,
            isMyTurn: newCurrentPlayer === nickname,
            currentIsPlaying: isPlaying,
            isFinalTurn: isFinalTurn,
          });

          // Reset isPlaying when it becomes this player's turn AND we're currently playing
          // This prevents the race condition where intermediate states cause wrong resets
          if (newCurrentPlayer === nickname && isPlaying) {
            console.log(
              "🔄 TURN START: Resetting isPlaying = false for new turn"
            );
            setIsPlaying(false);
          }

          // CRITICAL: Reset isPlaying when it's no longer this player's turn
          // This prevents the flash of Game Actions Section during turn transitions
          if (newCurrentPlayer !== nickname && isPlaying) {
            console.log(
              "🔄 TURN END: Resetting isPlaying = false - no longer my turn"
            );
            setIsPlaying(false);
          }
        }

        // Log when final turn flag is detected
        if (isFinalTurn && !roomData?.round?.isFinalTurn) {
          console.log(
            "🏆 FINAL TURN FLAG DETECTED: This is the last turn of the round!"
          );
        }

        setRoomData(data);

        if (data?.players && nickname) {
          setPlayer(data.players[nickname]);
        }

        // CRITICAL FIX: If current player is eliminated, immediately advance turn
        if (data?.round?.currentPlayer && data?.players) {
          const currentPlayerData = data.players[data.round.currentPlayer];
          if (currentPlayerData?.isOut) {
            console.log(
              "🚨 CRITICAL BUG FIX: Current player is eliminated, advancing turn immediately",
              {
                currentPlayer: data.round.currentPlayer,
                isOut: currentPlayerData.isOut,
              }
            );

            // Find next non-eliminated player
            const allPlayers = Object.keys(data.players);
            const activePlayers = allPlayers.filter(
              (p) => !data.players[p].isOut
            );

            if (activePlayers.length > 1) {
              const currentIndex = activePlayers.indexOf(
                data.round.currentPlayer
              );
              const nextIndex = (currentIndex + 1) % activePlayers.length;
              const nextPlayer = activePlayers[nextIndex];

              console.log("🚨 ADVANCING TURN FROM ELIMINATED PLAYER:", {
                eliminatedPlayer: data.round.currentPlayer,
                nextPlayer: nextPlayer,
                activePlayers: activePlayers,
              });

              // Update Firebase immediately
              update(ref(db, `rooms/${roomCode}`), {
                [`round/currentPlayer`]: nextPlayer,
              });

              return; // Exit early to prevent further processing
            }
          }
        }

        // Check if round ended and show round end modal
        if (data?.gameState === "roundScoring" && data?.roundResult) {
          console.log(
            "🏆 ROUND ENDED - Showing round end modal",
            data.roundResult
          );

          // Show the round end modal with the round result data
          setRoundEndModalData(data.roundResult);
          return; // Exit early to prevent further processing
        }

        // Redirect to Game Scoring if host ends the game
        if (data?.gameState === "gameEnd") {
          console.log("🏆 Game ended - Redirecting to Game Scoring");
          navigate(`/game_scoring/${roomCode}`, {
            state: { nickname, realName },
          });
          return; // Exit early to prevent further processing
        }

        // Auto-clear info-only result modals when it's no longer this player's turn
        // This ensures attacker modals don't stay on screen forever
        if (
          data?.round?.currentPlayer !== nickname &&
          resultModalData?.isInfoOnly
        ) {
          setResultModalData(null);
        }
      }, 100); // 100ms debounce
    });

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      unsubscribe();
    };
  }, [roomCode, nickname, resultModalData, targetMessageModalData]);

  // Listen for Guard prompts targeting this player (premium mode Assassin interactions)
  useEffect(() => {
    const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
    const unsubscribe = onValue(promptRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.target === nickname) {
        setGuardTargetPromptData(data);
        setShowGuardTargetPrompt(true);
      } else if (!data) {
        // Hide the modal when guardPrompt is cleared from Firebase
        setGuardTargetPromptData(null);
        setShowGuardTargetPrompt(false);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen for Inquisitor results targeting this player
  useEffect(() => {
    const inquisitorRef = ref(db, `rooms/${roomCode}/inquisitorResult`);
    const unsubscribe = onValue(inquisitorRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.originalTarget === nickname) {
        console.log(
          "🕵️ INQUISITOR RESULT received for target:",
          nickname,
          data
        );
        setInquisitorResultModalData(data);
      } else if (!data) {
        setInquisitorResultModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to notifications feed for real-time game updates
  useEffect(() => {
    const notifRef = ref(db, `rooms/${roomCode}/notifications`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.values(data).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setNotifications(messages);
      }
    });
    return () => unsubscribe();
  }, [roomCode]);

  // Listen to action results to show effect modals for card outcomes
  useEffect(() => {
    console.log("actionResult useEffect called!");

    const refResult = ref(db, `rooms/${roomCode}/actionResult`);
    const unsubscribe = onValue(refResult, (snapshot) => {
      const data = snapshot.val();

      console.log(
        "attacker is nickname? => ",
        data?.attacker === nickname,
        " / data.resultText: ",
        data?.resultText
      );

      if (data && data.attacker === nickname && data.resultText) {
        setResultModalData(data.resultText);
      } else if (!data) {
        // Clear the modal when actionResult is cleared from Firebase
        setResultModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to priest target modal data
  useEffect(() => {
    const refPriestTarget = ref(db, `rooms/${roomCode}/priestTarget`);
    const unsubscribe = onValue(refPriestTarget, (snapshot) => {
      const data = snapshot.val();

      if (data && data.visibleTo === nickname) {
        // Show target modal to the target player
        setPriestTargetModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        setPriestTargetModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to baron target modal data
  useEffect(() => {
    const refBaronTarget = ref(db, `rooms/${roomCode}/baronTarget`);
    const unsubscribe = onValue(refBaronTarget, (snapshot) => {
      const data = snapshot.val();

      if (data && data.visibleTo === nickname) {
        // Show Baron target modal to the target player
        setBaronTargetModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        setBaronTargetModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  // Listen to general target message modal data (for Prince, etc.)
  useEffect(() => {
    const refTargetMessage = ref(db, `rooms/${roomCode}/targetMessage`);
    const unsubscribe = onValue(refTargetMessage, (snapshot) => {
      const data = snapshot.val();

      console.log("🎯 TARGET MESSAGE LISTENER: Received data:", {
        data,
        nickname,
        isVisibleToMe: data?.visibleTo === nickname,
      });

      if (data && data.visibleTo === nickname) {
        // Show target message modal to the target player
        console.log(
          "🎯 TARGET MESSAGE LISTENER: Setting target message modal data:",
          data
        );
        setTargetMessageModalData(data);
      } else if (!data) {
        // Clear the modal when data is cleared
        console.log(
          "🎯 TARGET MESSAGE LISTENER: Clearing target message modal data"
        );
        setTargetMessageModalData(null);
      }
    });
    return () => unsubscribe();
  }, [roomCode, nickname]);

  const { round, players } = roomData || {};
  const currentPlayer = round?.currentPlayer;
  const isMyTurn = nickname === currentPlayer;

  const drawCard = () => {
    // Prevent drawing card if round has ended
    if (roomData?.gameState === "roundScoring") {
      console.log("🛑 DRAW CARD blocked - Round has ended");
      return;
    }

    console.log(
      "🃏 DRAW CARD button clicked / NOT my Turn? => ",
      !isMyTurn,
      " / playerHandLength: ",
      player.hand?.length,
      " / isPlaying? ",
      isPlaying,
      " / should NOT draw? => ",
      !isMyTurn || player.hand?.length !== 1 || isPlaying
    );

    // DIAGNOSTIC: Log detailed state to debug why isPlaying might be stuck
    console.log("🔍 DIAGNOSTIC - isPlaying state analysis:", {
      isPlaying,
      isMyTurn,
      currentPlayer: currentPlayer,
      nickname: nickname,
      playerHandLength: player?.hand?.length,
      selectedCardIndex,
      showTargetModal,
      resultModalData: !!resultModalData,
      priestTargetModalData: !!priestTargetModalData,
      baronResultModalData: !!baronResultModalData,
      targetMessageModalData: !!targetMessageModalData,
      inquisitorResultModalData: !!inquisitorResultModalData,
    });

    if (!isMyTurn || player.hand?.length !== 1 || isPlaying) return;

    // Check if deck is empty before trying to draw
    if (!round.deck || round.deck.length === 0) {
      console.log("❌ Cannot draw card: deck is empty");
      // Also check if this is already flagged as final turn
      if (round.isFinalTurn) {
        console.log(
          "🏆 FINAL TURN: Deck is empty and this is flagged as the final turn"
        );
      }
      // Don't trigger round end check here - wait for turn completion
      return;
    }

    const nextCard = round.deck[0];
    const newDeck = round.deck.slice(1);
    const newHand = [...player.hand, nextCard];
    const roomRef = ref(db, `rooms/${roomCode}`);

    // Check if deck is now empty (round end condition)
    if (newDeck.length === 0) {
      console.log(
        "🏆 DECK EMPTY: Last card drawn, flagging this as the final turn in Firebase"
      );
      // Flag in Firebase that this is the final turn - all players will see this
      update(roomRef, {
        round: { ...round, deck: newDeck, isFinalTurn: true },
        [`players/${nickname}/hand`]: newHand,
      });
    } else {
      // Normal deck update
      update(roomRef, {
        round: { ...round, deck: newDeck },
        [`players/${nickname}/hand`]: newHand,
      });
    }

    // Keep ActionModal open for card selection after drawing
    // The modal will stay open until the player plays a card
  };

  // 🎭 Countess Force-Play Detection
  const getCountessForcePlay = (hand) => {
    if (!hand || hand.length !== 2) return { forced: false };

    const hasCountess = hand.some((card) => card.id === 7);
    const hasPrince = hand.some((card) => card.id === 5);
    const hasPhantomKing = hand.some((card) => card.id === 6);

    if (hasCountess && hasPrince) {
      return {
        forced: true,
        countessIndex: hand.findIndex((card) => card.id === 7),
        blockedCard: "Prince",
        reason:
          "🎭 The Countess knows the Princess's preferences better than the Prince - she must handle this personally!",
      };
    }

    if (hasCountess && hasPhantomKing) {
      return {
        forced: true,
        countessIndex: hand.findIndex((card) => card.id === 7),
        blockedCard: "Phantom King",
        reason:
          "🎭 The Countess is a master of court etiquette - she insists on handling this delicate matter herself!",
      };
    }

    return { forced: false };
  };

  const handleCardBack = () => {
    // Reset UI selection states when going back
    setSelectedCardForUI(null);
    setSelectedCardIndex(null);
    setShowTargetModal(false);
  };

  const playCard = (index, actionData = null) => {
    // Prevent playing card if round has ended
    if (roomData?.gameState === "roundScoring") {
      console.log("🛑 PLAY CARD blocked - Round has ended");
      return;
    }

    const card = player.hand[index];

    // First, always set the UI state to show which card was selected
    setSelectedCardForUI(index);

    // If actionData is provided, it means ActionModal already handled target selection
    if (actionData) {
      // Handle the action based on card type with target/guess data
      if ([1, 2, 3, 6, 9].includes(card.id)) {
        // Cards that need target selection (Guard, Priest, Baron, Phantom King, Inquisitor)
        // Pass the card index directly to avoid state timing issues
        handleTargetConfirmWithIndex(index, actionData);
        return;
      }
    }

    // Original logic for cards that don't need ActionModal target selection
    // or when called from old system
    if ([1, 2, 3, 6, 9].includes(card.id)) {
      // Cards that need target selection (Guard, Priest, Baron, Phantom King, Inquisitor)
      setSelectedCardIndex(index);
      setShowTargetModal(true);
    } else if (card.id === 4) {
      // HANDMAID CARD - No target needed, apply effect immediately
      playHandmaid(index);
    } else if (card.id === 5) {
      // PRINCE CARD - Needs target selection (including "Yourself" option)
      setSelectedCardIndex(index);
      setShowTargetModal(true);
    } else if (card.id === 7) {
      // COUNTESS CARD - No target needed, royal presence effect immediately
      playCountess(index);
    } else if (card.id === 8) {
      // PRINCESS CARD - No target needed, immediate elimination!
      playPrincess(index);
    } else if (card.id === 14) {
      // ASSASSIN CARD - No target needed, shadow moves through the court
      playAssassin(index);
    }
  };

  const playHandmaid = async (index) => {
    setSelectedCardIndex(index);
    console.log("🛡️ HANDMAID: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Handmaid protection
    const result = await applyHandmaidEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification
    pushNotification(roomCode, result.publicMessage);

    // Show protection confirmation modal to the player
    setResultModalData({
      resultText: result.playerMessage,
      isHandmaidProtection: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playCountess = async (index) => {
    setSelectedCardIndex(index);
    console.log("🎭 COUNTESS: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Countess effect (royal presence)
    const result = await applyCountessEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification about the royal appearance
    pushNotification(roomCode, result.publicMessage);

    // Show royal confirmation modal to the player
    setResultModalData({
      resultText: result.playerMessage,
      isCountessRoyalty: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playPrincess = async (index) => {
    setSelectedCardIndex(index);
    console.log("👑 PRINCESS: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Princess effect (immediate elimination!)
    const result = await applyPrincessEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification about the royal catastrophe
    pushNotification(roomCode, result.publicMessage);

    // Show tragic elimination modal to the player
    setResultModalData({
      resultText: result.playerMessage,
      isPrincessElimination: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const playAssassin = async (index) => {
    setSelectedCardIndex(index);
    console.log("🗡️ ASSASSIN: Setting isPlaying = true");
    setIsPlaying(true);

    // Apply Assassin effect (mysterious shadow moves)
    const result = await applyAssassinEffect({
      roomCode,
      player: nickname,
    });

    // Send public notification about the shadow in the court
    pushNotification(roomCode, result.publicMessage);

    // Show mysterious shadow modal to the player
    setResultModalData({
      resultText: result.playerMessage,
      isAssassinShadow: true,
    });

    // Note: Turn will be completed when player closes the result modal
  };

  const handleTargetConfirm = async ({ target, guess }) => {
    const cardPlayed = player.hand[selectedCardIndex];
    setShowTargetModal(false);
    console.log(
      "🎯 TARGET CONFIRM: Setting isPlaying = true for card:",
      cardPlayed?.name || cardPlayed?.id
    );
    setIsPlaying(true);

    // === SKIP TURN CASE (All players protected by Handmaid) ===
    if (target === "SKIP_TURN") {
      // Show a result modal explaining the skip
      setResultModalData({
        resultText: `🫖✨ Alas! All other players are cozily protected by the Princess' Handmaid, sipping tea in her chambers. Your ${
          cardNames[cardPlayed.id]
        } cannot find a target, so your turn is skipped.`,
      });

      // Note: Turn will be completed when player closes the result modal
      return;
    }

    // === GUARD CARD LOGIC (ID: 1) ===
    if (cardPlayed.id === 1) {
      // Apply the Guard effect to determine the outcome
      const result = await applyGuardEffect({
        roomCode,
        attacker: nickname,
        target,
        guess,
      });

      // Notify all players about the Guard action
      pushNotification(
        roomCode,
        `${nickname} played a Guard and pointed their finger at ${target}, whispering: "Strength ${guess}!"`
      );

      // ALWAYS show AssassinPromptModal to target (good UX for both modes)
      // In premium mode: target can choose to use Assassin or not
      // In normal mode: target just acknowledges the attack
      const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
      await update(promptRef, {
        ...result,
        timestamp: Date.now(),
        // Store card play info so we can complete the turn later
        cardPlayInfo: {
          playedCardIndex: selectedCardIndex,
          playerNickname: nickname,
        },
      });
      // Exit early - AssassinPromptModal will handle the rest for both modes
      return;
    }

    // === PRIEST CARD LOGIC (ID: 2) ===
    else if (cardPlayed.id === 2) {
      const priestResult = await applyPriestEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (priestResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${priestResult.message}`,
        });
        return;
      }

      // Send notifications with medieval fun! 🏰
      pushNotification(roomCode, priestResult.publicMessage);

      // Show the target modal to the target (no button needed)
      await update(ref(db, `rooms/${roomCode}/priestTarget`), {
        visibleTo: target,
        attacker: nickname,
        targetCard: priestResult.targetCard,
      });

      // Show the result to the attacker with card details
      setResultModalData({
        resultText: priestResult.attackerMessage,
        cardDetails: {
          "Target Player": target,
          "Revealed Card": `${priestResult.targetCard.name} (Strength ${priestResult.targetCard.strength})`,
          "Card Effect":
            priestResult.targetCard.effect || "No effect description available",
        },
      });

      // Priest effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === BARON CARD LOGIC (ID: 3) ===
    else if (cardPlayed.id === 3) {
      const baronResult = await applyBaronEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (baronResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${baronResult.message}`,
        });
        return;
      }

      // Send the public notification (reveals eliminated player's card only)
      pushNotification(roomCode, baronResult.publicMessage);

      // Show Baron result modal to the target (no button needed)
      await update(ref(db, `rooms/${roomCode}/baronTarget`), {
        visibleTo: target,
        attacker: nickname,
        targetName: target,
        attackerCard: baronResult.attackerCard,
        targetCard: baronResult.targetCard,
        eliminatedPlayer: baronResult.eliminatedPlayer,
        isTie: baronResult.isTie,
        targetMessage: baronResult.targetMessage,
      });

      // Show Baron result modal to the attacker (with confirm button to control game flow)
      setBaronResultModalData({
        attackerName: nickname,
        targetName: target,
        attackerCard: baronResult.attackerCard,
        targetCard: baronResult.targetCard,
        eliminatedPlayer: baronResult.eliminatedPlayer,
        isTie: baronResult.isTie,
        attackerMessage: baronResult.attackerMessage,
        targetMessage: baronResult.targetMessage,
      });

      // Baron effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === PRINCE CARD LOGIC (ID: 5) ===
    else if (cardPlayed.id === 5) {
      // Clear any existing target messages to ensure clean state
      await set(ref(db, `rooms/${roomCode}/targetMessage`), null);

      // Store the original attacker hand before Prince effect modifies it
      const originalAttackerHand = [...player.hand];

      const princeResult = await applyPrinceEffect({
        roomCode,
        attacker: nickname,
        target,
      });

      if (princeResult.result === "error") {
        setResultModalData({
          resultText: `❌ Error: ${princeResult.error}`,
        });
        return;
      }

      console.log(
        "PRINCE RESULT from applyPrinceEffect:",
        princeResult,
        " / isSelfTarget? => ",
        princeResult?.isSelfTarget
      );

      // Send the public notification
      pushNotification(roomCode, princeResult.publicMessage);

      // Show result modal to the attacker (prince player)
      setResultModalData({
        resultText: princeResult.attackerMessage,
        isInfoOnly: !princeResult.isSelfTarget, // For self-targeting, modal should advance turn
        isPrinceModal: true, // Flag to identify this as a Prince modal
        originalCardId: 5, // The Prince card ID
        originalAttackerHand: originalAttackerHand, // Store original hand for turn completion
      });

      // Only send target message via Firebase for external targeting
      if (!princeResult.isSelfTarget && princeResult.targetMessage) {
        console.log(
          "🤴 PRINCE DEBUG: Creating target message for external target:",
          {
            target,
            targetMessage: princeResult.targetMessage,
          }
        );

        await update(ref(db, `rooms/${roomCode}/targetMessage`), {
          visibleTo: target,
          message: princeResult.targetMessage,
          from: nickname,
          cardName: "Prince",
          shouldAdvanceTurn: true, // This modal controls turn advancement for external targeting
          selectedCardIndex: selectedCardIndex,
          originalAttackerHand: originalAttackerHand,
        });
      }

      console.log(
        "🤴 PRINCE DEBUG: Target message sent to Firebase for player:",
        target
      ); // Prince effect is complete - return early, turn will be completed when result modal is closed
      return;
    }

    // === PHANTOM KING CARD LOGIC (ID: 6) ===
    else if (cardPlayed.id === 6) {
      console.log(
        "🎭 PHANTOM KING DEBUG: The ethereal sovereign awakens, preparing mystical exchange with target:",
        target
      );

      try {
        // STEP 1: Discard Phantom King FIRST, before any effect processing
        console.log(
          "🎭 PHANTOM KING STEP 1: Discarding the ethereal sovereign..."
        );
        const newHand = player.hand.filter(
          (_, index) => index !== selectedCardIndex
        );
        const newDiscard = [...(player.discard || []), cardPlayed];

        // Apply the discard immediately to Firebase
        await update(ref(db, `rooms/${roomCode}`), {
          [`players/${nickname}/hand`]: newHand,
          [`players/${nickname}/discard`]: newDiscard,
        });

        console.log(
          "🎭 PHANTOM KING STEP 1 COMPLETE: Phantom King banished to discard pile"
        );

        // STEP 2: Apply hand swap effect (now both players have exactly 1 card)
        console.log(
          "🎭 PHANTOM KING STEP 2: Weaving mystical hand exchange..."
        );
        const result = await applyPhantomKingEffect({
          roomCode,
          attacker: nickname,
          target: target,
        });

        if (result.result === "success") {
          console.log(
            "🎭 PHANTOM KING STEP 2 COMPLETE: Hands have been exchanged"
          );

          // STEP 3: Show modals and notifications
          console.log(
            "🎭 PHANTOM KING STEP 3: Manifesting ethereal communications..."
          );

          // Send target message if there's a target involved
          if (result.targetMessage) {
            console.log("🎭 PHANTOM KING: Sending ethereal message to target");
            await update(
              ref(db, `rooms/${roomCode}/targetMessage`),
              result.targetMessage
            );
          }

          // Show attacker result modal (this will advance turn)
          setResultModalData({
            resultText: result.resultText,
            isInfoOnly: false, // Phantom King attacker modal advances turn
            cardPlayed: 6, // Phantom King ID
          });

          // Push notification to the royal court
          await pushNotification(roomCode, result.message);

          console.log(
            "🎭 PHANTOM KING STEP 3 COMPLETE: All communications sent"
          );
        } else if (result.result === "skipped") {
          // Handle the king's discretion
          setResultModalData({
            resultText: result.resultText,
            isInfoOnly: false, // Still advance turn even when skipped
            cardPlayed: 6, // Phantom King ID
          });
          await pushNotification(roomCode, result.message);
        } else {
          console.error("🎭 Phantom King exchange failed:", result.message);
          setResultModalData({
            resultText: `💀 The Phantom King's power falters... ${result.message}`,
          });
        }
      } catch (error) {
        console.error("🎭 Error invoking Phantom King magic:", error);
        setResultModalData({
          resultText: `💀 The shadows reject this exchange: ${error.message}`,
        });
      }

      return;
    }

    // === INQUISITOR CARD LOGIC (ID: 9) ===
    else if (cardPlayed.id === 9) {
      console.log(
        `🕵️ INQUISITOR: ${nickname} investigates ${target} for strength ${guess}`
      );

      const result = await applyInquisitorEffect({
        roomCode,
        attacker: nickname,
        target,
        guess,
      });

      // Handle skip turn case
      if (target === "SKIP_TURN") {
        setResultModalData({
          resultText: `🫖✨ Alas! All other players are cozily protected by the Princess' Handmaid, sipping tea in her chambers. Your Inquisitor cannot find a target to investigate, so your turn is skipped. ☕🔍`,
        });
        return;
      }

      if (result.result === "error") {
        console.error("🕵️ INQUISITOR ERROR:", result.error);
        setResultModalData({
          resultText: `🕵️ Investigation failed: ${result.error}`,
        });
        return;
      }

      // Notify all players about the investigation
      pushNotification(roomCode, result.publicMessage);

      // Show attacker's result modal first (info only) with card details
      setResultModalData({
        resultText: result.attackerMessage,
      });

      // Set up target modal in Firebase for the target player
      await update(ref(db, `rooms/${roomCode}/inquisitorResult`), {
        ...result.targetModalData,
        timestamp: Date.now(),
        cardPlayInfo: {
          playedCardIndex: selectedCardIndex,
          playerNickname: nickname,
        },
      });

      return;
    }
  };

  // NEW: Handle target confirmation with direct card index (for ActionModal)
  const handleTargetConfirmWithIndex = async (cardIndex, { target, guess }) => {
    const cardPlayed = player.hand[cardIndex];
    console.log(
      "🎯 TARGET CONFIRM WITH INDEX: Setting isPlaying = true for card:",
      cardPlayed?.name || cardPlayed?.id
    );
    setIsPlaying(true);

    // Validation check: Ensure cardPlayed exists
    if (!cardPlayed) {
      console.error("❌ ERROR: cardPlayed is undefined. cardIndex:", cardIndex);
      setIsPlaying(false);
      return;
    }

    // === SKIP TURN CASE (All players protected by Handmaid) ===
    if (target === "SKIP_TURN") {
      setResultModalData({
        resultText: `🫖✨ Alas! All other players are cozily protected by the Princess' Handmaid, sipping tea in her chambers. Your ${
          cardNames[cardPlayed.id]
        } cannot find a target, so your turn is skipped.`,
      });
      return;
    }

    // === GUARD CARD LOGIC (ID: 1) ===
    if (cardPlayed.id === 1) {
      // Apply the Guard effect to determine the outcome
      const result = await applyGuardEffect({
        roomCode,
        attacker: nickname,
        target,
        guess,
      });

      // Notify all players about the Guard action
      pushNotification(
        roomCode,
        `${nickname} played a Guard and pointed their finger at ${target}, whispering: "Strength ${guess}!"`
      );

      // ALWAYS show AssassinPromptModal to target (good UX for both modes)
      // In premium mode: target can choose to use Assassin or not
      // In normal mode: target just acknowledges the attack
      const promptRef = ref(db, `rooms/${roomCode}/guardPrompt`);
      await update(promptRef, {
        ...result,
        timestamp: Date.now(),
        // Store card play info so we can complete the turn later
        cardPlayInfo: {
          playedCardIndex: cardIndex, // Use cardIndex instead of selectedCardIndex
          playerNickname: nickname,
        },
      });
      // Exit early - AssassinPromptModal will handle the rest for both modes
      return;
    }

    // === PRIEST CARD LOGIC (ID: 2) ===
    else if (cardPlayed.id === 2) {
      const result = await applyPriestEffect({
        roomCode,
        attacker: nickname,
        target,
      });
      setResultModalData({
        resultText: result.attackerMessage,
      });
      pushNotification(roomCode, result.publicMessage);
      return;
    }

    // === BARON CARD LOGIC (ID: 3) ===
    else if (cardPlayed.id === 3) {
      const result = await applyBaronEffect({
        roomCode,
        attacker: nickname,
        target,
      });
      setResultModalData({
        resultText: result.attackerMessage,
      });
      pushNotification(roomCode, result.publicMessage);
      return;
    }

    // === PHANTOM KING CARD LOGIC (ID: 6) ===
    else if (cardPlayed.id === 6) {
      const result = await applyPhantomKingEffect({
        roomCode,
        attacker: nickname,
        target,
      });
      setResultModalData({
        resultText: result.attackerMessage,
        cardPlayed: 6, // Special flag for Phantom King
      });
      pushNotification(roomCode, result.publicMessage);
      return;
    }

    // Fallback for unknown cards
    setIsPlaying(false);
    console.error(
      "❌ Unknown card ID in handleTargetConfirmWithIndex:",
      cardPlayed?.id
    );
  };

  /**
   * Completes the current player's turn for non-Guard effects
   * This handles discarding the played card and advancing to the next player
   */
  const handleEffectResultClose = async () => {
    // Special handling for Phantom King - effect is already complete
    if (resultModalData?.cardPlayed === 6) {
      console.log("👻 PHANTOM KING: Using special turn completion");
      await completePhantomKingTurn();
      return;
    }

    // Special handling for Countess - simple discard and turn advancement
    if (resultModalData?.isCountessRoyalty) {
      console.log("🎭 COUNTESS: Using special turn completion");
      await completeCountessTurn();
      return;
    }

    // Special handling for Handmaid - protection effect is already applied
    if (resultModalData?.isHandmaidProtection) {
      console.log("🛡️ HANDMAID: Using special turn completion");
      await completeHandmaidTurn();
      return;
    }

    // Special handling for Princess - elimination effect is already applied
    if (resultModalData?.isPrincessElimination) {
      console.log("👑 PRINCESS: Using special turn completion");
      await completePrincessTurn();
      return;
    }

    // Standard validation for other cards
    if (
      selectedCardIndex === null ||
      selectedCardIndex === undefined ||
      selectedCardIndex < 0 ||
      !player?.hand ||
      player.hand.length === 0 ||
      selectedCardIndex >= player.hand.length
    ) {
      console.error(
        "Cannot complete turn - invalid selectedCardIndex or hand state:",
        {
          selectedCardIndex,
          handLength: player?.hand?.length,
        }
      );
      return;
    }

    await completeTurnWithCardIndex(selectedCardIndex);
  };

  /**
   * Completes the turn using a specific card index (used by target message modals)
   */
  const completeTurnWithCardIndex = async (cardIndex) => {
    console.log("🔄 TURN COMPLETION DEBUG: Starting with data:", {
      cardIndex,
      cardIndexType: typeof cardIndex,
      player,
      playerHand: player?.hand,
      handLength: player?.hand?.length,
      nickname,
      roomCode,
    });

    // Validate that we have the necessary data to complete the turn
    if (
      cardIndex === null ||
      cardIndex === undefined ||
      cardIndex < 0 ||
      !player?.hand ||
      player.hand.length === 0 ||
      cardIndex >= player.hand.length
    ) {
      console.error(
        "🔄 TURN COMPLETION ERROR: Cannot complete turn - invalid cardIndex or hand state:",
        {
          cardIndex,
          cardIndexType: typeof cardIndex,
          handLength: player?.hand?.length,
          player: player,
        }
      );
      return;
    }

    const playedCard = player.hand[cardIndex];
    // Build remaining hand by filtering out the played card
    const remainingHand = player.hand.filter((_, index) => index !== cardIndex);
    const newDiscard = [...(player.discard || []), playedCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }
    const nextPlayer = activePlayers[nextIndex];

    // Final validation before Firebase update
    if (!playedCard || !nextPlayer) {
      console.error("Invalid values detected before Firebase update:", {
        playedCard,
        remainingHand,
        nextPlayer,
      });
      return;
    }

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update Firebase with the turn completion
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: remainingHand,
      [`players/${nickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );

    // Check for round end conditions after turn completion
    console.log("🔍 ROUND END CHECK: After Turn Completion");
    const roundEndResult = await checkRoundEndConditions(roomCode);

    // Also check if this was the final turn (deck empty flag)
    const isFinalTurn = roomData?.round?.isFinalTurn;
    console.log("🏆 FINAL TURN CHECK:", { isFinalTurn, roundEndResult });

    if (roundEndResult.isRoundEnd || isFinalTurn) {
      console.log("🏆 ROUND END DETECTED:", { roundEndResult, isFinalTurn });

      // Add a delay to allow modals to be displayed and players to read effects
      setTimeout(async () => {
        console.log("🏆 TRIGGERING ROUND END after delay");
        // Trigger round end - it will do a fresh check internally
        await triggerRoundEnd(roomCode);
      }, 3000); // Reduced delay since modal will handle the timing now

      return; // Don't reset isPlaying yet, let the round end handle it
    }

    // Reset local state only if round didn't end
    console.log(
      "🔄 TURN COMPLETION: Resetting card selection state (isPlaying will be reset by Firebase listener)"
    );
    // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
    setSelectedCardIndex(null);
    setSelectedCardForUI(null);
  };

  /**
   * Completes the Guard turn using data from guardTargetPromptData
   */
  const completeGuardTurn = async (guardData) => {
    if (!guardData?.cardPlayInfo) {
      console.error(
        "🔄 GUARD TURN COMPLETION ERROR: Missing cardPlayInfo in guardData:",
        guardData
      );
      return;
    }

    const { playedCardIndex, playerNickname } = guardData.cardPlayInfo;

    console.log("🛡️ GUARD TURN COMPLETION DEBUG: Starting with data:", {
      playedCardIndex,
      playerNickname,
      currentNickname: nickname,
      guardData,
    });

    // Only the attacker should complete their own turn
    if (playerNickname !== nickname) {
      console.log(
        "🛡️ GUARD TURN COMPLETION: Not the attacker, skipping turn completion"
      );
      return;
    }

    // Use the existing turn completion logic
    await completeTurnWithCardIndex(playedCardIndex);
  };

  /**
   * Completes a card play using cardPlayInfo data (for Inquisitor and similar cards)
   */
  const completeCardPlay = async (cardIndex, playerNickname) => {
    console.log("🔄 CARD PLAY COMPLETION DEBUG: Starting with data:", {
      cardIndex,
      playerNickname,
      currentNickname: nickname,
    });

    // Only the original player should complete their own turn
    if (playerNickname !== nickname) {
      console.log(
        "🔄 CARD PLAY COMPLETION: Not the original player, skipping turn completion"
      );
      return;
    }

    // Use the existing turn completion logic
    await completeTurnWithCardIndex(cardIndex);
  };

  /**
   * Completes the Prince turn - special logic since Prince effect has already been applied
   */
  const completePrinceTurn = async (
    cardIndex,
    attackerNickname,
    originalAttackerHand
  ) => {
    console.log("👑 PRINCE TURN COMPLETION DEBUG: Starting with data:", {
      cardIndex,
      attackerNickname,
      currentNickname: nickname,
      originalAttackerHand,
      players,
      roomData,
    });

    const isSelfTargeting = attackerNickname === nickname;

    console.log("👑 PRINCE TURN: isSelfTargeting? => ", isSelfTargeting);

    // For self-targeting, the Prince effect has already been applied and the hand is correct
    // We only need to update the discard pile and advance the turn
    if (isSelfTargeting) {
      console.log(
        "👑 PRINCE TURN: Self-targeting - Prince effect already applied, only completing turn"
      );

      // Validate card index for discard calculation
      if (
        cardIndex === null ||
        cardIndex === undefined ||
        !originalAttackerHand ||
        originalAttackerHand.length !== 2
      ) {
        console.error(
          "👑 PRINCE TURN COMPLETION ERROR: Invalid data for self-targeting:",
          {
            cardIndex,
            originalAttackerHand,
          }
        );
        return;
      }

      const playedCard = originalAttackerHand[cardIndex];
      const attackerData = players[attackerNickname];
      const newDiscard = [...(attackerData.discard || []), playedCard];

      // Calculate next player in turn order (skip eliminated players)
      const activePlayers = Object.keys(players).filter(
        (p) => !players[p].isOut
      );
      const currentIndex = activePlayers.indexOf(attackerNickname);
      let nextIndex = (currentIndex + 1) % activePlayers.length;

      // Skip any players that got eliminated during this turn
      while (
        players[activePlayers[nextIndex]]?.isOut &&
        nextIndex !== currentIndex
      ) {
        nextIndex = (nextIndex + 1) % activePlayers.length;
      }
      const nextPlayer = activePlayers[nextIndex];

      // Clean up Handmaid protection for the next player
      const currentProtected = roomData?.protectedPlayers || [];
      const updatedProtected = currentProtected.filter(
        (player) => player !== nextPlayer
      );

      console.log(
        "👑 PRINCE TURN COMPLETION: Self-targeting - updating discard and advancing turn:",
        {
          newDiscard,
          nextPlayer,
        }
      );

      // TODO CHECK IF IT SHOULD ALWAYS BE attackerNickname discard that we update
      // For self-targeting: ONLY update discard and advance turn
      // DO NOT modify hand - it was already correctly updated by applyPrinceEffect
      await update(ref(db, `rooms/${roomCode}`), {
        [`players/${attackerNickname}/discard`]: newDiscard,
        [`round/currentPlayer`]: nextPlayer,
        protectedPlayers: updatedProtected,
      });

      // Notify all players about the turn change
      pushNotification(
        roomCode,
        `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
      );

      return;
    }

    // For external targeting, use current attacker data (original logic)
    const attackerData = players[attackerNickname];
    const attackerHand = attackerData?.hand;

    console.log(
      "👑 PRINCE TURN: Using current attacker hand for external targeting:",
      attackerHand
    );

    // Validate that we have the necessary data to complete the turn
    if (
      cardIndex === null ||
      cardIndex === undefined ||
      !attackerHand ||
      attackerHand.length !== 2
    ) {
      console.error(
        "👑 PRINCE TURN COMPLETION ERROR: Cannot complete turn - invalid data:",
        {
          cardIndex,
          cardIndexType: typeof cardIndex,
          attackerHand,
          attackerHandLength: attackerHand?.length,
          isSelfTargeting,
          originalAttackerHand,
        }
      );
      return;
    }

    const playedCard = attackerHand[cardIndex];
    const remainingCard = attackerHand[1 - cardIndex];
    const newDiscard = [...(attackerData.discard || []), playedCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(attackerNickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }
    const nextPlayer = activePlayers[nextIndex];

    // Final validation before Firebase update
    if (!playedCard || !remainingCard || !nextPlayer) {
      console.error(
        "👑 PRINCE Invalid values detected before Firebase update:",
        {
          playedCard,
          remainingCard,
          nextPlayer,
        }
      );
      return;
    }

    console.log(
      "👑 PRINCE TURN COMPLETION: Updating Firebase for external targeting:",
      {
        attackerNickname,
        remainingCard,
        newDiscard,
        nextPlayer,
      }
    );

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update Firebase with the turn completion for external targeting
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${attackerNickname}/hand`]: [remainingCard],
      [`players/${attackerNickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );

    // Reset local state (only if we're the attacker)
    if (nickname === attackerNickname) {
      console.log(
        "🔄 GUARD TURN COMPLETION: Resetting card selection state (isPlaying handled by Firebase listener)"
      );
      // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
      setSelectedCardIndex(null);
    }
  };

  /**
   * Completes the Phantom King turn - special logic since the effect has already been applied
   * The Phantom King card is already discarded and hands are already swapped
   */
  const completePhantomKingTurn = async () => {
    console.log(
      "👻 PHANTOM KING TURN COMPLETION: The ethereal sovereign completes their mystical work"
    );

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }

    const nextPlayer = activePlayers[nextIndex];

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update only the current player and protection (hands are already updated by the effect)
    await update(ref(db, `rooms/${roomCode}`), {
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The crown now passes to ${nextPlayer}. Destiny awaits...`
    );

    // Reset local state
    // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
    setSelectedCardIndex(null);
  };

  /**
   * Completes the Countess turn - simple discard and turn advancement
   * The Countess has no effect other than royal presence
   */
  const completeCountessTurn = async () => {
    console.log(
      "🎭 COUNTESS TURN COMPLETION: Her royal majesty completes her audience"
    );

    // Get the Countess card from the player's hand
    const countessCard = player.hand[selectedCardIndex];

    if (!countessCard || countessCard.id !== 7) {
      console.error(
        "🎭 COUNTESS ERROR: Cannot complete turn - invalid Countess card"
      );
      return;
    }

    // Remove Countess from hand and add to discard pile
    const newHand = player.hand.filter(
      (_, index) => index !== selectedCardIndex
    );
    const newDiscard = [...(player.discard || []), countessCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }

    const nextPlayer = activePlayers[nextIndex];

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update game state: discard Countess, advance turn, clear protection
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: newHand,
      [`players/${nickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The royal audience concludes. The crown now passes to ${nextPlayer}. 👑`
    );

    // Reset local state
    console.log(
      "🔄 COUNTESS TURN COMPLETION: Resetting card selection state (isPlaying handled by Firebase listener)"
    );
    // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
    setSelectedCardIndex(null);
  };

  /**
   * Completes the Handmaid turn - protection effect has already been applied
   * Just need to discard the card and advance the turn
   */
  const completeHandmaidTurn = async () => {
    console.log(
      "🛡️ HANDMAID TURN COMPLETION: Protection granted, completing turn"
    );

    // Validate selectedCardIndex and get the Handmaid card
    if (
      selectedCardIndex === null ||
      selectedCardIndex === undefined ||
      !player.hand ||
      selectedCardIndex >= player.hand.length
    ) {
      console.error(
        "🛡️ HANDMAID ERROR: Cannot complete turn - invalid selectedCardIndex:",
        { selectedCardIndex, handLength: player.hand?.length }
      );
      return;
    }

    const handmaidCard = player.hand[selectedCardIndex];

    if (!handmaidCard || handmaidCard.id !== 4) {
      console.error(
        "🛡️ HANDMAID ERROR: Cannot complete turn - invalid Handmaid card:",
        handmaidCard
      );
      return;
    }

    // Remove Handmaid from hand and add to discard pile
    const newHand = player.hand.filter(
      (_, index) => index !== selectedCardIndex
    );
    const newDiscard = [...(player.discard || []), handmaidCard];

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }

    const nextPlayer = activePlayers[nextIndex];

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update game state: discard Handmaid, advance turn, clear protection
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: newHand,
      [`players/${nickname}/discard`]: newDiscard,
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The protective charm is cast. The crown now passes to ${nextPlayer}. 🛡️`
    );

    // Reset local state
    console.log(
      "🔄 HANDMAID TURN COMPLETION: Resetting card selection state (isPlaying handled by Firebase listener)"
    );
    // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
    setSelectedCardIndex(null);
  };

  /**
   * Completes the Princess turn - elimination effect has already been applied
   * Just need to discard the card and advance the turn
   */
  const completePrincessTurn = async () => {
    console.log("👑 PRINCESS TURN COMPLETION: The royal tragedy concludes");

    // Validate selectedCardIndex and get the Princess card
    if (
      selectedCardIndex === null ||
      selectedCardIndex === undefined ||
      !player.hand ||
      selectedCardIndex >= player.hand.length
    ) {
      console.error(
        "👑 PRINCESS ERROR: Cannot complete turn - invalid selectedCardIndex:",
        { selectedCardIndex, handLength: player.hand?.length }
      );
      return;
    }

    const princessCard = player.hand[selectedCardIndex];

    if (!princessCard || princessCard.id !== 8) {
      console.error(
        "👑 PRINCESS ERROR: Cannot complete turn - invalid Princess card:",
        princessCard
      );
      return;
    }

    // Remove Princess from hand and add to discard pile
    const newHand = player.hand.filter(
      (_, index) => index !== selectedCardIndex
    );
    const newDiscard = [...(player.discard || []), princessCard];

    // NOW eliminate the player (this was moved from applyPrincessEffect)
    console.log(
      "👑 PRINCESS ELIMINATION: Player confirmed modal, now applying elimination"
    );

    // Calculate next player in turn order (skip eliminated players)
    const activePlayers = Object.keys(players).filter((p) => !players[p].isOut);
    const currentIndex = activePlayers.indexOf(nickname);
    let nextIndex = (currentIndex + 1) % activePlayers.length;

    // Skip any players that got eliminated during this turn
    while (
      players[activePlayers[nextIndex]]?.isOut &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % activePlayers.length;
    }

    const nextPlayer = activePlayers[nextIndex];

    // Clean up Handmaid protection for the next player (protection expires when their turn starts)
    const currentProtected = roomData?.protectedPlayers || [];
    const updatedProtected = currentProtected.filter(
      (player) => player !== nextPlayer
    );

    // Update game state: discard Princess, ELIMINATE PLAYER, advance turn, clear protection
    await update(ref(db, `rooms/${roomCode}`), {
      [`players/${nickname}/hand`]: newHand,
      [`players/${nickname}/discard`]: newDiscard,
      [`players/${nickname}/isOut`]: true, // CRITICAL: This elimination happens AFTER modal confirmation
      [`round/currentPlayer`]: nextPlayer,
      protectedPlayers: updatedProtected,
    });

    // NOW check for round end after Princess elimination (moved from applyPrincessEffect)
    console.log(
      "👑 PRINCESS ELIMINATION: Checking for round end after elimination"
    );
    logRoundEndCheck("After Princess Elimination (Modal Confirmed)", roomCode);

    // Notify all players about the turn change
    pushNotification(
      roomCode,
      `🕰️ The royal bloodline mourns. The crown now passes to ${nextPlayer}. 💀`
    );

    // Reset local state
    console.log(
      "🔄 PRINCESS TURN COMPLETION: Resetting card selection state (isPlaying handled by Firebase listener)"
    );
    // Don't set isPlaying(false) here - let Firebase listener handle it when turn actually changes
    setSelectedCardIndex(null);
  };

  /**
   * Handle clicking on a player section to view their discard pile
   */
  const handlePlayerSectionClick = (playerName, playerData) => {
    console.log("🎯 Player section clicked:", playerName, playerData);
    // TODO: Open player discard modal
    // For now, just log the click
  };

  if (!roomData || !player || !round || !players) {
    return <div className="play-loading">⏳ Loading game state...</div>;
  } else {
    const roundNumber = roomData?.gameStats?.currentRound || 1;
    return (
      <>
        <style>{`
          .effect-title {
            font-weight: bold;
            font-size: 1.1em;
            color: #d4af37;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            margin: 0.5em 0;
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
            margin: 0.5em 0;
            padding: 0.25em;
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
            line-height: 1.4;
            margin: 0.3em 0;
          }

          .effect-warning {
            color: #ff4444;
            font-weight: bold;
          }

          .effect-success {
            color: #44ff44;
            font-weight: bold;
          }
        `}</style>
        <div className="royal-play-container">
          {/* MAIN GAME AREA */}
          <div className="royal-game-area">
            {/* CURRENT PLAYER BANNER */}
            <div
              className={`current-player-banner ${
                currentPlayer === nickname ? "is-my-turn" : ""
              }`}
            >
              {currentPlayer === nickname ? (
                <span>👑 YOUR ROYAL TURN 👑</span>
              ) : (
                <span>
                  🎭 AWAITING {currentPlayer?.toUpperCase()}'S ROYAL DECREE 🎭
                </span>
              )}
            </div>

            {/* PLAYERS GRID */}
            <div className="players-game-grid" ref={gridRef}>
              {Object.entries(players).map(([name, p], index) => {
                const isProtected = roomData?.protectedPlayers?.includes(name);
                const isCurrentPlayer = name === currentPlayer;
                const isEliminated = p.isOut;
                const isYou = name === nickname;

                // Use dynamic calculation for popover positioning
                const shouldShowPopoverOnLeftSide =
                  shouldShowPopoverOnLeft(index);

                // Check if essential game actions are needed that would block the popover
                const shouldBlockPopover =
                  isMyTurn &&
                  !resultModalData &&
                  !priestTargetModalData &&
                  !baronResultModalData &&
                  !targetMessageModalData &&
                  (!isPlaying ||
                    (roomData?.guardPrompt &&
                      roomData.guardPrompt.attacker === nickname));

                return (
                  <div
                    key={name}
                    className={`royal-player-section ${
                      isCurrentPlayer ? "is-current-player" : ""
                    } ${isEliminated ? "is-eliminated" : ""} ${
                      isProtected ? "is-protected" : ""
                    }`}
                    onClick={() => handlePlayerSectionClick(name, p)}
                    onMouseEnter={() => setHoveredPlayer(name)}
                    onMouseLeave={() => setHoveredPlayer(null)}
                  >
                    {/* Player Header */}
                    <div className="player-header">
                      <div className={`player-name ${isYou ? "is-you" : ""}`}>
                        {isCurrentPlayer && "👑 "}
                        {p.name}
                        {p.realName && (
                          <div className="player-real-name">
                            ({isYou ? "You" : p.realName})
                          </div>
                        )}
                        {isEliminated && " 💀"}
                      </div>
                      <div className="player-tokens">
                        <span>❤️</span> <span>{p.tokens || 0}</span>
                      </div>
                    </div>

                    {/* Player Info Grid - Simplified */}
                    <div className="player-info-grid">
                      {/* Show last discarded card if any */}
                      {p.discard && p.discard.length > 0 && (
                        <div className="player-stat">
                          <span className="player-stat-label">Last Played</span>
                          <span className="player-stat-value">
                            {p.discard[p.discard.length - 1].name} (Strength{" "}
                            {p.discard[p.discard.length - 1].strength})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Special Status Indicators */}
                    {isProtected && (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "0.5rem",
                          color: "#90EE90",
                          fontSize: "0.8rem",
                        }}
                      >
                        🫖✨ Protected by Handmaid
                      </div>
                    )}
                    {isEliminated && (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "0.5rem",
                          color: "#888",
                          fontSize: "0.8rem",
                        }}
                      >
                        Eliminated this round
                      </div>
                    )}

                    {/* Discard Pile Popover */}
                    <DiscardPilePopover
                      player={p}
                      gameMode={roomData?.mode || "normal"}
                      isVisible={hoveredPlayer === name && !shouldBlockPopover}
                      showOnLeft={shouldShowPopoverOnLeftSide}
                    />
                  </div>
                );
              })}

              {/* ELIMINATION MESSAGE - Shown inside the grid for better UX */}
              {players[nickname]?.isOut && (
                <div className="royal-elimination-banner">
                  <div className="elimination-icon">💀</div>
                  <div className="elimination-content">
                    <div className="elimination-title">
                      <strong>You've been eliminated!</strong>
                    </div>
                    <div className="elimination-subtitle">
                      You can no longer play this round, but may still witness
                      the royal drama as it unfolds...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GAME ACTIONS SECTION */}
            {isMyTurn &&
              !hasActiveModal() &&
              player.hand?.length >= 1 &&
              (!isPlaying ||
                (roomData?.guardPrompt &&
                  roomData.guardPrompt.attacker === nickname)) && (
                <div className="royal-action-area-overlay">
                  <div className="royal-actions-area">
                    {/* Discard History Link - Top Right */}
                    {player.hand?.length === 2 && (
                      <button
                        className="discard-history-link"
                        onClick={() => setShowDiscardHistory(true)}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#ffd700";
                          e.target.style.textShadow =
                            "0 0 8px rgba(212, 175, 55, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#d4af37";
                          e.target.style.textShadow = "none";
                        }}
                      >
                        📜 Discard History
                      </button>
                    )}
                    {/* Discard History Modal */}
                    <DiscardHistoryModal
                      isOpen={showDiscardHistory}
                      onClose={() => setShowDiscardHistory(false)}
                      players={players}
                      roomData={roomData}
                    />
                    {isMyTurn && (
                      <div className="turn-section">
                        {player.hand?.length === 1 && <h3>It’s your turn!</h3>}
                        {player.hand?.length === 1 && (
                          <button
                            className="draw-card-button"
                            onClick={drawCard}
                          >
                            Draw Card
                          </button>
                        )}
                        {player.hand?.length === 2 && (
                          <div>
                            {(() => {
                              const countessForce = getCountessForcePlay(
                                player.hand
                              );
                              console.log(
                                "🎭 COUNTESS DEBUG: Force play check result:",
                                {
                                  hand: player.hand,
                                  countessForce,
                                  handLength: player.hand?.length,
                                }
                              );

                              return (
                                <>
                                  <p className="choose-card-header">
                                    Choose a card to play:
                                  </p>
                                  {countessForce.forced && (
                                    <div className="countess-warning">
                                      <strong>🎭 Royal Protocol Alert:</strong>
                                      <br />
                                      {countessForce.reason}
                                    </div>
                                  )}

                                  <div
                                    className={`card-selection-container ${
                                      selectedCardForUI !== null
                                        ? "card-selected"
                                        : ""
                                    }`}
                                  >
                                    {/* Show selected card on left when a card is selected */}
                                    {selectedCardForUI !== null ? (
                                      <div className="selected-card-display">
                                        {(() => {
                                          const card =
                                            player.hand[selectedCardForUI];
                                          const isBlocked =
                                            countessForce.forced &&
                                            ((card.id === 5 &&
                                              countessForce.blockedCard ===
                                                "Prince") ||
                                              (card.id === 6 &&
                                                countessForce.blockedCard ===
                                                  "Phantom King"));

                                          return (
                                            <button
                                              className={`card-button ${
                                                isBlocked ? "blocked" : ""
                                              } selected`}
                                              disabled={true}
                                            >
                                              <div className="card-strength">
                                                {card.strength}
                                              </div>
                                              <div
                                                className="card-image"
                                                style={{
                                                  backgroundImage: `url('/src/img/${getCardImage(
                                                    card.name
                                                  )}')`,
                                                }}
                                              ></div>

                                              <div className="card-content">
                                                <div className="card-name">
                                                  {card.name}
                                                </div>
                                                <div className="card-effect">
                                                  {card.effect}
                                                </div>
                                                {isBlocked && (
                                                  <div className="card-blocked-text">
                                                    🎭 Blocked by Countess
                                                  </div>
                                                )}
                                                <CardCountStars
                                                  cardId={card.id}
                                                  gameMode={roomData?.mode}
                                                />
                                              </div>
                                            </button>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      /* Show all cards when no card is selected */
                                      player.hand.map((card, index) => {
                                        const isBlocked =
                                          countessForce.forced &&
                                          ((card.id === 5 &&
                                            countessForce.blockedCard ===
                                              "Prince") ||
                                            (card.id === 6 &&
                                              countessForce.blockedCard ===
                                                "Phantom King"));

                                        return (
                                          <button
                                            key={index}
                                            onClick={() => playCard(index)}
                                            className={`card-button ${
                                              isBlocked ? "blocked" : ""
                                            }`}
                                            disabled={isPlaying || isBlocked}
                                            title={
                                              isBlocked
                                                ? `Cannot play ${card.name} - Countess demands precedence!`
                                                : ""
                                            }
                                          >
                                            <div className="card-strength">
                                              {card.strength}
                                            </div>
                                            <div
                                              className="card-image"
                                              style={{
                                                backgroundImage: `url('/src/img/${getCardImage(
                                                  card.name
                                                )}')`,
                                              }}
                                            ></div>

                                            <div className="card-content">
                                              <div className="card-name">
                                                {card.name}
                                              </div>
                                              <div className="card-effect">
                                                {card.effect}
                                              </div>
                                              {isBlocked && (
                                                <div className="card-blocked-text">
                                                  🎭 Blocked by Countess
                                                </div>
                                              )}
                                              <CardCountStars
                                                cardId={card.id}
                                                gameMode={roomData?.mode}
                                              />
                                            </div>
                                          </button>
                                        );
                                      })
                                    )}

                                    {/* Show TargetModal/InquisitorTargetModal on the right when a card is selected and modal should be shown */}
                                    {selectedCardForUI !== null &&
                                      showTargetModal &&
                                      selectedCardIndex !== null &&
                                      player.hand?.[selectedCardIndex] && (
                                        <div className="target-modal-display">
                                          {player.hand[selectedCardIndex].id ===
                                          9 ? (
                                            <InquisitorTargetModal
                                              players={players}
                                              currentPlayer={nickname}
                                              protectedPlayers={
                                                roomData?.protectedPlayers || []
                                              }
                                              onConfirm={handleTargetConfirm}
                                              onCancel={handleCardBack}
                                            />
                                          ) : (
                                            <TargetModal
                                              players={players}
                                              currentPlayer={nickname}
                                              cardPlayed={
                                                player.hand[selectedCardIndex]
                                                  .id
                                              }
                                              protectedPlayers={
                                                roomData?.protectedPlayers || []
                                              }
                                              onConfirm={handleTargetConfirm}
                                              onCancel={handleCardBack}
                                            />
                                          )}
                                        </div>
                                      )}

                                    {/* Show waiting message when AssassinPromptModal is active and current player is the attacker */}
                                    {selectedCardForUI !== null &&
                                      roomData?.guardPrompt &&
                                      roomData.guardPrompt.attacker ===
                                        nickname &&
                                      player.hand?.[selectedCardForUI]?.id ===
                                        1 && (
                                        <div className="assassin-waiting-display">
                                          <div className="assassin-waiting-content">
                                            <div className="assassin-waiting-icon">
                                              ⏳
                                            </div>
                                            <div className="assassin-waiting-title">
                                              Awaiting Fate's Response...
                                            </div>
                                            <div className="assassin-waiting-message">
                                              🗡️ Your accusation has been
                                              delivered to{" "}
                                              <strong>
                                                {roomData.guardPrompt.target}
                                              </strong>
                                              .
                                              <br />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* === GENERAL TARGET MESSAGE MODAL (Prince, etc.) === */}
            {targetMessageModalData && (
              <EffectResultModal
                resultText={targetMessageModalData.message}
                onClose={() =>
                  handleModalTransition(async () => {
                    console.log(
                      "🎯 TARGET MODAL DEBUG: Target modal closing with data:",
                      {
                        targetMessageModalData,
                        shouldAdvanceTurn:
                          targetMessageModalData.shouldAdvanceTurn,
                        selectedCardIndex:
                          targetMessageModalData.selectedCardIndex,
                        currentPlayer: player,
                        currentHand: player?.hand,
                        handLength: player?.hand?.length,
                      }
                    );

                    // Clear the target message when confirmed
                    await set(ref(db, `rooms/${roomCode}/targetMessage`), null);
                    setTargetMessageModalData(null);

                    // If this target message should advance turn, do it now using stored card index
                    if (
                      targetMessageModalData.shouldAdvanceTurn &&
                      targetMessageModalData.selectedCardIndex !== null
                    ) {
                      console.log(
                        "🎯 TARGET MODAL DEBUG: Attempting to complete turn with cardIndex:",
                        targetMessageModalData.selectedCardIndex
                      );

                      // Use the new turn advancement system to determine if target modal should advance turn
                      const cardId =
                        targetMessageModalData.cardName === "Prince"
                          ? 5
                          : targetMessageModalData.cardName === "Phantom King"
                          ? 6
                          : null;

                      if (shouldAdvanceTurnOnModal(cardId, false)) {
                        // isAttacker = false
                        // For Prince cards, we need special turn completion logic since the effect has already been applied
                        if (targetMessageModalData.cardName === "Prince") {
                          console.log(
                            "🎯 TARGET MODAL DEBUG: Prince - completing turn"
                          );
                          await completePrinceTurn(
                            targetMessageModalData.selectedCardIndex,
                            targetMessageModalData.from,
                            targetMessageModalData.originalAttackerHand
                          );
                        } else {
                          console.log(
                            "🎯 TARGET MODAL DEBUG: Advancing turn for card:",
                            targetMessageModalData.cardName
                          );
                          // Complete the turn directly using the stored card index
                          await completeTurnWithCardIndex(
                            targetMessageModalData.selectedCardIndex
                          );
                        }
                      } else {
                        console.log(
                          "🎯 TARGET MODAL DEBUG: Target modal for",
                          targetMessageModalData.cardName,
                          "should not advance turn"
                        );
                      }
                    } else {
                      console.log(
                        "🎯 TARGET MODAL DEBUG: NOT advancing turn because:",
                        {
                          shouldAdvanceTurn:
                            targetMessageModalData.shouldAdvanceTurn,
                          selectedCardIndex:
                            targetMessageModalData.selectedCardIndex,
                        }
                      );
                    }
                  })
                }
              />
            )}

            {/* === BARON RESULT MODAL === */}
            {baronResultModalData && (
              <BaronResultModal
                isOpen={true}
                userRole={
                  nickname === baronResultModalData.attackerName
                    ? "attacker"
                    : "target"
                }
                attackerName={baronResultModalData.attackerName}
                targetName={baronResultModalData.targetName}
                attackerCard={baronResultModalData.attackerCard}
                targetCard={baronResultModalData.targetCard}
                eliminatedPlayer={baronResultModalData.eliminatedPlayer}
                isTie={baronResultModalData.isTie}
                message={
                  nickname === baronResultModalData.attackerName
                    ? baronResultModalData.attackerMessage
                    : baronResultModalData.targetMessage
                }
                onConfirm={() =>
                  handleModalTransition(async () => {
                    // Only attacker can confirm to proceed with the game

                    // If there was an elimination, apply it now
                    if (
                      baronResultModalData.eliminatedPlayer &&
                      !baronResultModalData.isTie
                    ) {
                      await update(
                        ref(
                          db,
                          `rooms/${roomCode}/players/${baronResultModalData.eliminatedPlayer}`
                        ),
                        {
                          isOut: true,
                        }
                      );

                      // Notify about the elimination
                      pushNotification(
                        roomCode,
                        `⚔️💥 ${baronResultModalData.eliminatedPlayer} has been eliminated in the Baron's duel!`
                      );

                      // Check for round end after Baron elimination
                      logRoundEndCheck("After Baron Elimination", roomCode);
                    }

                    // Clear Baron target data in Firebase
                    await set(ref(db, `rooms/${roomCode}/baronTarget`), null);
                    setBaronResultModalData(null);

                    // Complete the Baron turn (discard card, advance turn)
                    if (selectedCardIndex !== null) {
                      handleEffectResultClose();
                    }
                  })
                }
              />
            )}

            {/* === PRIEST TARGET MODAL === */}
            {priestTargetModalData && (
              <PriestTargetModal
                attacker={priestTargetModalData.attacker}
                targetCard={priestTargetModalData.targetCard}
              />
            )}

            {/* === BARON TARGET MODAL === */}
            {baronTargetModalData && (
              <BaronResultModal
                isOpen={true}
                userRole="target"
                attackerName={baronTargetModalData.attacker}
                targetName={baronTargetModalData.targetName}
                attackerCard={baronTargetModalData.attackerCard}
                targetCard={baronTargetModalData.targetCard}
                eliminatedPlayer={baronTargetModalData.eliminatedPlayer}
                isTie={baronTargetModalData.isTie}
                message={baronTargetModalData.targetMessage}
                // No onConfirm for target - they just observe
              />
            )}

            {/* === ASSASSIN PROMPT MODAL === */}
            {showGuardTargetPrompt &&
              guardTargetPromptData &&
              nickname === guardTargetPromptData.target && (
                <AssassinPromptModal
                  promptData={guardTargetPromptData}
                  // Target acknowledges the guess without using Assassin
                  onAcknowledge={async () => {
                    const { isCorrectGuess, targetCard, target, attacker } =
                      guardTargetPromptData;

                    let finalResultContent;

                    if (isCorrectGuess) {
                      // Attacker guessed correctly - eliminate target
                      await update(
                        ref(db, `rooms/${roomCode}/players/${target}`),
                        { isOut: true }
                      );
                      pushNotification(
                        roomCode,
                        `🎯 ${attacker} guessed correctly! ${target} had the ${
                          cardNames[targetCard.id]
                        }. Removed from play.`
                      );
                      finalResultContent = `💀 Your suspicion proved true! ${target} held the ${
                        cardNames[targetCard.id]
                      } and has been cast from the court.`;
                    } else {
                      // Attacker guessed incorrectly - target survives
                      pushNotification(
                        roomCode,
                        `😎 ${target} shook their head. "Not even close." The guess was wrong.`
                      );
                      finalResultContent = `😅 Alas! ${target} was not holding strength ${guardTargetPromptData.guessedStrength}. Your accusation echoes hollowly in the halls.`;
                    }

                    // Clean up and send result to attacker
                    await update(ref(db, `rooms/${roomCode}`), {
                      guardPrompt: null,
                    });
                    await update(ref(db, `rooms/${roomCode}/actionResult`), {
                      resultText: finalResultContent,
                      attacker: attacker,
                    });

                    // Complete the Guard turn (discard card, advance turn)
                    await completeGuardTurn(guardTargetPromptData);

                    setGuardTargetPromptData(null);
                    setShowGuardTargetPrompt(false);
                  }}
                  // Target uses Assassin to strike back at attacker
                  onReveal={async () => {
                    const { target, attacker } = guardTargetPromptData;

                    // Apply Assassin defense (eliminates attacker, target draws new card)
                    const result = await resolveAssassinDefense({
                      roomCode,
                      attacker,
                      target,
                    });

                    pushNotification(
                      roomCode,
                      `🗡️💀 A shadow strikes! ${attacker}'s guard discovered more than they bargained for... ${target}'s deadly secret has claimed a life! ⚔️🌙`
                    );

                    const finalResultContent = `<div class="effect-title">🗡️💀 FATAL MISCALCULATION! 💀🗡️</div>
                    <div class="effect-description">⚔️ Your guard approached ${target}, confident in their investigation...</div>
                    <div class="effect-description">🌙 But from the shadows emerged a blade, swift and deadly!</div>
                    <div class="effect-description">💀 ${target} revealed the Royal Assassin and struck you down!</div>
                    <div class="effect-description">🩸 Your loyal guard lies motionless... and so do you.</div>
                    <div class="effect-quote">"Some secrets are worth killing for."</div>
                    <div class="effect-signature">- The Royal Assassin</div>
                    <div class="effect-description">💔 You have been <span class="effect-elimination">ELIMINATED</span> from this round!</div>`;

                    // Clean up and send result to attacker
                    await update(ref(db, `rooms/${roomCode}`), {
                      guardPrompt: null,
                    });
                    await update(ref(db, `rooms/${roomCode}/actionResult`), {
                      resultText: finalResultContent,
                      attacker: attacker,
                    });

                    // Complete the Guard turn (discard card, advance turn)
                    await completeGuardTurn(guardTargetPromptData);

                    setGuardTargetPromptData(null);
                    setShowGuardTargetPrompt(false);
                  }}
                  // Target ignores (same as acknowledge - for when they don't have Assassin)
                  onIgnore={async () => {
                    const { target } = guardTargetPromptData;

                    pushNotification(
                      roomCode,
                      `😎 ${target} shook their head. "Not even close." The guess was wrong.`
                    );

                    const finalResultContent = `😅 Alas! ${target} was not holding strength ${guardTargetPromptData.guessedStrength}. Your accusation echoes hollowly in the halls.`;

                    // Clean up and send result to attacker
                    await update(ref(db, `rooms/${roomCode}`), {
                      guardPrompt: null,
                    });
                    await update(ref(db, `rooms/${roomCode}/actionResult`), {
                      resultText: finalResultContent,
                      attacker: guardTargetPromptData.attacker,
                    });

                    // Complete the Guard turn (discard card, advance turn)
                    await completeGuardTurn(guardTargetPromptData);

                    setGuardTargetPromptData(null);
                    setShowGuardTargetPrompt(false);
                  }}
                />
              )}

            {/* === INQUISITOR RESULT MODAL === */}
            {inquisitorResultModalData && (
              <EffectResultModal
                resultText={inquisitorResultModalData.resultText}
                onClose={() =>
                  handleModalTransition(async () => {
                    console.log(
                      "🕵️ INQUISITOR RESULT: Target modal closing",
                      inquisitorResultModalData
                    );

                    const {
                      originalAttacker,
                      originalTarget,
                      wasCorrectGuess,
                      foundPrincess,
                      discardedCard,
                      cardPlayInfo,
                    } = inquisitorResultModalData;

                    if (wasCorrectGuess) {
                      // Award love token to attacker first
                      await awardLoveToken({
                        roomCode,
                        player: originalAttacker,
                      });

                      if (foundPrincess) {
                        // Princess found - eliminate target (no new card draw)
                        await update(
                          ref(
                            db,
                            `rooms/${roomCode}/players/${originalTarget}`
                          ),
                          {
                            hand: [], // Empty hand
                            discard: [
                              ...(roomData.players[originalTarget].discard ||
                                []),
                              discardedCard,
                            ],
                            isOut: true, // ELIMINATE
                          }
                        );
                        console.log(
                          "🕵️ PRINCESS ELIMINATION: Target eliminated for heresy"
                        );
                      } else {
                        // Normal discard and draw new card
                        const round = roomData.round;
                        const newCard = round.deck[0];
                        const newDeck = round.deck.slice(1);

                        await update(ref(db, `rooms/${roomCode}`), {
                          [`players/${originalTarget}/hand`]: [newCard],
                          [`players/${originalTarget}/discard`]: [
                            ...(roomData.players[originalTarget].discard || []),
                            discardedCard,
                          ],
                          [`round/deck`]: newDeck,
                        });
                        console.log(
                          "🕵️ HAND REPLACEMENT: Target discarded and drew new card"
                        );
                      }
                    }

                    // Clean up Firebase
                    await update(ref(db, `rooms/${roomCode}`), {
                      inquisitorResult: null,
                      actionResult: null,
                    });

                    setInquisitorResultModalData(null);

                    // Check for round end conditions after potential elimination
                    console.log(
                      "🔍 INQUISITOR ROUND END CHECK: After elimination"
                    );
                    const roundEndResult = await checkRoundEndConditions(
                      roomCode
                    );

                    if (roundEndResult.isRoundEnd) {
                      console.log(
                        "🏆 ROUND END DETECTED after Inquisitor elimination:",
                        roundEndResult
                      );

                      // Add a delay to allow players to read the elimination message
                      setTimeout(async () => {
                        console.log(
                          "🏆 TRIGGERING ROUND END after Inquisitor elimination"
                        );
                        await triggerRoundEnd(roomCode);
                      }, 2000);

                      return; // Don't complete the turn, round is ending
                    }

                    // Complete turn if round didn't end and this was the target's modal
                    if (cardPlayInfo && !inquisitorResultModalData.isInfoOnly) {
                      await completeCardPlay(
                        cardPlayInfo.playedCardIndex,
                        cardPlayInfo.playerNickname
                      );
                    }
                  })
                }
              />
            )}

            {resultModalData && (
              <EffectResultModal
                resultText={resultModalData.resultText || resultModalData}
                cardDetails={resultModalData.cardDetails || null}
                onClose={() =>
                  handleModalTransition(async () => {
                    console.log(
                      "⚔️ RESULT MODAL DEBUG: Result modal closing with data:",
                      {
                        resultModalData,
                        isInfoOnly: resultModalData.isInfoOnly,
                        selectedCardIndex,
                        nickname,
                      }
                    );

                    // Check if this player is marked for assassination and execute it
                    const executionResult =
                      await executeAssassinationElimination({
                        roomCode,
                      });

                    if (
                      executionResult.eliminated &&
                      executionResult.eliminatedPlayer === nickname
                    ) {
                      console.log(
                        "🗡️ ASSASSINATION: This player was just eliminated by the Assassin!"
                      );
                      // This player was just eliminated, no need to advance turn
                      // Check for round end after Assassin elimination
                      console.log(
                        "🗡️ ASSASSINATION: Checking for round end after elimination"
                      );
                      logRoundEndCheck(
                        "After Assassin Elimination (Modal Confirmed)",
                        roomCode
                      );

                      // Return early to prevent turn advancement
                      return;
                    }

                    await set(ref(db, `rooms/${roomCode}/actionResult`), null);
                    // Clear priest target modal if it exists
                    await set(ref(db, `rooms/${roomCode}/priestTarget`), null);
                    // Clear baron target modal if it exists
                    await set(ref(db, `rooms/${roomCode}/baronTarget`), null);
                    setResultModalData(null);
                    setSelectedCardForUI(null);

                    // Only advance turn if this is NOT an info-only modal (like Prince attacker modal)
                    if (!resultModalData.isInfoOnly) {
                      console.log(
                        "⚔️ RESULT MODAL DEBUG: Not info-only, checking if should advance turn"
                      );

                      // Special handling for Handmaid protection
                      if (resultModalData.isHandmaidProtection) {
                        console.log(
                          "🛡️ HANDMAID MODAL: Using special turn completion"
                        );
                        handleEffectResultClose();
                        return;
                      }

                      // Special handling for Countess royalty
                      if (resultModalData.isCountessRoyalty) {
                        console.log(
                          "🎭 COUNTESS MODAL: Using special turn completion"
                        );
                        handleEffectResultClose();
                        return;
                      }

                      // Special handling for Princess elimination
                      if (resultModalData.isPrincessElimination) {
                        console.log(
                          "👑 PRINCESS MODAL: Using special turn completion"
                        );
                        handleEffectResultClose();
                        return;
                      }

                      // Special handling for Assassin shadow effect
                      if (resultModalData.isAssassinShadow) {
                        console.log(
                          "🗡️ ASSASSIN MODAL: Using special turn completion"
                        );
                        handleEffectResultClose();
                        return;
                      }

                      // Only call handleEffectResultClose if selectedCardIndex is valid
                      // For Guard effects that went through AssassinPromptModal, selectedCardIndex will be null
                      if (selectedCardIndex !== null) {
                        // Use the new turn advancement system to determine if attacker modal should advance turn
                        const lastPlayedCard =
                          player?.discard?.[player.discard.length - 1];
                        const cardId = lastPlayedCard?.id;

                        // TODO: DEBUG THIS / Why do we need this if we already have the isInfoOnly data??
                        //if (shouldAdvanceTurnOnModal(cardId, true)) {
                        // isAttacker = true
                        console.log(
                          "⚔️ RESULT MODAL DEBUG: Advancing turn for card ID:",
                          cardId
                        );

                        // Special handling for Prince self-targeting
                        if (
                          resultModalData.isPrinceModal &&
                          resultModalData.originalCardId === 5
                        ) {
                          console.log(
                            "👑 RESULT MODAL: Prince self-targeting, using completePrinceTurn"
                          );
                          await completePrinceTurn(
                            selectedCardIndex,
                            nickname,
                            resultModalData.originalAttackerHand
                          );
                        } else {
                          handleEffectResultClose();
                        }
                      }
                    } else {
                      console.log(
                        "⚔️ RESULT MODAL DEBUG: Info-only modal (Prince attacker), NOT advancing turn"
                      );
                    }
                  })
                }
              />
            )}
          </div>

          {/* ROYAL CHRONICLE SIDEBAR */}
          <div className="royal-chronicle-sidebar">
            <div className="chronicle-header">
              {/* ROUND */}
              <div className="round-container">
                <div className="round-content">
                  <span role="img" aria-label="Round">
                    ⚔️
                  </span>
                  <span>Round</span>
                  <span className="round-number">{roundNumber}</span>
                </div>
              </div>
              <h3>📜 Game Chronicle</h3>
            </div>
            <div className="chronicle-content">
              {notifications.map((n, i) => (
                <div key={i} className="chronicle-notification">
                  <span className="chronicle-arrow">➤</span>
                  <span
                    className="chronicle-message"
                    dangerouslySetInnerHTML={{ __html: n.message }}
                  />
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="chronicle-empty">
                  <em>📜 The chronicle awaits the first royal decree...</em>
                </div>
              )}
            </div>
          </div>

          {/* ROUND END MODAL */}
          {roundEndModalData && (
            <RoundEndModal
              roundResult={roundEndModalData}
              players={roomData?.players || {}}
              onContinue={() => {
                console.log("🏆 Round End Modal - Continuing to scoring board");
                setRoundEndModalData(null);
                navigate(`/round_scoring/${roomCode}`, {
                  state: { nickname, realName: state?.realName },
                });
              }}
            />
          )}
        </div>
      </>
    );
  }
}
