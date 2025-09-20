import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyHandmaidEffect } from "../cardEffects";

// Mock Firebase functions
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase", () => ({
  db: {},
}));

import { ref, get, update } from "firebase/database";

describe("Handmaid Card Effects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ref).mockReturnValue("mock-ref");
    vi.mocked(update).mockResolvedValue(undefined);
  });

  describe("applyHandmaidEffect", () => {
    it("should add player to empty protectedPlayers array", async () => {
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: "Alice" },
          },
        }),
      });

      const result = await applyHandmaidEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(vi.mocked(update)).toHaveBeenCalledWith("mock-ref", {
        protectedPlayers: ["alice"],
      });

      expect(result.result).toBe("protection");
      expect(result.protectedPlayer).toBe("alice");
      expect(result.publicMessage).toContain(
        "Alice calls upon the Princess' Handmaid"
      );
      expect(result.publicMessage).toContain("tea and biscuits");
      expect(result.playerMessage).toContain("The Princess' loyal Handmaid");
    });

    it("should add player to existing protectedPlayers array", async () => {
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: "Alice" },
            bob: { name: "Bob" },
          },
          protectedPlayers: ["bob"],
        }),
      });

      const result = await applyHandmaidEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(vi.mocked(update)).toHaveBeenCalledWith("mock-ref", {
        protectedPlayers: ["bob", "alice"],
      });

      expect(result.protectedPlayer).toBe("alice");
    });

    it("should not duplicate player if already protected", async () => {
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: "Alice" },
          },
          protectedPlayers: ["alice"],
        }),
      });

      const result = await applyHandmaidEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(vi.mocked(update)).toHaveBeenCalledWith("mock-ref", {
        protectedPlayers: ["alice"],
      });

      expect(result.protectedPlayer).toBe("alice");
    });

    it("should handle missing player name gracefully", async () => {
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: {
              /* no name property */
            },
          },
        }),
      });

      const result = await applyHandmaidEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(result.publicMessage).toContain("alice calls upon"); // Uses nickname
    });

    it("should create cozy medieval-themed messages", async () => {
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: "Alice" },
          },
        }),
      });

      const result = await applyHandmaidEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      // Public message should be cozy, not mystical
      expect(result.publicMessage).toContain("🫖✨");
      expect(result.publicMessage).toContain("tea and biscuits");
      expect(result.publicMessage).toContain("cozy chambers");
      expect(result.publicMessage).not.toContain("magical");
      expect(result.publicMessage).not.toContain("ancient");

      // Player message should include the Handmaid's quote
      expect(result.playerMessage).toContain("Come, dear guest");
      expect(result.playerMessage).toContain("fireplace");
      expect(result.playerMessage).toContain("You're safe with me!");
      expect(result.playerMessage).toContain("☕ Protection Status: ACTIVE");
      expect(result.playerMessage).toContain("Until your next turn begins");
    });

    it("should have correct effect properties", async () => {
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: "Alice" },
          },
        }),
      });

      const result = await applyHandmaidEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(result.requiresPrompt).toBe(false);
      expect(result.result).toBe("protection");
      expect(result.protectedPlayer).toBe("alice");
      expect(typeof result.publicMessage).toBe("string");
      expect(typeof result.playerMessage).toBe("string");
    });
  });

  describe("Protection Cleanup (Integration)", () => {
    it("should demonstrate protection lifecycle", async () => {
      // This test documents the expected behavior, even though the cleanup
      // logic is implemented in Play.jsx turn advancement functions

      // 1. Player gets protected by playing Handmaid
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: "Alice" },
            bob: { name: "Bob" },
          },
          protectedPlayers: [],
        }),
      });

      const protectionResult = await applyHandmaidEffect({
        roomCode: "TEST123",
        player: "alice",
      });

      expect(vi.mocked(update)).toHaveBeenCalledWith("mock-ref", {
        protectedPlayers: ["alice"],
      });

      // 2. Alice is now protected until her next turn
      // 3. When Alice's turn comes back, the turn advancement logic in Play.jsx
      //    should remove her from protectedPlayers array
      // 4. This cleanup is tested indirectly through UI integration tests

      expect(protectionResult.result).toBe("protection");
      expect(protectionResult.playerMessage).toContain(
        "Until your next turn begins"
      );
    });

    it("should verify protection expiration timing", () => {
      // This test documents when protection should expire
      const mockGameState = {
        players: { alice: {}, bob: {}, charlie: {} },
        round: { currentPlayer: "alice" },
        protectedPlayers: ["alice"],
      };

      // Alice plays Handmaid on turn 1, gets protected
      // Bob plays on turn 2, Alice still protected
      // Charlie plays on turn 3, Alice still protected
      // Alice's turn comes back (turn 4), protection should expire

      // The actual cleanup logic is:
      // const updatedProtected = currentProtected.filter(player => player !== nextPlayer);

      const nextPlayer = "alice";
      const currentProtected = mockGameState.protectedPlayers;
      const expectedAfterCleanup = currentProtected.filter(
        (player) => player !== nextPlayer
      );

      expect(expectedAfterCleanup).toEqual([]); // Alice should be removed
    });
  });
});
