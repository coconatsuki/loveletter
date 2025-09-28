import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyBaronEffect } from "../cardEffects";
import { get, update, ref } from "firebase/database";

// Mock Firebase functions
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

// Mock cards data
vi.mock("../cardsData", () => ({
  cards: [
    {
      id: 1,
      name: "Guard",
      strength: 1,
      effect: "Guess another player's card.",
    },
    {
      id: 2,
      name: "Priest",
      strength: 2,
      effect: "Look at another player's card.",
    },
    {
      id: 3,
      name: "Baron",
      strength: 3,
      effect: "Compare cards with another player.",
    },
    {
      id: 4,
      name: "Handmaid",
      strength: 4,
      effect: "Protect yourself until your next turn.",
    },
    {
      id: 5,
      name: "Prince",
      strength: 5,
      effect: "Force a player to discard and draw.",
    },
  ],
}));

describe("Baron Card Effects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock ref to return a mock database reference
    ref.mockReturnValue("mock-ref");
  });

  describe("applyBaronEffect", () => {
    it("should eliminate target when attacker has higher strength", async () => {
      // Mock room data - attacker has Prince (5), target has Guard (1)
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 5, strength: 5 }], // Prince
            name: "Alice",
          },
          bob: {
            hand: [{ id: 1, strength: 1 }], // Guard
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.eliminatedPlayer).toBe("bob");
      expect(result.winner).toBe("alice");
      expect(result.isTie).toBe(false);
      expect(result.result).toBe("elimination");
      expect(result.attackerCard.name).toBe("Prince");
      expect(result.targetCard.name).toBe("Guard");
      expect(result.publicMessage).toContain("plays Baron");
      expect(result.publicMessage).toContain("is eliminated");
      expect(result.attackerMessage).toContain(
        "Your Baron's duel is victorious"
      );
      expect(result.targetMessage).toContain(
        "You are eliminated from the round"
      );

      // NOTE: Baron effect no longer directly eliminates players in Firebase
      // Elimination now happens in the modal confirmation flow for proper game state management
      // Verify Firebase was called to get room data, but not to eliminate (that's done by modal)
      expect(get).toHaveBeenCalledWith(expect.anything());
      expect(update).not.toHaveBeenCalled(); // No direct elimination in Baron effect
    });

    it("should eliminate attacker when target has higher strength", async () => {
      // Mock room data - attacker has Guard (1), target has Prince (5)
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 1, strength: 1 }], // Guard
            name: "Alice",
          },
          bob: {
            hand: [{ id: 5, strength: 5 }], // Prince
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.eliminatedPlayer).toBe("alice");
      expect(result.winner).toBe("bob");
      expect(result.isTie).toBe(false);
      expect(result.result).toBe("elimination");
      expect(result.publicMessage).toContain("plays Baron");
      expect(result.publicMessage).toContain("is eliminated");
      expect(result.attackerMessage).toContain(
        "Your Baron's duel ends in defeat"
      );
      expect(result.targetMessage).toContain("you triumph");
    });

    it("should result in tie when both players have equal strength", async () => {
      // Mock room data - both have Priest (2)
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 2, strength: 2 }], // Priest
            name: "Alice",
          },
          bob: {
            hand: [{ id: 2, strength: 2 }], // Priest
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.eliminatedPlayer).toBeNull();
      expect(result.winner).toBeNull();
      expect(result.isTie).toBe(true);
      expect(result.result).toBe("tie");
      expect(result.publicMessage).toContain("honorable draw");
      expect(result.attackerMessage).toContain("An honorable draw");
      expect(result.targetMessage).toContain("honorable duel");

      // Verify no Firebase update for elimination in tie
      expect(update).not.toHaveBeenCalled();
    });

    it("should handle different strength comparisons correctly", async () => {
      // Test Baron (3) vs Handmaid (4)
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 3, strength: 3 }], // Baron
            name: "Alice",
          },
          bob: {
            hand: [{ id: 4, strength: 4 }], // Handmaid
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.eliminatedPlayer).toBe("alice");
      expect(result.winner).toBe("bob");
      expect(result.attackerCard.strength).toBe(3);
      expect(result.targetCard.strength).toBe(4);
    });

    it("should enrich card data with names and effects", async () => {
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 3, strength: 3 }], // Baron
            name: "Alice",
          },
          bob: {
            hand: [{ id: 1, strength: 1 }], // Guard
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.attackerCard).toEqual({
        id: 3,
        name: "Baron",
        strength: 3,
        effect: "Compare cards with another player.",
      });
      expect(result.targetCard).toEqual({
        id: 1,
        name: "Guard",
        strength: 1,
        effect: "Guess another player's card.",
      });
    });

    it("should generate medieval-themed messages for all scenarios", async () => {
      // Test victory messages
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 5, strength: 5 }], // Prince
            name: "Alice",
          },
          bob: {
            hand: [{ id: 1, strength: 1 }], // Guard
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      // Check medieval theme and emojis
      expect(result.attackerMessage).toMatch(/⚔️🏆.*duel.*victorious/);
      expect(result.targetMessage).toMatch(/⚔️💀.*duel.*eliminated/);
      expect(result.publicMessage).toMatch(
        /⚖️💥.*Baron.*duel.*eliminated.*⚔️👑/
      );
    });

    it("should have correct return structure", async () => {
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 2, strength: 2 }],
            name: "Alice",
          },
          bob: {
            hand: [{ id: 2, strength: 2 }],
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      // Check all required fields
      expect(result).toHaveProperty("requiresPrompt", false);
      expect(result).toHaveProperty("attacker", "alice");
      expect(result).toHaveProperty("target", "bob");
      expect(result).toHaveProperty("attackerCard");
      expect(result).toHaveProperty("targetCard");
      expect(result).toHaveProperty("eliminatedPlayer");
      expect(result).toHaveProperty("winner");
      expect(result).toHaveProperty("isTie");
      expect(result).toHaveProperty("result");
      expect(result).toHaveProperty("attackerMessage");
      expect(result).toHaveProperty("targetMessage");
      expect(result).toHaveProperty("publicMessage");
    });

    it("should work with edge case cards (same ID different instances)", async () => {
      // Two Guards with different object references but same strength
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 1, strength: 1 }], // Guard instance 1
            name: "Alice",
          },
          bob: {
            hand: [{ id: 1, strength: 1 }], // Guard instance 2
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.isTie).toBe(true);
      expect(result.eliminatedPlayer).toBeNull();
      expect(result.attackerCard.name).toBe("Guard");
      expect(result.targetCard.name).toBe("Guard");
    });

    it("should handle maximum strength difference", async () => {
      // Guard (1) vs Prince (5) - maximum strength difference
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 1, strength: 1 }], // Guard
            name: "Alice",
          },
          bob: {
            hand: [{ id: 5, strength: 5 }], // Prince
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.eliminatedPlayer).toBe("alice");
      expect(result.winner).toBe("bob");
      expect(result.attackerCard.strength).toBe(1);
      expect(result.targetCard.strength).toBe(5);
      expect(result.publicMessage).toContain("falls to superior strength");
    });

    it("should handle minimum strength difference", async () => {
      // Baron (3) vs Handmaid (4) - strength difference of 1
      const mockRoomData = {
        players: {
          alice: {
            hand: [{ id: 3, strength: 3 }], // Baron
            name: "Alice",
          },
          bob: {
            hand: [{ id: 4, strength: 4 }], // Handmaid
            name: "Bob",
          },
        },
      };

      get.mockResolvedValueOnce({ val: () => mockRoomData });

      const result = await applyBaronEffect({
        roomCode: "TEST123",
        attacker: "alice",
        target: "bob",
      });

      expect(result.eliminatedPlayer).toBe("alice");
      expect(result.winner).toBe("bob");
      expect(
        Math.abs(result.attackerCard.strength - result.targetCard.strength)
      ).toBe(1);
    });
  });
});
