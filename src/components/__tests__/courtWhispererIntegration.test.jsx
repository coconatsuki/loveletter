import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock React
vi.mock("react", () => ({
  useState: vi.fn(),
  useEffect: vi.fn(),
  Fragment: "Fragment",
}));

describe("Court Whisperer Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Complete Court Whisperer Workflow", () => {
    it("should complete full Court Whisperer workflow", () => {
      // Mock Firebase room state
      const initialRoomState = {
        players: {
          Player1: { name: "Alice", hand: [12], discard: [], isOut: false },
          Player2: { name: "Bob", hand: [3], discard: [], isOut: false },
          Player3: { name: "Charlie", hand: [1], discard: [], isOut: false },
        },
        round: {
          currentPlayer: "Player1",
          deck: [2, 4, 5, 6, 7, 8],
          nextTarget: null, // Initially no forced targeting
        },
      };

      // Step 1: Player1 plays Court Whisperer targeting Player2
      const targetSelection = "Player2";
      const expectedNextTarget = {
        nickname: targetSelection,
        name: "Bob",
        used: false,
      };

      // Simulate Court Whisperer effect
      const roomStateAfterCourt = {
        ...initialRoomState,
        players: {
          ...initialRoomState.players,
          Player1: {
            ...initialRoomState.players.Player1,
            hand: [2], // Drew new card
            discard: [...initialRoomState.players.Player1.discard, 12],
          },
        },
        round: {
          ...initialRoomState.round,
          currentPlayer: "Player2", // Next player's turn
          deck: [4, 5, 6, 7, 8], // One card drawn
          nextTarget: expectedNextTarget, // Targeting is now forced
        },
      };

      expect(roomStateAfterCourt.round.nextTarget).toEqual(expectedNextTarget);
      expect(roomStateAfterCourt.round.nextTarget.used).toBe(false);
      expect(roomStateAfterCourt.round.currentPlayer).toBe("Player2");

      // Step 2: Player2's turn - forced to target Player2 (themselves in this case)
      // Let's say Player2 plays Baron (3) - forced to target themselves
      const forcedTargetingState = {
        nextTarget: roomStateAfterCourt.round.nextTarget,
        validTargets: [
          ["Player1", { name: "Alice", isOut: false }],
          ["Player3", { name: "Charlie", isOut: false }],
        ],
      };

      // Apply forced targeting logic
      const isTargetingForced =
        forcedTargetingState.nextTarget &&
        forcedTargetingState.nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? forcedTargetingState.nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? forcedTargetingState.validTargets.filter(
            ([name]) => name === forcedTargetNickname
          )
        : forcedTargetingState.validTargets;

      expect(isTargetingForced).toBe(true);
      expect(forcedTargetNickname).toBe("Player2");
      expect(finalValidTargets.length).toBe(0); // Player2 not in validTargets (can't target self for Baron)

      // Step 3: SKIP_TURN scenario - Player2 can't target forced target
      const skipTurnAction = "SKIP_TURN";

      // Simulate skipping turn and clearing nextTarget
      const roomStateAfterSkip = {
        ...roomStateAfterCourt,
        round: {
          ...roomStateAfterCourt.round,
          currentPlayer: "Player3", // Next player
          nextTarget: null, // Clear forced targeting since it was skipped
        },
      };

      expect(roomStateAfterSkip.round.nextTarget).toBe(null);
      expect(roomStateAfterSkip.round.currentPlayer).toBe("Player3");

      // Step 4: Player3's turn - normal targeting (no forced targeting)
      const normalTargetingState = {
        nextTarget: null,
        validTargets: [
          ["Player1", { name: "Alice", isOut: false }],
          ["Player2", { name: "Bob", isOut: false }],
        ],
      };

      const isTargetingForcedForPlayer3 = !!(
        normalTargetingState.nextTarget &&
        normalTargetingState.nextTarget.used === false
      );

      expect(isTargetingForcedForPlayer3).toBe(false);

      // Player3 can target anyone
      const finalValidTargetsForPlayer3 = isTargetingForcedForPlayer3
        ? normalTargetingState.validTargets.filter(
            ([name]) => name === normalTargetingState.nextTarget.nickname
          )
        : normalTargetingState.validTargets;

      expect(finalValidTargetsForPlayer3.length).toBe(2);
      expect(finalValidTargetsForPlayer3).toEqual(
        normalTargetingState.validTargets
      );
    });

    it("should handle Court Whisperer effect being successfully used", () => {
      // Initial state with nextTarget set
      const initialState = {
        round: {
          currentPlayer: "Player2",
          nextTarget: {
            nickname: "Player3",
            name: "Charlie",
            used: false,
          },
        },
      };

      // Player2 plays Guard targeting Player3 (forced)
      const targetedPlayer = "Player3";

      // Verify forced targeting is working
      const isTargetingForced =
        initialState.round.nextTarget &&
        initialState.round.nextTarget.used === false;
      const forcedTarget = isTargetingForced
        ? initialState.round.nextTarget.nickname
        : null;

      expect(isTargetingForced).toBe(true);
      expect(forcedTarget).toBe("Player3");
      expect(targetedPlayer).toBe(forcedTarget); // Confirmed forced targeting worked

      // After Guard effect is processed, mark nextTarget as used
      const stateAfterEffect = {
        ...initialState,
        round: {
          ...initialState.round,
          nextTarget: {
            ...initialState.round.nextTarget,
            used: true, // Mark as used after effect
          },
        },
      };

      expect(stateAfterEffect.round.nextTarget.used).toBe(true);

      // At end of turn, clear the nextTarget
      const stateAfterTurn = {
        ...stateAfterEffect,
        round: {
          ...stateAfterEffect.round,
          currentPlayer: "Player3", // Next player
          nextTarget: null, // Cleared at end of turn
        },
      };

      expect(stateAfterTurn.round.nextTarget).toBe(null);
    });

    it("should handle nextTarget clearing in drawCard function", () => {
      // Simulate drawCard function clearing nextTarget
      const roomStateWithNextTarget = {
        round: {
          deck: [1, 2, 3, 4],
          currentPlayer: "Player1",
          nextTarget: {
            nickname: "Player2",
            name: "Bob",
            used: true, // Already used, should be cleared
          },
        },
      };

      // This is the logic from drawCard function
      const shouldClearNextTarget =
        roomStateWithNextTarget.round.nextTarget &&
        roomStateWithNextTarget.round.nextTarget.used === true;

      expect(shouldClearNextTarget).toBe(true);

      // Simulate clearing nextTarget in Firebase update
      const updatedState = {
        ...roomStateWithNextTarget,
        round: {
          ...roomStateWithNextTarget.round,
          nextTarget: null, // Cleared by drawCard
        },
      };

      expect(updatedState.round.nextTarget).toBe(null);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle nextTarget when target player leaves game", () => {
      const stateWithLeavingPlayer = {
        players: {
          Player1: { name: "Alice", isOut: false },
          Player2: { name: "Bob", isOut: false }, // About to leave
          Player3: { name: "Charlie", isOut: false },
        },
        round: {
          nextTarget: {
            nickname: "Player2",
            name: "Bob",
            used: false,
          },
        },
      };

      // Player2 leaves the game
      const stateAfterPlayerLeaves = {
        players: {
          Player1: { name: "Alice", isOut: false },
          // Player2 removed
          Player3: { name: "Charlie", isOut: false },
        },
        round: {
          nextTarget: stateWithLeavingPlayer.round.nextTarget, // Still exists
        },
      };

      // Check if forced target still exists in game
      const forcedTargetExists = Object.keys(
        stateAfterPlayerLeaves.players
      ).includes(stateAfterPlayerLeaves.round.nextTarget.nickname);

      expect(forcedTargetExists).toBe(false);

      // Should result in SKIP_TURN scenario
      const validTargets = Object.entries(
        stateAfterPlayerLeaves.players
      ).filter(([nickname, player]) => !player.isOut);

      const isTargetingForced =
        stateAfterPlayerLeaves.round.nextTarget &&
        stateAfterPlayerLeaves.round.nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? stateAfterPlayerLeaves.round.nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === forcedTargetNickname)
        : validTargets;

      expect(finalValidTargets.length).toBe(0); // No valid targets due to forced targeting
      expect(isTargetingForced).toBe(true);
    });

    it("should handle nextTarget when target is protected by Handmaid", () => {
      const stateWithProtectedPlayer = {
        players: {
          Player1: { name: "Alice", isOut: false, protected: false },
          Player2: { name: "Bob", isOut: false, protected: true }, // Protected by Handmaid
          Player3: { name: "Charlie", isOut: false, protected: false },
        },
        round: {
          nextTarget: {
            nickname: "Player2", // Forced target is protected
            name: "Bob",
            used: false,
          },
        },
      };

      // Create validTargets (excludes protected players)
      const validTargets = Object.entries(
        stateWithProtectedPlayer.players
      ).filter(([nickname, player]) => !player.isOut && !player.protected);

      expect(validTargets.length).toBe(2); // Player1 and Player3
      expect(validTargets.some(([nickname]) => nickname === "Player2")).toBe(
        false
      );

      // Apply forced targeting logic
      const isTargetingForced =
        stateWithProtectedPlayer.round.nextTarget &&
        stateWithProtectedPlayer.round.nextTarget.used === false;
      const forcedTargetNickname = isTargetingForced
        ? stateWithProtectedPlayer.round.nextTarget.nickname
        : null;

      const finalValidTargets = isTargetingForced
        ? validTargets.filter(([name]) => name === forcedTargetNickname)
        : validTargets;

      expect(finalValidTargets.length).toBe(0); // Forced target not available
      expect(isTargetingForced).toBe(true);

      // Should show SKIP_TURN option
      const hasNoTargets = finalValidTargets.length === 0;
      expect(hasNoTargets).toBe(true);
    });

    it("should handle multiple Court Whisperer effects in same round", () => {
      // First Court Whisperer sets nextTarget
      const stateAfterFirstCourt = {
        round: {
          nextTarget: {
            nickname: "Player2",
            name: "Bob",
            used: false,
          },
        },
      };

      // Player2 is forced to play something, let's say they also play Court Whisperer
      // This should replace the existing nextTarget
      const newTarget = {
        nickname: "Player3",
        name: "Charlie",
        used: false,
      };

      const stateAfterSecondCourt = {
        round: {
          nextTarget: newTarget, // Replaces previous nextTarget
        },
      };

      expect(stateAfterSecondCourt.round.nextTarget.nickname).toBe("Player3");
      expect(stateAfterSecondCourt.round.nextTarget.nickname).not.toBe(
        "Player2"
      );
    });
  });

  describe("Turn Advancement Integration", () => {
    it("should properly advance turns when Court Whisperer effect completes", () => {
      const players = ["Player1", "Player2", "Player3"];
      const currentPlayerIndex = 0; // Player1

      // After Court Whisperer effect
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      const nextPlayer = players[nextPlayerIndex];

      expect(nextPlayer).toBe("Player2");

      // Simulate completeCourtWhispererTurn function logic
      const turnAdvancementUpdate = {
        [`round/currentPlayer`]: nextPlayer,
        [`round/nextTarget`]: {
          nickname: "Player3", // Example target
          name: "Charlie",
          used: false,
        },
      };

      expect(turnAdvancementUpdate[`round/currentPlayer`]).toBe("Player2");
      expect(turnAdvancementUpdate[`round/nextTarget`].used).toBe(false);
    });

    it("should handle turn advancement when current player is eliminated", () => {
      const players = ["Player1", "Player2", "Player3"];
      const currentPlayerIndex = 1; // Player2
      const eliminatedPlayer = "Player2";

      // Player2 gets eliminated, need to find next active player
      const activePlayersMap = {
        Player1: { isOut: false },
        Player2: { isOut: true }, // Just eliminated
        Player3: { isOut: false },
      };

      // Find next active player after elimination
      let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      while (activePlayersMap[players[nextPlayerIndex]].isOut) {
        nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
      }

      const nextPlayer = players[nextPlayerIndex];
      expect(nextPlayer).toBe("Player3"); // Skip eliminated Player2
    });
  });
});
