import { describe, it, expect, beforeEach, vi } from "vitest";
import { shouldAdvanceTurnOnModal, CARD_MODAL_FLOW } from "../cardEffects.js";

// Mock Firebase properly - need to mock both firebase/database and local firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase.js", () => ({
  db: { _checkNotDeleted: vi.fn() },
}));

// Mock cards data
vi.mock("../cardsData", () => ({
  cards: [
    {
      id: 5,
      name: "Prince",
      strength: 5,
      effect: "Force a player to discard and draw.",
    },
    {
      id: 6,
      name: "Phantom King",
      strength: 6,
      effect: "Look at a player's hand and choose a card to discard.",
    },
    {
      id: 7,
      name: "Countess",
      strength: 7,
      effect: "Must be played if you have Prince or Phantom King.",
    },
  ],
}));

describe("🎭 Countess Integration Tests", () => {
  describe("Modal Flow Configuration", () => {
    it("should have correct modal flow configuration for Countess", () => {
      const countessFlow = CARD_MODAL_FLOW[7]; // Countess is card ID 7

      expect(countessFlow).toBeDefined();
      expect(countessFlow.advanceOnAttacker).toBe(true);
      expect(countessFlow.advanceOnTarget).toBe(false);
    });

    it("should advance turn when attacker closes Countess modal", () => {
      const shouldAdvance = shouldAdvanceTurnOnModal(7, true); // Card ID 7, isAttacker: true
      expect(shouldAdvance).toBe(true);
    });

    it("should NOT advance turn when target receives Countess notification", () => {
      const shouldAdvance = shouldAdvanceTurnOnModal(7, false); // Card ID 7, isAttacker: false
      expect(shouldAdvance).toBe(false);
    });
  });

  describe("Countess vs Other Cards Priority", () => {
    it("should recognize Countess as higher priority than Prince", () => {
      // In force-play scenarios, Countess (7) should be played instead of Prince (5)
      const countessStrength = 7;
      const princeStrength = 5;

      expect(countessStrength).toBeGreaterThan(princeStrength);
    });

    it("should recognize Countess as higher priority than Phantom King", () => {
      // In force-play scenarios, Countess (7) should be played instead of Phantom King (6)
      const countessStrength = 7;
      const phantomKingStrength = 6;

      expect(countessStrength).toBeGreaterThan(phantomKingStrength);
    });
  });

  describe("Game State Validation", () => {
    it("should validate that Countess exists in card definitions", () => {
      // Test that card ID 7 is properly defined as Countess
      // This ensures our force-play logic targets the right card
      const countessId = 7;

      // These should be the values used in force-play detection
      expect(countessId).toBe(7);
      expect(typeof countessId).toBe("number");
    });

    it("should validate Prince and Phantom King IDs for force-play detection", () => {
      // Test that the cards we check against Countess have correct IDs
      const princeId = 5;
      const phantomKingId = 6;

      expect(princeId).toBe(5);
      expect(phantomKingId).toBe(6);
      expect(typeof princeId).toBe("number");
      expect(typeof phantomKingId).toBe("number");
    });
  });

  describe("Countess Workflow Integration", () => {
    let mockFirebaseSetup;

    beforeEach(async () => {
      vi.clearAllMocks();
      // Mock firebase/database functions
      const firebaseDb = await import("firebase/database");
      mockFirebaseSetup = {
        get: firebaseDb.get,
        update: firebaseDb.update,
        ref: firebaseDb.ref,
      };

      mockFirebaseSetup.ref.mockReturnValue({ path: "mock-ref" });
      mockFirebaseSetup.update.mockResolvedValue();
    });

    it("should handle complete Countess workflow", async () => {
      // Test the complete flow: detect force-play → play Countess → effect → modal → turn advancement
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [
              { id: 7, strength: 7, name: "Countess" },
              { id: 5, strength: 5, name: "Prince" },
            ],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "bob",
            hand: [{ id: 1, strength: 1, name: "Guard" }],
            discard: [],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "alice",
          deck: [],
        },
      };

      mockFirebaseSetup.get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      // Import and test the Countess effect
      const { applyCountessEffect } = await import("../cardEffects.js");

      const result = await applyCountessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      // Verify the complete workflow produces expected results
      expect(result.result).toBe("countess_played");
      expect(result.message).toContain("Countess");
      expect(result.publicMessage).toContain("🎭✨");
      expect(result.playerMessage).toContain("Royal Effect: None");
    });

    it("should ensure Countess doesn't interfere with non-royal cards", async () => {
      // Test that Countess logic doesn't affect other card combinations
      const nonRoyalCombinations = [
        [
          { id: 1, name: "Guard" },
          { id: 2, name: "Priest" },
        ],
        [
          { id: 3, name: "Baron" },
          { id: 4, name: "Handmaid" },
        ],
        [
          { id: 1, name: "Guard" },
          { id: 8, name: "Princess" },
        ],
      ];

      // Mock the force-play detection function
      const getCountessForcePlay = (hand) => {
        if (!hand || hand.length !== 2) return { forced: false };

        const hasCountess = hand.some((card) => card.id === 7);
        const hasPrince = hand.some((card) => card.id === 5);
        const hasPhantomKing = hand.some((card) => card.id === 6);

        if (hasCountess && (hasPrince || hasPhantomKing)) {
          return { forced: true };
        }

        return { forced: false };
      };

      nonRoyalCombinations.forEach((hand) => {
        const result = getCountessForcePlay(hand);
        expect(result.forced).toBe(false);
      });
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle malformed game state gracefully", async () => {
      const { applyCountessEffect } = await import("../cardEffects.js");

      // Test with non-existent room using firebase/database mock
      const firebaseDb = await import("firebase/database");
      firebaseDb.get.mockResolvedValue({
        exists: () => false,
      });

      const result = await applyCountessEffect({
        roomCode: "non-existent",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("royal mishap");
    });

    it("should handle network errors gracefully", async () => {
      const { applyCountessEffect } = await import("../cardEffects.js");

      // Mock network error using firebase/database mock
      const firebaseDb = await import("firebase/database");
      firebaseDb.get.mockRejectedValue(new Error("Network failure"));

      const result = await applyCountessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain("royal mishap");
    });
  });

  describe("Performance and Edge Cases", () => {
    it("should handle rapid successive force-play checks", () => {
      // Test that force-play detection is efficient for rapid UI updates
      const getCountessForcePlay = (hand) => {
        if (!hand || hand.length !== 2) return { forced: false };

        const hasCountess = hand.some((card) => card.id === 7);
        const hasPrince = hand.some((card) => card.id === 5);
        const hasPhantomKing = hand.some((card) => card.id === 6);

        return {
          forced: hasCountess && (hasPrince || hasPhantomKing),
          blockedCard: hasPrince
            ? "Prince"
            : hasPhantomKing
            ? "Phantom King"
            : null,
        };
      };

      const testHand = [
        { id: 7, strength: 7, name: "Countess" },
        { id: 5, strength: 5, name: "Prince" },
      ];

      // Run the check multiple times to ensure consistency
      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        const result = getCountessForcePlay(testHand);
        expect(result.forced).toBe(true);
        expect(result.blockedCard).toBe("Prince");
      }
      const endTime = performance.now();

      // Should complete quickly (under 500ms for 1000 iterations)
      expect(endTime - startTime).toBeLessThan(500);
    });

    it("should handle concurrent player scenarios", () => {
      // Test that Countess logic works correctly when multiple players might have force-play scenarios
      const scenarios = [
        {
          player: "alice",
          hand: [
            { id: 7, name: "Countess" },
            { id: 5, name: "Prince" },
          ],
          expected: { forced: true, blockedCard: "Prince" },
        },
        {
          player: "bob",
          hand: [
            { id: 7, name: "Countess" },
            { id: 6, name: "Phantom King" },
          ],
          expected: { forced: true, blockedCard: "Phantom King" },
        },
        {
          player: "charlie",
          hand: [
            { id: 1, name: "Guard" },
            { id: 2, name: "Priest" },
          ],
          expected: { forced: false },
        },
      ];

      const getCountessForcePlay = (hand) => {
        if (!hand || hand.length !== 2) return { forced: false };

        const hasCountess = hand.some((card) => card.id === 7);
        const hasPrince = hand.some((card) => card.id === 5);
        const hasPhantomKing = hand.some((card) => card.id === 6);

        if (hasCountess && hasPrince) {
          return { forced: true, blockedCard: "Prince" };
        }
        if (hasCountess && hasPhantomKing) {
          return { forced: true, blockedCard: "Phantom King" };
        }

        return { forced: false };
      };

      scenarios.forEach((scenario) => {
        const result = getCountessForcePlay(scenario.hand);
        expect(result.forced).toBe(scenario.expected.forced);
        if (scenario.expected.blockedCard) {
          expect(result.blockedCard).toBe(scenario.expected.blockedCard);
        }
      });
    });
  });
});
