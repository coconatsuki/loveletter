import { describe, it, expect, beforeEach, vi } from "vitest";
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

describe("⚖️ Discard Pile Tiebreaker Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ref.mockReturnValue({ _path: "mock-ref" });
  });

  describe("🏆 Basic Tiebreaker Logic", () => {
    it("should resolve tie with different discard pile strengths", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            discard: [
              { id: 7, strength: 7 }, // Countess
              { id: 5, strength: 5 }, // Prince
              // Total: 12 points
            ],
          },
          bob: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            discard: [
              { id: 3, strength: 3 }, // Baron
              { id: 2, strength: 2 }, // Priest
              // Total: 5 points
            ],
          },
          charlie: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            discard: [
              { id: 6, strength: 6 }, // Phantom King
              { id: 4, strength: 4 }, // Handmaid
              { id: 1, strength: 1 }, // Guard
              // Total: 11 points
            ],
          },
        },
        round: {
          deck: [], // Empty deck triggers tiebreaker
          hiddenCard: null,
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result).toEqual({
        isRoundEnd: true,
        type: "deckEmpty",
        winners: ["alice"], // Alice wins with 12 discard points
        winnerNames: ["alice"],
        finalStandings: [
          {
            player: "alice",
            hand: [{ id: 8, strength: 8 }],
            strength: 8,
            baseStrength: 8,
            dukeBonus: 0,
            discardPilePoints: 12,
          },
          {
            player: "charlie",
            hand: [{ id: 8, strength: 8 }],
            strength: 8,
            baseStrength: 8,
            dukeBonus: 0,
            discardPilePoints: 11,
          },
          {
            player: "bob",
            hand: [{ id: 8, strength: 8 }],
            strength: 8,
            baseStrength: 8,
            dukeBonus: 0,
            discardPilePoints: 5,
          },
        ],
        tiebreakerUsed: true,
        tiebreakerDetails: {
          initialTiedPlayers: ["alice", "bob", "charlie"],
          discardPileComparison: [
            {
              player: "alice",
              playerName: "alice",
              discardPilePoints: 12,
            },
            {
              player: "charlie",
              playerName: "alice",
              discardPilePoints: 11,
            },
            {
              player: "bob",
              playerName: "alice",
              discardPilePoints: 5,
            },
          ],
          highestDiscardPoints: 12,
        },
        hiddenCard: null,
      });
    });

    it("should handle complete tie even after tiebreaker", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 7, strength: 7 }],
            discard: [
              { id: 4, strength: 4 }, // Handmaid
              { id: 1, strength: 1 }, // Guard
              // Total: 5 points
            ],
          },
          bob: {
            isOut: false,
            hand: [{ id: 7, strength: 7 }],
            discard: [
              { id: 3, strength: 3 }, // Baron
              { id: 2, strength: 2 }, // Priest
              // Total: 5 points (same as Alice!)
            ],
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

      expect(result).toEqual({
        isRoundEnd: true,
        type: "deckEmpty",
        winners: ["alice", "bob"], // Still tied even after tiebreaker
        winnerNames: ["alice", "bob"],
        finalStandings: [
          {
            player: "alice",
            hand: [{ id: 7, strength: 7 }],
            strength: 7,
            baseStrength: 7,
            dukeBonus: 0,
            discardPilePoints: 5,
          },
          {
            player: "bob",
            hand: [{ id: 7, strength: 7 }],
            strength: 7,
            baseStrength: 7,
            dukeBonus: 0,
            discardPilePoints: 5,
          },
        ],
        tiebreakerUsed: true,
        tiebreakerDetails: {
          initialTiedPlayers: ["alice", "bob"],
          discardPileComparison: [
            {
              player: "alice",
              playerName: "alice",
              discardPilePoints: 5,
            },
            {
              player: "bob",
              playerName: "bob",
              discardPilePoints: 5,
            },
          ],
          highestDiscardPoints: 5,
        },
        hiddenCard: null,
      });
    });

    it("should only apply tiebreaker to tied players", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }], // Highest strength
            discard: [],
          },
          bob: {
            isOut: false,
            hand: [{ id: 7, strength: 7 }], // Tied for second
            discard: [
              { id: 5, strength: 5 }, // Prince
              // Total: 5 points
            ],
          },
          charlie: {
            isOut: false,
            hand: [{ id: 7, strength: 7 }], // Tied for second
            discard: [
              { id: 1, strength: 1 }, // Guard
              { id: 1, strength: 1 }, // Another Guard
              // Total: 2 points
            ],
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

      expect(result).toEqual({
        isRoundEnd: true,
        type: "deckEmpty",
        winners: ["alice"], // Clear winner, no tiebreaker needed
        winnerNames: ["alice"],
        finalStandings: [
          {
            player: "alice",
            hand: [{ id: 8, strength: 8 }],
            strength: 8,
            baseStrength: 8,
            dukeBonus: 0,
          },
          {
            player: "bob",
            hand: [{ id: 7, strength: 7 }],
            strength: 7,
            baseStrength: 7,
            dukeBonus: 0,
          },
          {
            player: "charlie",
            hand: [{ id: 7, strength: 7 }],
            strength: 7,
            baseStrength: 7,
            dukeBonus: 0,
          },
        ],
        tiebreakerUsed: false,
        tiebreakerDetails: null,
        hiddenCard: null,
      });
    });
  });

  describe("🃏 Edge Cases", () => {
    it("should handle empty discard piles", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 5, strength: 5 }],
            discard: [], // Empty discard pile
          },
          bob: {
            isOut: false,
            hand: [{ id: 5, strength: 5 }],
            discard: [], // Empty discard pile
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
      expect(result.type).toBe("deckEmpty");
      expect(result.winners).toEqual(["alice", "bob"]);
      expect(result.tiebreakerUsed).toBe(true);
      expect(result.tiebreakerDetails.highestDiscardPoints).toBe(0);
    });

    it("should handle missing discard pile property", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 6, strength: 6 }],
            // No discard property at all
          },
          bob: {
            isOut: false,
            hand: [{ id: 6, strength: 6 }],
            discard: [{ id: 2, strength: 2 }], // Has some discards
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
      expect(result.winners).toEqual(["bob"]); // Bob wins with 2 discard points vs Alice's 0
      expect(result.tiebreakerUsed).toBe(true);
      expect(result.finalStandings[0].discardPilePoints).toBe(2); // Bob
      expect(result.finalStandings[1].discardPilePoints).toBe(0); // Alice
    });

    it("should handle cards without strength property", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 4, strength: 4 }],
            discard: [
              { id: 1 }, // Missing strength property
              { id: 2, strength: 2 },
            ],
          },
          bob: {
            isOut: false,
            hand: [{ id: 4, strength: 4 }],
            discard: [{ id: 3, strength: 3 }],
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
      expect(result.winners).toEqual(["bob"]); // Bob wins: 3 points vs Alice's 2 points (0 + 2)
      expect(result.finalStandings[0].discardPilePoints).toBe(3); // Bob
      expect(result.finalStandings[1].discardPilePoints).toBe(2); // Alice (missing strength treated as 0)
    });
  });

  describe("🔥 Complex Scenarios", () => {
    it("should handle mixed strength hands with complex discard piles", async () => {
      const mockRoomData = {
        players: {
          alice: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }], // Princess
            discard: [
              { id: 1, strength: 1 }, // Guard
              { id: 1, strength: 1 }, // Another Guard
              { id: 1, strength: 1 }, // Third Guard
              // Total: 3 points
            ],
          },
          bob: {
            isOut: false,
            hand: [{ id: 7, strength: 7 }], // Countess
            discard: [
              { id: 6, strength: 6 }, // Phantom King
              { id: 5, strength: 5 }, // Prince
              { id: 4, strength: 4 }, // Handmaid
              { id: 3, strength: 3 }, // Baron
              { id: 2, strength: 2 }, // Priest
              // Total: 20 points
            ],
          },
          charlie: {
            isOut: false,
            hand: [{ id: 8, strength: 8 }], // Princess (tied with Alice)
            discard: [
              { id: 7, strength: 7 }, // Countess
              { id: 6, strength: 6 }, // Phantom King
              // Total: 13 points
            ],
          },
        },
        round: {
          deck: [],
          hiddenCard: { id: 1, strength: 1 },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await checkRoundEndConditions("TEST123");

      expect(result.isRoundEnd).toBe(true);
      expect(result.type).toBe("deckEmpty");
      expect(result.winners).toEqual(["charlie"]); // Charlie wins tiebreaker: 8 strength + 13 discard points
      expect(result.tiebreakerUsed).toBe(true);

      // Verify the final standings are sorted correctly
      expect(result.finalStandings[0]).toEqual({
        player: "charlie",
        hand: [{ id: 8, strength: 8 }],
        strength: 8,
        baseStrength: 8,
        dukeBonus: 0,
        discardPilePoints: 13,
      });

      expect(result.finalStandings[1]).toEqual({
        player: "alice",
        hand: [{ id: 8, strength: 8 }],
        strength: 8,
        baseStrength: 8,
        dukeBonus: 0,
        discardPilePoints: 3,
      });

      expect(result.finalStandings[2]).toEqual({
        player: "bob",
        hand: [{ id: 7, strength: 7 }],
        strength: 7,
        baseStrength: 7,
        dukeBonus: 0,
      });

      expect(result.tiebreakerDetails).toEqual({
        initialTiedPlayers: ["alice", "charlie"],
        discardPileComparison: [
          {
            player: "charlie",
            playerName: "charlie",
            discardPilePoints: 13,
          },
          {
            player: "alice",
            playerName: "alice",
            discardPilePoints: 3,
          },
        ],
        highestDiscardPoints: 13,
      });
    });
  });
});
