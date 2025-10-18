import { applyBaronessEffect } from "../../utils/cardEffects";
import { ref, get } from "firebase/database";
import { describe, test, expect, beforeEach, vi } from "vitest";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));

// Mock cardsData import
vi.mock("../../utils/cardsData.js", () => ({
  cards: [
    {
      id: 1,
      name: "Guard",
      strength: 1,
      effect: "Guess another player's card",
    },
    {
      id: 2,
      name: "Priest",
      strength: 2,
      effect: "Look at another player's hand",
    },
    {
      id: 3,
      name: "Baron",
      strength: 3,
      effect: "Compare hands with another player",
    },
    {
      id: 5,
      name: "Prince",
      strength: 5,
      effect: "Choose a player to discard their hand",
    },
    {
      id: 8,
      name: "Princess",
      strength: 8,
      effect: "If discarded, you are eliminated",
    },
  ],
}));

describe("applyBaronessEffect - The Court's Matchmaker Logic", () => {
  const mockRoomCode = "TEST123";
  const mockAttacker = "baroness_player";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 💕 SINGLE TARGET SCENARIOS
  describe("💕 Single Target Scenarios", () => {
    test("reveals single target's card with romantic narratives", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: {
            name: "Target1",
            realName: "T1",
            hand: [{ id: 2, name: "Priest", strength: 2 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
        target2: null,
      });

      expect(result).toEqual({
        result: "baronessReveal",
        attacker: mockAttacker,
        target1: "target1",
        target2: null,
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at another player's hand",
        },
        target2Card: null,
        attackerMessage: expect.stringContaining("🍷✨ At her evening soirée"),
        target1Message: expect.stringContaining(
          "🎉💋 The Baroness' soirée hums with laughter"
        ),
        target2Message: null,
        publicMessage: expect.stringContaining("💋 At her grand soirée"),
      });

      // Verify romantic emojis are included
      expect(result.attackerMessage).toContain("💋");
      expect(result.attackerMessage).toContain("🌹");
      expect(result.attackerMessage).toContain("💕");
      expect(result.target1Message).toContain("😘");
      expect(result.target1Message).toContain("🍷");
      expect(result.target1Message).toContain("🕵️‍♀️💕");
    });

    test("handles single target with different card types", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: {
            name: "Target1",
            realName: "T1",
            hand: [{ id: 8, name: "Princess", strength: 8 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
      });

      expect(result.target1Card).toEqual({
        id: 8,
        name: "Princess",
        strength: 8,
        effect: "If discarded, you are eliminated",
      });

      // Single target narratives should not mention second player
      expect(result.attackerMessage).not.toContain("target2");
      expect(result.target1Message).not.toContain("across from");
    });
  });

  // 💑 DUAL TARGET SCENARIOS
  describe("💑 Dual Target Scenarios", () => {
    test("reveals both targets' cards with dual narratives", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: {
            name: "Target1",
            realName: "T1",
            hand: [{ id: 1, name: "Guard", strength: 1 }],
          },
          target2: {
            name: "Target2",
            realName: "T2",
            hand: [{ id: 5, name: "Prince", strength: 5 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
        target2: "target2",
      });

      expect(result).toEqual({
        result: "baronessReveal",
        attacker: mockAttacker,
        target1: "target1",
        target2: "target2",
        target1Card: {
          id: 1,
          name: "Guard",
          strength: 1,
          effect: "Guess another player's card",
        },
        target2Card: {
          id: 5,
          name: "Prince",
          strength: 5,
          effect: "Choose a player to discard their hand",
        },
        attackerMessage: expect.stringContaining("target1"),
        target1Message: expect.stringContaining("target2"),
        target2Message: expect.stringContaining("target1"),
        publicMessage: expect.stringContaining("target1"),
      });

      // Verify dual target narratives mention both players
      expect(result.attackerMessage).toContain("target1");
      expect(result.attackerMessage).toContain("target2");
      expect(result.target1Message).toContain("target2");
      expect(result.target2Message).toContain("target1");
      expect(result.publicMessage).toContain("target1");
      expect(result.publicMessage).toContain("target2");
    });

    test("handles dual targets with different card strengths", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: {
            name: "Target1",
            realName: "T1",
            hand: [{ id: 3, name: "Baron", strength: 3 }],
          },
          target2: {
            name: "Target2",
            realName: "T2",
            hand: [{ id: 1, name: "Guard", strength: 1 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
        target2: "target2",
      });

      // Should reveal both cards correctly
      expect(result.target1Card.strength).toBe(3);
      expect(result.target2Card.strength).toBe(1);
      expect(result.target1Card.name).toBe("Baron");
      expect(result.target2Card.name).toBe("Guard");
    });
  });

  // 🚨 ERROR HANDLING SCENARIOS
  describe("🚨 Error Handling Scenarios", () => {
    test("handles missing room data", async () => {
      get.mockResolvedValue({ val: () => null });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
      });

      expect(result).toEqual({
        result: "error",
        message: "Target player not found",
      });
    });

    test("handles missing target1 player", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "nonexistent_target",
      });

      expect(result).toEqual({
        result: "error",
        message: "Target player not found",
      });
    });

    test("handles missing target2 player when target2 specified", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: { name: "Target1", realName: "T1", hand: [{ id: 2 }] },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
        target2: "nonexistent_target2",
      });

      expect(result).toEqual({
        result: "error",
        message: "Second target player not found",
      });
    });

    test("handles target1 with no cards", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: { name: "Target1", realName: "T1", hand: [] },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
      });

      expect(result).toEqual({
        result: "error",
        message: "Target has no cards",
      });
    });

    test("handles target2 with no cards", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: { name: "Target1", realName: "T1", hand: [{ id: 2 }] },
          target2: { name: "Target2", realName: "T2", hand: [] },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
        target2: "target2",
      });

      expect(result).toEqual({
        result: "error",
        message: "Second target has no cards",
      });
    });

    test("handles target1 with missing hand property", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: { name: "Target1", realName: "T1" }, // No hand property
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
      });

      expect(result).toEqual({
        result: "error",
        message: "Target has no cards",
      });
    });

    test("handles Firebase connection errors", async () => {
      get.mockRejectedValue(new Error("Firebase connection failed"));

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
      });

      expect(result).toEqual({
        result: "error",
        error: "Firebase connection failed",
      });
    });
  });

  // 🎭 NARRATIVE CONTENT TESTS
  describe("🎭 Narrative Content & Romantic Flavor", () => {
    test("includes romantic emojis in all narratives", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: { name: "Target1", realName: "T1", hand: [{ id: 2 }] },
          target2: { name: "Target2", realName: "T2", hand: [{ id: 3 }] },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
        target2: "target2",
      });

      // Check romantic emojis in attacker message
      expect(result.attackerMessage).toMatch(/🍷✨|💋|🌹|🥂|💕/);

      // Check romantic emojis in target messages
      expect(result.target1Message).toMatch(/🎉💋|😘|🍷|💬✨|😱|🕵️‍♀️💕/);
      expect(result.target2Message).toMatch(/🎉💋|😘|🍷|💬✨|😱|🕵️‍♀️💕/);

      // Check romantic emojis in public message
      expect(result.publicMessage).toMatch(/🍷✨|💋|💬🌹|💕👑/);
    });

    test("includes player names in narratives correctly", async () => {
      const mockGameData = {
        players: {
          alice: { name: "Alice", realName: "Alice Real", hand: [{ id: 15 }] },
          bob: { name: "Bob", realName: "Bob Real", hand: [{ id: 2 }] },
          charlie: {
            name: "Charlie",
            realName: "Charlie Real",
            hand: [{ id: 3 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: "alice",
        target1: "bob",
        target2: "charlie",
      });

      // Check attacker name in messages
      expect(result.attackerMessage).toContain("alice");
      expect(result.target1Message).toContain("alice");
      expect(result.target2Message).toContain("alice");
      expect(result.publicMessage).toContain("alice");

      // Check target names in messages
      expect(result.attackerMessage).toContain("bob");
      expect(result.attackerMessage).toContain("charlie");
      expect(result.target1Message).toContain("charlie");
      expect(result.target2Message).toContain("bob");
    });

    test("generates appropriate single vs dual target narratives", async () => {
      // Test single target narratives
      const singleTargetData = {
        players: {
          baroness: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target: { name: "Target", realName: "T", hand: [{ id: 2 }] },
        },
      };

      get.mockResolvedValue({ val: () => singleTargetData });

      const singleResult = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: "baroness",
        target1: "target",
      });

      // Single target should not mention "across from" or second player interactions
      expect(singleResult.attackerMessage).not.toContain("and target2");
      expect(singleResult.target1Message).not.toContain("across from");
      expect(singleResult.publicMessage).not.toContain("and target2");

      // Test dual target narratives
      const dualTargetData = {
        players: {
          baroness: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: { name: "Target1", realName: "T1", hand: [{ id: 2 }] },
          target2: { name: "Target2", realName: "T2", hand: [{ id: 3 }] },
        },
      };

      get.mockResolvedValue({ val: () => dualTargetData });

      const dualResult = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: "baroness",
        target1: "target1",
        target2: "target2",
      });

      // Dual target should mention both players and interactions
      expect(dualResult.attackerMessage).toContain("target1");
      expect(dualResult.attackerMessage).toContain("target2");
      expect(dualResult.target1Message).toContain("across from");
      expect(dualResult.target1Message).toContain("target2");
    });
  });

  // 📊 CARD DATA ENRICHMENT TESTS
  describe("📊 Card Data Enrichment", () => {
    test("enriches cards with effect descriptions from cardsData", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: {
            name: "Target1",
            realName: "T1",
            hand: [{ id: 1, name: "Guard", strength: 1 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
      });

      expect(result.target1Card).toEqual({
        id: 1,
        name: "Guard",
        strength: 1,
        effect: "Guess another player's card",
      });
    });

    test("handles unknown card types gracefully", async () => {
      const mockGameData = {
        players: {
          baroness_player: {
            name: "Baroness",
            realName: "Lady B",
            hand: [{ id: 15 }],
          },
          target1: {
            name: "Target1",
            realName: "T1",
            hand: [{ id: 999, name: "Unknown", strength: 0 }],
          },
        },
      };

      get.mockResolvedValue({ val: () => mockGameData });

      const result = await applyBaronessEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target1: "target1",
      });

      expect(result.target1Card.effect).toBe("Unknown card effect");
    });
  });
});
