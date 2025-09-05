import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyGuardEffect } from "../../utils/cardEffects.js";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
}));

describe("🛡️ Guard Workflow Debug - Specific Scenario", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should match the exact scenario from the bug report", async () => {
    // Mock the exact scenario: Lady Jsonette vs Luffyyyyyy
    const mockSnapshot = {
      val: () => ({
        mode: "normal", // Normal mode (not premium)
        players: {
          Luffyyyyyy: {
            hand: [{ id: 6, strength: 6, name: "Phantom King" }], // Target has Phantom King (strength 6)
          },
        },
      }),
    };

    const { get } = await import("firebase/database");
    get.mockResolvedValue(mockSnapshot);

    // Test the exact scenario from bug report
    const result = await applyGuardEffect({
      roomCode: "TEST123",
      attacker: "Lady Jsonette",
      target: "Luffyyyyyy",
      guess: 5, // Attacker guesses strength 5
    });

    console.log("🎯 Guard Effect Result:", result);

    // Verify the expected behavior
    expect(result.requiresPrompt).toBe(true); // Should ALWAYS show AssassinPromptModal
    expect(result.hasAssassin).toBe(false); // Phantom King is not Assassin
    expect(result.isCorrectGuess).toBe(false); // Guessed 5, actual is 6
    expect(result.result).toBe("wrongGuess");
    expect(result.targetCard.id).toBe(6); // Phantom King
    expect(result.targetCard.strength).toBe(6);
    expect(result.guessedStrength).toBe(5);
    expect(result.actualStrength).toBe(6);
    expect(result.target).toBe("Luffyyyyyy");
    expect(result.attacker).toBe("Lady Jsonette");

    console.log(
      '✅ All expectations met! AssassinPromptModal should show with "Continue" button'
    );
  });

  it("should work for correct guess scenario too", async () => {
    // Test correct guess scenario
    const mockSnapshot = {
      val: () => ({
        mode: "normal",
        players: {
          Luffyyyyyy: {
            hand: [{ id: 5, strength: 5, name: "Prince" }], // Target has Prince (strength 5)
          },
        },
      }),
    };

    const { get } = await import("firebase/database");
    get.mockResolvedValue(mockSnapshot);

    const result = await applyGuardEffect({
      roomCode: "TEST123",
      attacker: "Lady Jsonette",
      target: "Luffyyyyyy",
      guess: 5, // Correct guess this time
    });

    expect(result.requiresPrompt).toBe(true); // Should ALWAYS show AssassinPromptModal
    expect(result.hasAssassin).toBe(false); // Prince is not Assassin
    expect(result.isCorrectGuess).toBe(true); // Correct guess
    expect(result.result).toBe("correctGuess");
    expect(result.eliminatedPlayer).toBe("Luffyyyyyy"); // Target should be eliminated

    console.log(
      '✅ Correct guess scenario also works! AssassinPromptModal should show with "Face your fate" button'
    );
  });
});
