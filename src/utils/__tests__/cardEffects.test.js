import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyGuardEffect } from "../cardEffects";

// Mock Firebase
vi.mock("../firebase", () => ({
  db: {},
}));

// Mock Firebase database functions
vi.mock("firebase/database", () => ({
  ref: vi.fn(() => ({ path: "mocked-ref" })),
  get: vi.fn(),
}));

describe("Guard Card Effects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Normal Mode (no Assassin cards)", () => {
    it("should return correct guess result when target has guessed card", async () => {
      // Mock Firebase data - target has Priest (strength 2)
      const mockSnapshot = {
        val: () => ({
          mode: "normal",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] }, // Attacker has Guard
            Player2: { hand: [{ id: 2, strength: 2 }] }, // Target has Priest
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyGuardEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
        guess: 2, // Guessing strength 2 (Priest)
      });

      expect(result.result).toBe("correctGuess");
      expect(result.targetCard.strength).toBe(2);
      expect(result.requiresPrompt).toBe(true); // Always show prompt to maintain mystery
      expect(result.isCorrectGuess).toBe(true);
    });

    it("should return wrong guess result when target does not have guessed card", async () => {
      // Mock Firebase data - target has Prince (strength 5), guess Priest (strength 2)
      const mockSnapshot = {
        val: () => ({
          mode: "normal",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] }, // Attacker has Guard
            Player2: { hand: [{ id: 5, strength: 5 }] }, // Target has Prince
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyGuardEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
        guess: 2, // Guessing strength 2 (wrong)
      });

      expect(result.result).toBe("wrongGuess");
      expect(result.targetCard.strength).toBe(5);
      expect(result.requiresPrompt).toBe(true); // Always show prompt to maintain mystery
      expect(result.isCorrectGuess).toBe(false);
    });

    it("should not allow guessing Guard (strength 1)", async () => {
      // Mock Firebase data - target has Guard
      const mockSnapshot = {
        val: () => ({
          mode: "normal",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] }, // Attacker has Guard
            Player2: { hand: [{ id: 1, strength: 1 }] }, // Target has Guard
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyGuardEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
        guess: 1, // Trying to guess Guard (should be invalid)
      });

      // Guard vs Guard should be wrong guess (can't guess strength 1)
      expect(result.result).toBe("wrongGuess");
      expect(result.targetCard).toBeNull();
      expect(result.isCorrectGuess).toBe(false);
      expect(result.error).toBe("Cannot guess Guard (strength 1)");
    });
  });

  describe("Premium Mode (with Assassin cards)", () => {
    it("should return correct guess with Assassin prompt when target has Assassin", async () => {
      // Mock Firebase data - target has Assassin (strength 0)
      const mockSnapshot = {
        val: () => ({
          mode: "premium",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] }, // Attacker has Guard
            Player2: { hand: [{ id: 14, strength: 0 }] }, // Target has Assassin
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyGuardEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
        guess: 2, // Guessing wrong, but target has Assassin
      });

      expect(result.targetCard.id).toBe(14); // Assassin
      expect(result.requiresPrompt).toBe(true); // Premium mode always requires prompt
      expect(result.isCorrectGuess).toBe(false); // Wrong guess
    });

    it("should return wrong guess with Assassin prompt when target has non-Assassin card", async () => {
      // Mock Firebase data - target has Priest, not Assassin
      const mockSnapshot = {
        val: () => ({
          mode: "premium",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] }, // Attacker has Guard
            Player2: { hand: [{ id: 2, strength: 2 }] }, // Target has Priest
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyGuardEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
        guess: 5, // Wrong guess
      });

      expect(result.result).toBe("wrongGuess");
      expect(result.targetCard.id).toBe(2); // Priest
      expect(result.requiresPrompt).toBe(true); // Premium mode always requires prompt
      expect(result.isCorrectGuess).toBe(false);
    });

    it("should return correct guess with Assassin prompt when target has guessed card", async () => {
      // Mock Firebase data - target has Priest, guess correctly
      const mockSnapshot = {
        val: () => ({
          mode: "premium",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] }, // Attacker has Guard
            Player2: { hand: [{ id: 2, strength: 2 }] }, // Target has Priest
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      const result = await applyGuardEffect({
        roomCode: "TEST123",
        attacker: "Player1",
        target: "Player2",
        guess: 2, // Correct guess - Priest
      });

      expect(result.result).toBe("correctGuess");
      expect(result.targetCard.id).toBe(2); // Priest
      expect(result.requiresPrompt).toBe(true); // Premium mode always requires prompt
      expect(result.isCorrectGuess).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing room data", async () => {
      const mockSnapshot = { val: () => null };
      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      await expect(
        applyGuardEffect({
          roomCode: "INVALID",
          attacker: "Player1",
          target: "Player2",
          guess: 2,
        })
      ).rejects.toThrow();
    });

    it("should handle missing player data", async () => {
      const mockSnapshot = {
        val: () => ({
          mode: "normal",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] },
            // Player2 missing
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      await expect(
        applyGuardEffect({
          roomCode: "TEST123",
          attacker: "Player1",
          target: "NonExistentPlayer",
          guess: 2,
        })
      ).rejects.toThrow();
    });

    it("should handle empty hands", async () => {
      const mockSnapshot = {
        val: () => ({
          mode: "normal",
          players: {
            Player1: { hand: [{ id: 1, strength: 1 }] },
            Player2: { hand: [] }, // Empty hand
          },
        }),
      };

      const { get } = await import("firebase/database");
      get.mockResolvedValue(mockSnapshot);

      await expect(
        applyGuardEffect({
          roomCode: "TEST123",
          attacker: "Player1",
          target: "Player2",
          guess: 2,
        })
      ).rejects.toThrow();
    });
  });
});
