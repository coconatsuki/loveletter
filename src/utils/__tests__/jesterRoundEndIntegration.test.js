/**
 * 🏆✨ JESTER ROUND END DETECTION TESTS (FIXED VERSION) ✨🏆
 * Testing love token awarding with Jester bonuses
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Use vi.hoisted for proper mock setup
const { mockGet, mockUpdate, mockRef } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockUpdate: vi.fn(),
  mockRef: vi.fn(),
}));

vi.mock("../firebase.js", () => ({
  db: {},
}));

vi.mock("firebase/database", () => ({
  ref: mockRef,
  get: mockGet,
  update: mockUpdate,
}));

import { triggerRoundEnd } from "../roundEndDetection.js";

describe("🃏 Jester Round End Detection Tests (Fixed)", () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockUpdate.mockClear();
    mockRef.mockClear();

    // Set up default mocks
    mockRef.mockReturnValue({ path: "mock/path" });
    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => ({}),
    });
  });

  describe("🏆 Single Winner Scenarios", () => {
    it("should award 1 token to winner and 1 token to jester giver when winner has jester token", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            jesterToken: { giver: "alice" },
          },
          carol: { name: "Carol", tokens: 0, isOut: true, hand: [] },
        },
        round: {
          deck: [{ id: 1, strength: 1 }], // Non-empty deck for lastPlayerStanding scenario
        },
        gameStats: { totalRoundsPlayed: 1 },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      await triggerRoundEnd("TEST123");

      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        expect.objectContaining({
          "players/bob/tokens": 2, // Bob gets 1 token
          "players/alice/tokens": 3, // Alice gets 1 token for jester bonus
        })
      );
    });

    it("should award only 1 token to winner when jester giver is the same as winner", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            jesterToken: { giver: "bob" }, // Self-given jester token
          },
          carol: { name: "Carol", tokens: 0, isOut: true, hand: [] },
        },
        round: {
          deck: [{ id: 1, strength: 1 }],
        },
        gameStats: { totalRoundsPlayed: 1 },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      await triggerRoundEnd("TEST123");

      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        expect.objectContaining({
          "players/bob/tokens": 2, // Bob gets only 1 token (no double-award)
        })
      );
    });

    it("should award only 1 token to winner when no jester token exists", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            tokens: 2,
            isOut: true,
            hand: [],
          },
          bob: {
            name: "Bob",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            // No jester token
          },
          carol: { name: "Carol", tokens: 0, isOut: true, hand: [] },
        },
        round: {
          deck: [{ id: 1, strength: 1 }],
        },
        gameStats: { totalRoundsPlayed: 1 },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      await triggerRoundEnd("TEST123");

      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        expect.objectContaining({
          "players/bob/tokens": 2, // Bob gets only 1 token
        })
      );

      // Alice should not get any additional tokens
      expect(mockUpdate).not.toHaveBeenCalledWith(
        { path: "mock/path" },
        expect.objectContaining({
          "players/alice/tokens": expect.any(Number),
        })
      );
    });
  });

  describe("⚖️ Multiple Winners (Deck Empty) Scenarios", () => {
    it("should award tokens to all winners and jester givers when multiple winners have jester tokens", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            tokens: 1,
            isOut: false,
            hand: [{ id: 8, strength: 8 }],
            jesterToken: { giver: "carol" },
          },
          bob: {
            name: "Bob",
            tokens: 2,
            isOut: false,
            hand: [{ id: 8, strength: 8 }], // Same strength as Alice
            jesterToken: { giver: "dave" },
          },
          carol: { name: "Carol", tokens: 0, isOut: true, hand: [] },
          dave: { name: "Dave", tokens: 1, isOut: true, hand: [] },
        },
        round: {
          deck: [], // Empty deck triggers deck empty scenario
        },
        gameStats: { totalRoundsPlayed: 1 },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      await triggerRoundEnd("TEST123");

      expect(mockUpdate).toHaveBeenCalledWith(
        { path: "mock/path" },
        expect.objectContaining({
          "players/alice/tokens": 2, // Alice gets 1 token for winning
          "players/bob/tokens": 3, // Bob gets 1 token for winning
          "players/carol/tokens": 1, // Carol gets 1 token for jester bonus
          "players/dave/tokens": 2, // Dave gets 1 token for jester bonus
        })
      );
    });
  });
});
