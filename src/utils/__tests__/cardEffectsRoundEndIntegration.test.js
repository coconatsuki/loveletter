import { describe, it, expect, beforeEach, vi } from "vitest";
import { playGuard, playBaron, playPrincess } from "../cardEffects";
import { logRoundEndCheck } from "../roundEndDetection";
import { ref, get, update } from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
}));

// Mock round end detection
vi.mock("../roundEndDetection", () => ({
  logRoundEndCheck: vi.fn(),
}));

// Mock notifications
vi.mock("../pushNotification", () => ({
  pushNotification: vi.fn(),
}));

describe("Card Effects - Round End Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Guard Card - Round End Detection", () => {
    it("should trigger round end check when Guard eliminates last opponent", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 1, strength: 1 }], isOut: false },
          target: { hand: [{ id: 5, strength: 5 }], isOut: false },
          eliminated: { hand: [], isOut: true },
        },
        round: {
          currentPlayer: "attacker",
          deck: [{ id: 2, strength: 2 }],
        },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({
        isRoundEnd: true,
        winner: "attacker",
      });

      await playGuard("TEST123", "attacker", "target", 5);

      // Verify round end check was called after elimination
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "GUARD_ELIMINATION",
        "TEST123"
      );
    });

    it("should not trigger round end when Guard fails to eliminate", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 1, strength: 1 }], isOut: false },
          target: { hand: [{ id: 3, strength: 3 }], isOut: false }, // Different card
          other: { hand: [{ id: 2, strength: 2 }], isOut: false },
        },
        round: {
          currentPlayer: "attacker",
          deck: [{ id: 4, strength: 4 }],
        },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({ isRoundEnd: false });

      await playGuard("TEST123", "attacker", "target", 5); // Wrong guess

      // Should still check for round end, but won't trigger
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "GUARD_ELIMINATION",
        "TEST123"
      );
    });
  });

  describe("Baron Card - Round End Detection", () => {
    it("should trigger round end check when Baron eliminates last opponent", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 8, strength: 8 }], isOut: false }, // Princess (highest)
          target: { hand: [{ id: 3, strength: 3 }], isOut: false }, // Baron (lower)
          eliminated: { hand: [], isOut: true },
        },
        round: {
          currentPlayer: "attacker",
          deck: [{ id: 1, strength: 1 }],
        },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({
        isRoundEnd: true,
        winner: "attacker",
      });

      await playBaron("TEST123", "attacker", "target");

      // Verify round end check was called after Baron comparison
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "BARON_ELIMINATION",
        "TEST123"
      );
    });

    it("should handle Baron tie without triggering round end", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 5, strength: 5 }], isOut: false },
          target: { hand: [{ id: 5, strength: 5 }], isOut: false }, // Same strength
          other: { hand: [{ id: 2, strength: 2 }], isOut: false },
        },
        round: {
          currentPlayer: "attacker",
          deck: [{ id: 1, strength: 1 }],
        },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({ isRoundEnd: false });

      await playBaron("TEST123", "attacker", "target");

      // Should check for round end but not trigger (tie = no elimination)
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "BARON_ELIMINATION",
        "TEST123"
      );
    });
  });

  describe("Princess Card - Round End Detection", () => {
    it("should trigger round end check when Princess eliminates player", async () => {
      const roomData = {
        players: {
          player: { hand: [{ id: 8, strength: 8 }], isOut: false }, // Will be eliminated
          survivor: { hand: [{ id: 5, strength: 5 }], isOut: false },
        },
        round: {
          currentPlayer: "player",
          deck: [{ id: 1, strength: 1 }],
        },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({
        isRoundEnd: true,
        winner: "survivor",
      });

      await playPrincess("TEST123", "player");

      // Verify round end check was called after Princess self-elimination
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "PRINCESS_ELIMINATION",
        "TEST123"
      );
    });

    it("should handle Princess elimination in multi-player game", async () => {
      const roomData = {
        players: {
          player: { hand: [{ id: 8, strength: 8 }], isOut: false },
          alice: { hand: [{ id: 5, strength: 5 }], isOut: false },
          bob: { hand: [{ id: 3, strength: 3 }], isOut: false },
          charlie: { hand: [{ id: 2, strength: 2 }], isOut: false },
        },
        round: {
          currentPlayer: "player",
          deck: [{ id: 1, strength: 1 }],
        },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({ isRoundEnd: false }); // Still multiple players

      await playPrincess("TEST123", "player");

      // Should check but not trigger round end (multiple survivors)
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "PRINCESS_ELIMINATION",
        "TEST123"
      );
    });
  });

  describe("Round End State Transitions", () => {
    it("should update gameState when round end is detected", async () => {
      const roomData = {
        players: {
          winner: { hand: [{ id: 7, strength: 7 }], isOut: false, tokens: 1 },
          loser: { hand: [{ id: 3, strength: 3 }], isOut: false, tokens: 0 },
        },
        round: {
          currentPlayer: "winner",
          deck: [{ id: 1, strength: 1 }],
        },
        gameStats: { currentRound: 2, totalRoundsPlayed: 1 },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();

      // Mock round end detection that triggers state change
      logRoundEndCheck.mockImplementation(async (context, roomCode) => {
        // Simulate the actual triggerRoundEnd being called
        await update(ref({}, `rooms/${roomCode}`), {
          gameState: "roundScoring",
          "players/winner/tokens": 2,
          roundResult: {
            winner: "winner",
            type: "lastPlayerStanding",
            roundNumber: 2,
          },
        });

        return { isRoundEnd: true, winner: "winner" };
      });

      await playGuard("TEST123", "winner", "loser", 3);

      // Verify Firebase was updated with round end state
      expect(update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          gameState: "roundScoring",
          "players/winner/tokens": 2,
          roundResult: expect.objectContaining({
            winner: "winner",
            type: "lastPlayerStanding",
            roundNumber: 2,
          }),
        })
      );
    });
  });

  describe("Premium Mode - Assassin Integration", () => {
    it("should trigger round end check when Assassin strikes back", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 1, strength: 1 }], isOut: false },
          target: { hand: [{ id: 14, strength: 0 }], isOut: false }, // Has Assassin
          other: { hand: [{ id: 5, strength: 5 }], isOut: false },
        },
        round: {
          currentPlayer: "attacker",
          deck: [{ id: 2, strength: 2 }],
        },
        mode: "premium",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({ isRoundEnd: false }); // Still multiple players

      // Mock assassin being used (this would be handled in the actual Guard effect)
      await playGuard("TEST123", "attacker", "target", 5);

      // Verify round end check happens even with assassin counter-attack
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "GUARD_ELIMINATION",
        "TEST123"
      );
    });
  });

  describe("Error Handling in Round End Detection", () => {
    it("should handle Firebase errors gracefully during round end check", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 1, strength: 1 }], isOut: false },
          target: { hand: [{ id: 5, strength: 5 }], isOut: false },
        },
        round: { currentPlayer: "attacker", deck: [] },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();

      // Mock round end check that throws error
      logRoundEndCheck.mockRejectedValue(
        new Error("Firebase connection failed")
      );

      // Card effect should still complete even if round end check fails
      await expect(
        playGuard("TEST123", "attacker", "target", 5)
      ).resolves.toBeDefined();

      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "GUARD_ELIMINATION",
        "TEST123"
      );
    });

    it("should continue game if round end detection returns false", async () => {
      const roomData = {
        players: {
          attacker: { hand: [{ id: 3, strength: 3 }], isOut: false },
          target: { hand: [{ id: 5, strength: 5 }], isOut: false },
          other1: { hand: [{ id: 2, strength: 2 }], isOut: false },
          other2: { hand: [{ id: 4, strength: 4 }], isOut: false },
        },
        round: { currentPlayer: "attacker", deck: [{ id: 1, strength: 1 }] },
        mode: "normal",
      };

      get.mockResolvedValue({ val: () => roomData });
      update.mockResolvedValue();
      logRoundEndCheck.mockResolvedValue({ isRoundEnd: false }); // Round continues

      await playBaron("TEST123", "attacker", "target");

      // Verify round end was checked but game continues normally
      expect(logRoundEndCheck).toHaveBeenCalledWith(
        "BARON_ELIMINATION",
        "TEST123"
      );
      expect(update).toHaveBeenCalled(); // Normal card effect update
    });
  });
});
