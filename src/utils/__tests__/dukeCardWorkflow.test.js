import { describe, it, expect, beforeEach, vi } from "vitest";
import { applyDukeEffect } from "../cardEffects";
import { checkRoundEndConditions } from "../roundEndDetection";
import { ref, get } from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
}));

describe("👑🐕 Duke Card Comprehensive Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ref.mockReturnValue({ _path: "mock-ref" });
  });

  describe("🏛️ Duke Effect Application", () => {
    it("should apply Duke effect successfully", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice the Noble",
            hand: [{ id: 16, strength: 5, name: "Duke" }],
            discard: [],
            dukeToken: 0,
          },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyDukeEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(result.result).toBe("duke_favor");
      expect(result.requiresPrompt).toBe(false);
      expect(result.attackerMessage).toContain("Alice the Noble");
      expect(result.attackerMessage).toContain("take my blessing");
      expect(result.attackerMessage).toContain(
        "+1 to your last card's strength"
      );
      expect(result.publicMessage).toContain("Alice the Noble");
      expect(result.publicMessage).toContain("granted his favor");
    });

    it("should handle missing room data", async () => {
      get.mockResolvedValue({
        exists: () => false,
        val: () => null,
      });

      const result = await applyDukeEffect({
        roomCode: "INVALID",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.error).toBe("The royal court has disappeared...");
    });

    it("should handle player without name", async () => {
      const mockRoomData = {
        players: {
          alice: {
            // No name property
            hand: [{ id: 16, strength: 5, name: "Duke" }],
            discard: [],
          },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyDukeEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(result.result).toBe("duke_favor");
      expect(result.attackerMessage).toContain("alice"); // Falls back to player key
      expect(result.publicMessage).toContain("alice");
    });
  });

  describe("🎯 Duke Token Mechanics", () => {
    it("should calculate Duke bonus correctly in round end", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 5, strength: 5 }], // Prince
            discard: [],
            dukeToken: 2, // Has 2 Duke tokens
          },
          bob: {
            isOut: false,
            hand: [{ id: 5, strength: 5 }], // Same card strength
            discard: [],
            dukeToken: 0, // No Duke tokens
          },
        },
        round: {
          deck: [], // Empty deck
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.type).toBe("deckEmpty");
      expect(result.winners).toEqual(["alice"]); // Alice wins due to Duke bonus

      // Check final standings
      const aliceStanding = result.finalStandings.find(
        (p) => p.player === "alice"
      );
      const bobStanding = result.finalStandings.find((p) => p.player === "bob");

      expect(aliceStanding).toEqual({
        player: "alice",
        hand: [{ id: 5, strength: 5 }],
        strength: 7, // 5 base + 2 Duke bonus
        baseStrength: 5,
        dukeBonus: 2,
      });

      expect(bobStanding).toEqual({
        player: "bob",
        hand: [{ id: 5, strength: 5 }],
        strength: 5, // 5 base + 0 Duke bonus
        baseStrength: 5,
        dukeBonus: 0,
      });
    });

    it("should handle multiple players with Duke tokens", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 6, strength: 6 }],
            discard: [],
            dukeToken: 1, // +1 bonus
          },
          bob: {
            isOut: false,
            hand: [{ id: 6, strength: 6 }],
            discard: [],
            dukeToken: 3, // +3 bonus
          },
          charlie: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            discard: [],
            dukeToken: 0, // No bonus
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.winners).toEqual(["bob"]); // Bob wins: 6 + 3 = 9, beating Charlie's 8

      const standings = result.finalStandings;
      expect(standings[0]).toEqual({
        player: "bob",
        hand: [{ id: 6, strength: 6 }],
        strength: 9, // 6 + 3
        baseStrength: 6,
        dukeBonus: 3,
      });

      expect(standings[1]).toEqual({
        player: "charlie",
        hand: [{ id: 8, strength: 8 }],
        strength: 8, // 8 + 0
        baseStrength: 8,
        dukeBonus: 0,
      });

      expect(standings[2]).toEqual({
        player: "alice",
        hand: [{ id: 6, strength: 6 }],
        strength: 7, // 6 + 1
        baseStrength: 6,
        dukeBonus: 1,
      });
    });

    it("should handle Duke tokens with tiebreaker scenarios", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 4, strength: 4 }],
            discard: [{ id: 7, strength: 7 }], // 7 discard points
            dukeToken: 2, // +2 bonus = 6 total
          },
          bob: {
            isOut: false,
            hand: [{ id: 5, strength: 5 }],
            discard: [{ id: 1, strength: 1 }], // 1 discard point
            dukeToken: 1, // +1 bonus = 6 total (tied!)
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.tiebreakerUsed).toBe(true); // Both have strength 6, need tiebreaker
      expect(result.winners).toEqual(["alice"]); // Alice wins tiebreaker: 7 > 1 discard points

      expect(result.tiebreakerDetails).toEqual({
        initialTiedPlayers: ["alice", "bob"],
        discardPileComparison: [
          {
            player: "alice",
            playerName: "alice",
            discardPilePoints: 7,
          },
          {
            player: "bob",
            playerName: "bob",
            discardPilePoints: 1,
          },
        ],
        highestDiscardPoints: 7,
      });
    });

    it("should handle missing Duke token property", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 3, strength: 3 }],
            discard: [],
            // No dukeToken property
          },
          bob: {
            isOut: false,
            hand: [{ id: 2, strength: 2 }],
            discard: [],
            dukeToken: 1, // Has Duke token
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.winners).toEqual(["alice"]); // Alice wins: 3 + 0 = 3, vs Bob's 2 + 1 = 3... wait, tie!

      // Both should have strength 3
      const aliceStanding = result.finalStandings.find(
        (p) => p.player === "alice"
      );
      const bobStanding = result.finalStandings.find((p) => p.player === "bob");

      expect(aliceStanding.strength).toBe(3); // 3 + 0 (missing dukeToken defaults to 0)
      expect(bobStanding.strength).toBe(3); // 2 + 1

      expect(result.tiebreakerUsed).toBe(true); // Should go to tiebreaker
    });
  });

  describe("🏆 Round End Scenarios with Duke", () => {
    it("should handle Duke bonus pushing player to victory", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 7, strength: 7 }], // Countess
            discard: [],
            dukeToken: 0,
          },
          bob: {
            isOut: false,
            hand: [{ id: 6, strength: 6 }], // Phantom King
            discard: [],
            dukeToken: 2, // +2 bonus = 8 total, beats Alice's 7
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.winners).toEqual(["bob"]);
      expect(result.tiebreakerUsed).toBe(false); // Clear victory, no tiebreaker needed

      const bobStanding = result.finalStandings[0];
      expect(bobStanding.player).toBe("bob");
      expect(bobStanding.strength).toBe(8); // 6 + 2
      expect(bobStanding.dukeBonus).toBe(2);
    });

    it("should handle Duke bonus creating a tie", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }], // Princess
            discard: [],
            dukeToken: 0,
          },
          bob: {
            isOut: false,
            hand: [{ id: 6, strength: 6 }], // Phantom King
            discard: [],
            dukeToken: 2, // +2 bonus = 8 total, ties with Alice
          },
          charlie: {
            isOut: false,
            hand: [{ id: 5, strength: 5 }], // Prince
            discard: [],
            dukeToken: 3, // +3 bonus = 8 total, also ties!
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.tiebreakerUsed).toBe(true); // Three-way tie
      expect(result.winners).toEqual(["alice", "bob", "charlie"]); // All tied at strength 8

      // All should have final strength of 8
      result.finalStandings.forEach((standing) => {
        expect(standing.strength).toBe(8);
      });

      expect(result.tiebreakerDetails.initialTiedPlayers).toEqual([
        "alice",
        "bob",
        "charlie",
      ]);
    });

    it("should handle extreme Duke bonus scenario", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 1, strength: 1 }], // Guard (weakest card)
            discard: [],
            dukeToken: 10, // Massive Duke bonus = 11 total
          },
          bob: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }], // Princess (strongest card)
            discard: [],
            dukeToken: 0,
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.winners).toEqual(["alice"]); // Guard + 10 Duke tokens beats Princess!

      const aliceStanding = result.finalStandings[0];
      expect(aliceStanding.player).toBe("alice");
      expect(aliceStanding.strength).toBe(11); // 1 + 10
      expect(aliceStanding.baseStrength).toBe(1);
      expect(aliceStanding.dukeBonus).toBe(10);

      const bobStanding = result.finalStandings[1];
      expect(bobStanding.player).toBe("bob");
      expect(bobStanding.strength).toBe(8); // 8 + 0
      expect(bobStanding.dukeBonus).toBe(0);
    });
  });

  describe("🎭 Edge Cases and Error Handling", () => {
    it("should handle Duke tokens with eliminated players", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 5, strength: 5 }],
            discard: [],
            dukeToken: 1,
          },
          bob: {
            isOut: true, // Eliminated player
            hand: [],
            discard: [],
            dukeToken: 5, // Duke tokens irrelevant when eliminated
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.type).toBe("lastPlayerStanding"); // Only Alice is active
      expect(result.winner).toBe("alice");

      // Bob should not be in finalStandings since he's eliminated
      expect(result.finalStandings).toEqual([]);
    });

    it("should handle negative Duke tokens gracefully", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 4, strength: 4 }],
            discard: [],
            dukeToken: -2, // Somehow negative (data corruption?)
          },
          bob: {
            isOut: false,
            hand: [{ id: 3, strength: 3 }],
            discard: [],
            dukeToken: 0,
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.winners).toEqual(["bob"]); // Bob wins: 3 + 0 = 3, vs Alice's 4 + (-2) = 2

      const aliceStanding = result.finalStandings.find(
        (p) => p.player === "alice"
      );
      expect(aliceStanding.strength).toBe(2); // 4 + (-2)
      expect(aliceStanding.dukeBonus).toBe(-2);
    });

    it("should handle null Duke token values", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 2, strength: 2 }],
            discard: [],
            dukeToken: null, // Null value
          },
          bob: {
            isOut: false,
            hand: [{ id: 1, strength: 1 }],
            discard: [],
            dukeToken: undefined, // Undefined value
          },
        },
        round: {
          deck: [],
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.winners).toEqual(["alice"]); // Alice wins: 2 + 0 = 2, vs Bob's 1 + 0 = 1

      result.finalStandings.forEach((standing) => {
        expect(standing.dukeBonus).toBe(0); // Both null and undefined should default to 0
      });
    });
  });
});
