import { describe, it, expect, beforeEach } from "vitest";
import { handlePlayerElimination } from "../gamehelpers";

describe("🃏 Elimination Hand Cleanup Tests", () => {
  describe("Hand Cleanup Logic", () => {
    it("should move single card from hand to discard pile", () => {
      const playerData = {
        name: "Alice",
        hand: [{ id: 2, strength: 2, name: "Priest" }],
        discard: [{ id: 1, strength: 1, name: "Guard" }],
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "alice",
        "normal",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/alice/isOut": true,
        "players/alice/hand": [],
        "players/alice/discard": [
          { id: 1, strength: 1, name: "Guard" }, // Existing discard
          { id: 2, strength: 2, name: "Priest" }, // Moved from hand
        ],
      });
    });

    it("should move multiple cards from hand to discard pile", () => {
      const playerData = {
        name: "Bob",
        hand: [
          { id: 3, strength: 3, name: "Baron" },
          { id: 4, strength: 4, name: "Handmaid" },
        ],
        discard: [],
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "bob",
        "normal",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/bob/isOut": true,
        "players/bob/hand": [],
        "players/bob/discard": [
          { id: 3, strength: 3, name: "Baron" },
          { id: 4, strength: 4, name: "Handmaid" },
        ],
      });
    });

    it("should handle elimination with empty hand", () => {
      const playerData = {
        name: "Charlie",
        hand: [],
        discard: [{ id: 5, strength: 5, name: "Prince" }],
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "charlie",
        "normal",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/charlie/isOut": true,
      });
    });

    it("should handle elimination with no existing discard pile", () => {
      const playerData = {
        name: "Diana",
        hand: [{ id: 6, strength: 6, name: "Phantom King" }],
        discard: undefined, // No discard pile
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "diana",
        "normal",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/diana/isOut": true,
        "players/diana/hand": [],
        "players/diana/discard": [{ id: 6, strength: 6, name: "Phantom King" }],
      });
    });

    it("should preserve existing updates while adding hand cleanup", () => {
      const playerData = {
        name: "Eve",
        hand: [{ id: 7, strength: 7, name: "Countess" }],
        discard: [],
        isOut: false,
      };

      const existingUpdates = {
        "round/currentPlayer": "nextPlayer",
        "round/deck": [{ id: 8, strength: 8, name: "Princess" }],
      };

      const result = handlePlayerElimination(
        "TEST123",
        "eve",
        "normal",
        playerData,
        existingUpdates
      );

      expect(result).toEqual({
        "round/currentPlayer": "nextPlayer",
        "round/deck": [{ id: 8, strength: 8, name: "Princess" }],
        "players/eve/isOut": true,
        "players/eve/hand": [],
        "players/eve/discard": [{ id: 7, strength: 7, name: "Countess" }],
      });
    });
  });

  describe("Chamberlain Token Logic + Hand Cleanup", () => {
    it("should activate Chamberlain token AND cleanup hand (premium mode)", () => {
      const playerData = {
        name: "Frank",
        hand: [{ id: 8, strength: 8, name: "Princess" }],
        discard: [{ id: 10, strength: 6, name: "Chamberlain" }],
        chamberlainToken: false, // Ready for activation
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "frank",
        "premium",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/frank/isOut": true,
        "players/frank/chamberlainToken": true, // Activated!
        "players/frank/hand": [], // Hand cleaned up
        "players/frank/discard": [
          { id: 10, strength: 6, name: "Chamberlain" }, // Existing
          { id: 8, strength: 8, name: "Princess" }, // From hand
        ],
      });
    });

    it("should NOT activate Chamberlain token but still cleanup hand", () => {
      const playerData = {
        name: "Grace",
        hand: [{ id: 2, strength: 2, name: "Priest" }],
        discard: [{ id: 3, strength: 3, name: "Baron" }],
        chamberlainToken: undefined, // No token
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "grace",
        "premium",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/grace/isOut": true,
        "players/grace/hand": [],
        "players/grace/discard": [
          { id: 3, strength: 3, name: "Baron" },
          { id: 2, strength: 2, name: "Priest" },
        ],
      });
    });

    it("should handle Chamberlain token already activated (normal mode)", () => {
      const playerData = {
        name: "Henry",
        hand: [{ id: 4, strength: 4, name: "Handmaid" }],
        discard: [],
        chamberlainToken: true, // Already activated
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "henry",
        "normal", // Normal mode - no Chamberlain logic
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/henry/isOut": true,
        "players/henry/hand": [],
        "players/henry/discard": [{ id: 4, strength: 4, name: "Handmaid" }],
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle null/undefined player data gracefully", () => {
      const result = handlePlayerElimination(
        "TEST123",
        "missing",
        "normal",
        null,
        {}
      );

      expect(result).toEqual({
        "players/missing/isOut": true,
      });
    });

    it("should handle player data without hand property", () => {
      const playerData = {
        name: "Incomplete",
        discard: [{ id: 1, strength: 1, name: "Guard" }],
        isOut: false,
        // hand property missing
      };

      const result = handlePlayerElimination(
        "TEST123",
        "incomplete",
        "normal",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/incomplete/isOut": true,
      });
    });

    it("should handle player with null hand", () => {
      const playerData = {
        name: "NullHand",
        hand: null,
        discard: [],
        isOut: false,
      };

      const result = handlePlayerElimination(
        "TEST123",
        "nullhand",
        "normal",
        playerData,
        {}
      );

      expect(result).toEqual({
        "players/nullhand/isOut": true,
      });
    });
  });

  describe("Integration with Elimination Scenarios", () => {
    it("should handle Guard elimination scenario", () => {
      // Simulate: Guard correctly guesses target has Priest
      const targetPlayerData = {
        name: "Target",
        hand: [{ id: 2, strength: 2, name: "Priest" }], // Was guessed correctly
        discard: [{ id: 4, strength: 4, name: "Handmaid" }],
        isOut: false,
      };

      const result = handlePlayerElimination(
        "GUARD123",
        "target",
        "normal",
        targetPlayerData,
        {}
      );

      expect(result["players/target/isOut"]).toBe(true);
      expect(result["players/target/hand"]).toEqual([]);
      expect(result["players/target/discard"]).toEqual([
        { id: 4, strength: 4, name: "Handmaid" },
        { id: 2, strength: 2, name: "Priest" }, // Guessed card discarded
      ]);
    });

    it("should handle Baron elimination scenario", () => {
      // Simulate: Baron comparison - attacker loses
      const attackerPlayerData = {
        name: "Attacker",
        hand: [{ id: 1, strength: 1, name: "Guard" }], // Lower than target's card
        discard: [{ id: 3, strength: 3, name: "Baron" }], // Already played Baron
        isOut: false,
      };

      const result = handlePlayerElimination(
        "BARON123",
        "attacker",
        "normal",
        attackerPlayerData,
        {}
      );

      expect(result["players/attacker/isOut"]).toBe(true);
      expect(result["players/attacker/hand"]).toEqual([]);
      expect(result["players/attacker/discard"]).toEqual([
        { id: 3, strength: 3, name: "Baron" },
        { id: 1, strength: 1, name: "Guard" }, // Losing card discarded
      ]);
    });

    it("should handle Princess self-elimination scenario", () => {
      // Simulate: Player plays Princess directly
      // In this scenario, the Princess has already been moved to discard by the play logic
      const playerData = {
        name: "UnluckyPlayer",
        hand: [], // Hand already emptied by Princess play logic
        discard: [{ id: 5, strength: 5, name: "Prince" }],
        isOut: false,
      };

      // Simulating that Princess has already been moved to discard by the play logic
      const baseUpdates = {
        "players/unluckyplayer/discard": [
          { id: 5, strength: 5, name: "Prince" },
          { id: 8, strength: 8, name: "Princess" }, // Princess already played
        ],
        "players/unluckyplayer/hand": [], // Already emptied by play logic
      };

      const result = handlePlayerElimination(
        "PRINCESS123",
        "unluckyplayer",
        "normal",
        playerData,
        baseUpdates
      );

      expect(result["players/unluckyplayer/isOut"]).toBe(true);
      expect(result["players/unluckyplayer/hand"]).toEqual([]);
      expect(result["players/unluckyplayer/discard"]).toEqual([
        { id: 5, strength: 5, name: "Prince" },
        { id: 8, strength: 8, name: "Princess" }, // Only the played Princess
      ]);
    });

    it("should handle Prince-induced Princess elimination", () => {
      // Simulate: Prince forces target to discard Princess
      // In this scenario, the Princess has already been moved to discard by Prince effect
      const targetPlayerData = {
        name: "ForcedTarget",
        hand: [], // Hand already emptied by Prince effect
        discard: [{ id: 2, strength: 2, name: "Priest" }],
        isOut: false,
      };

      // Prince effect already moved Princess to discard and emptied hand
      const baseUpdates = {
        "players/forcedtarget/discard": [
          { id: 2, strength: 2, name: "Priest" },
          { id: 8, strength: 8, name: "Princess" }, // Forced discard by Prince
        ],
        "players/forcedtarget/hand": [], // Prince effect emptied hand
      };

      const result = handlePlayerElimination(
        "PRINCE123",
        "forcedtarget",
        "normal",
        targetPlayerData,
        baseUpdates
      );

      expect(result["players/forcedtarget/isOut"]).toBe(true);
      expect(result["players/forcedtarget/hand"]).toEqual([]);
      expect(result["players/forcedtarget/discard"]).toEqual([
        { id: 2, strength: 2, name: "Priest" },
        { id: 8, strength: 8, name: "Princess" }, // Only the forced discard
      ]);
    });

    it("should handle Inquisitor Princess elimination (premium mode)", () => {
      // Simulate: Inquisitor correctly guesses Princess
      // In this scenario, the Princess has already been moved to discard by Inquisitor effect
      const targetPlayerData = {
        name: "InquisitorTarget",
        hand: [], // Hand already emptied by Inquisitor effect
        discard: [],
        chamberlainToken: false, // Has Chamberlain token ready
        isOut: false,
      };

      // Inquisitor effect already handled Princess discard and emptied hand
      const baseUpdates = {
        "players/inquisitortarget/discard": [
          { id: 8, strength: 8, name: "Princess" }, // Inquisitor found
        ],
        "players/inquisitortarget/hand": [], // Already emptied by Inquisitor effect
      };

      const result = handlePlayerElimination(
        "INQUISITOR123",
        "inquisitortarget",
        "premium",
        targetPlayerData,
        baseUpdates
      );

      expect(result["players/inquisitortarget/isOut"]).toBe(true);
      expect(result["players/inquisitortarget/chamberlainToken"]).toBe(true); // Activated!
      expect(result["players/inquisitortarget/hand"]).toEqual([]);
      expect(result["players/inquisitortarget/discard"]).toEqual([
        { id: 8, strength: 8, name: "Princess" }, // Only the found Princess
      ]);
    });

    it("should handle Assassin counter-elimination", () => {
      // Simulate: Guard attacker eliminated by Assassin counter
      const attackerPlayerData = {
        name: "GuardAttacker",
        hand: [{ id: 2, strength: 2, name: "Priest" }], // Other card in hand
        discard: [{ id: 1, strength: 1, name: "Guard" }], // Guard already played
        isOut: false,
      };

      const result = handlePlayerElimination(
        "ASSASSIN123",
        "guardattacker",
        "premium",
        attackerPlayerData,
        {}
      );

      expect(result["players/guardattacker/isOut"]).toBe(true);
      expect(result["players/guardattacker/hand"]).toEqual([]);
      expect(result["players/guardattacker/discard"]).toEqual([
        { id: 1, strength: 1, name: "Guard" },
        { id: 2, strength: 2, name: "Priest" }, // Remaining hand card
      ]);
    });

    it("should handle Baron elimination with multiple hand cards", () => {
      // Simulate: Baron comparison where attacker loses and has multiple cards
      // This could happen in a scenario where Baron was forced play due to Countess rule
      const attackerPlayerData = {
        name: "BaronLoser",
        hand: [
          { id: 1, strength: 1, name: "Guard" }, // Compared and lost
          { id: 4, strength: 4, name: "Handmaid" }, // Other card in hand
        ],
        discard: [{ id: 3, strength: 3, name: "Baron" }], // Baron already played
        isOut: false,
      };

      const result = handlePlayerElimination(
        "BARON_MULTI123",
        "baronloser",
        "normal",
        attackerPlayerData,
        {}
      );

      expect(result["players/baronloser/isOut"]).toBe(true);
      expect(result["players/baronloser/hand"]).toEqual([]);
      expect(result["players/baronloser/discard"]).toEqual([
        { id: 3, strength: 3, name: "Baron" },
        { id: 1, strength: 1, name: "Guard" },
        { id: 4, strength: 4, name: "Handmaid" },
      ]);
    });
  });
});
