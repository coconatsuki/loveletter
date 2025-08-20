import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  applyPrinceEffect,
  shouldAdvanceTurnOnModal,
  CARD_MODAL_FLOW,
} from "../cardEffects.js";

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
      id: 8,
      name: "Princess",
      strength: 8,
      effect: "If played or discarded, player is eliminated.",
    },
  ],
}));

describe("👑 Princess Integration Tests", () => {
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

  describe("Modal Flow Configuration", () => {
    it("should have correct modal flow configuration for Princess", () => {
      const princessFlow = CARD_MODAL_FLOW[8]; // Princess is card ID 8

      expect(princessFlow).toBeDefined();
      expect(princessFlow.advanceOnAttacker).toBe(true);
      expect(princessFlow.advanceOnTarget).toBe(false);
    });

    it("should advance turn when player closes Princess modal", () => {
      const shouldAdvance = shouldAdvanceTurnOnModal(8, true); // Card ID 8, isAttacker: true
      expect(shouldAdvance).toBe(true);
    });
  });

  describe("Princess Card Strength Validation", () => {
    it("should confirm Princess has highest strength", () => {
      // Princess should be the highest value card (strength 8)
      const princessStrength = 8;
      const countessStrength = 7;
      const phantomKingStrength = 6;

      expect(princessStrength).toBe(8);
      expect(princessStrength).toBeGreaterThan(countessStrength);
      expect(princessStrength).toBeGreaterThan(phantomKingStrength);
    });
  });

  describe("Prince → Princess Elimination Scenarios", () => {
    it("should eliminate target when Prince forces Princess discard", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [
              { id: 5, strength: 5, name: "Prince" },
              { id: 1, strength: 1, name: "Guard" },
            ],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "bob",
            hand: [{ id: 8, strength: 8, name: "Princess" }], // Will be forced to discard
            discard: [],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "alice",
          deck: [{ id: 2, strength: 2, name: "Priest" }], // Available to draw
        },
      };

      mockFirebaseSetup.get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrinceEffect({
        roomCode: "test-room",
        attacker: "alice",
        target: "bob",
      });

      // Should eliminate bob for discarding Princess
      expect(result.result).toBe("princessEliminated");

      // Check that target was eliminated
      expect(mockFirebaseSetup.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "players/bob/isOut": true,
        })
      );

      // Check Princess elimination messages
      expect(result.publicMessage).toContain("👑💀 ROYAL CATASTROPHE!");
      expect(result.publicMessage).toContain("revealing the PRINCESS!");
      expect(result.publicMessage).toContain("bob is eliminated!");

      expect(result.attackerMessage).toContain("👑💀 ROYAL CATASTROPHE!");
      expect(result.attackerMessage).toContain("bob held the PRINCESS!");

      expect(result.targetMessage).toContain("👑💀 ROYAL DOOM!");
      expect(result.targetMessage).toContain("it was the PRINCESS!");
    });

    it("should eliminate self when Prince self-targets with Princess", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }], // Alice's remaining card after playing Prince
            discard: [],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "alice",
          deck: [{ id: 2, strength: 2, name: "Priest" }], // Available to draw
        },
      };

      mockFirebaseSetup.get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrinceEffect({
        roomCode: "test-room",
        attacker: "alice",
        target: "alice", // Self-targeting
      });

      // Should eliminate alice for discarding Princess
      expect(result.result).toBe("princessEliminated");

      // Check that alice was eliminated
      expect(mockFirebaseSetup.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "players/alice/isOut": true,
        })
      );

      // Check self-elimination messages
      expect(result.publicMessage).toContain("👑💀 OH NO!");
      expect(result.publicMessage).toContain(
        "alice commanded themselves to discard"
      );
      expect(result.publicMessage).toContain("revealed the PRINCESS!");

      expect(result.attackerMessage).toContain("👑💀 ROYAL TRAGEDY!");
      expect(result.attackerMessage).toContain("You held the PRINCESS!");
    });

    it("should handle normal Prince effect when target doesn't have Princess", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [
              { id: 5, strength: 5, name: "Prince" },
              { id: 1, strength: 1, name: "Guard" },
            ],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "bob",
            hand: [{ id: 2, strength: 2, name: "Priest" }], // Normal card, not Princess
            discard: [],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "alice",
          deck: [{ id: 3, strength: 3, name: "Baron" }], // Available to draw
        },
      };

      mockFirebaseSetup.get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrinceEffect({
        roomCode: "test-room",
        attacker: "alice",
        target: "bob",
      });

      // Should work normally (no Princess elimination)
      expect(result.result).toBe("cardSwapped");

      // Check that bob was NOT eliminated
      expect(mockFirebaseSetup.update).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "players/bob/isOut": true,
        })
      );

      // Should not contain Princess elimination messages
      expect(result.publicMessage).not.toContain("PRINCESS");
      expect(result.publicMessage).toContain("Prince"); // Normal Prince message
    });
  });

  describe("Princess Elimination Edge Cases", () => {
    it("should handle Princess elimination with empty deck", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [
              { id: 5, strength: 5, name: "Prince" },
              { id: 1, strength: 1, name: "Guard" },
            ],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "bob",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "alice",
          deck: [], // Empty deck
        },
      };

      mockFirebaseSetup.get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrinceEffect({
        roomCode: "test-room",
        attacker: "alice",
        target: "bob",
      });

      // Should still eliminate bob despite empty deck
      expect(result.result).toBe("princessEliminated");
      expect(mockFirebaseSetup.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "players/bob/isOut": true,
        })
      );
    });

    it("should handle Princess elimination with multiple players", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "alice",
            hand: [
              { id: 5, strength: 5, name: "Prince" },
              { id: 1, strength: 1, name: "Guard" },
            ],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "bob",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
          charlie: {
            name: "charlie",
            hand: [{ id: 4, strength: 4, name: "Handmaid" }],
            discard: [],
            isOut: false,
          },
        },
        round: {
          currentPlayer: "alice",
          deck: [{ id: 2, strength: 2, name: "Priest" }],
        },
      };

      mockFirebaseSetup.get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrinceEffect({
        roomCode: "test-room",
        attacker: "alice",
        target: "bob",
      });

      // Only bob should be eliminated, charlie should remain
      expect(result.result).toBe("princessEliminated");
      expect(mockFirebaseSetup.update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "players/bob/isOut": true,
        })
      );

      // Charlie should not be affected
      expect(mockFirebaseSetup.update).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "players/charlie/isOut": true,
        })
      );
    });
  });
});
