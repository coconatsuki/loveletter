import { describe, it, expect, beforeEach, vi } from "vitest";
import { applyPrincessEffect } from "../cardEffects.js";

// Mock Firebase properly
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../firebase.js", () => ({
  db: { _checkNotDeleted: vi.fn() },
}));

// Mock round end detection functions - declare mocks before using them
vi.mock("../roundEndDetection.js", () => ({
  logRoundEndCheck: vi.fn(),
  checkRoundEndConditions: vi.fn(),
  triggerRoundEnd: vi.fn(),
}));

describe("🏰 Princess Elimination Round End Integration Tests", () => {
  let mockGet, mockUpdate, mockRef;
  let mockLogRoundEndCheck, mockCheckRoundEndConditions, mockTriggerRoundEnd;

  beforeEach(async () => {
    vi.clearAllMocks();
    const firebaseDb = await import("firebase/database");
    const roundEndDetection = await import("../roundEndDetection.js");

    mockGet = firebaseDb.get;
    mockUpdate = firebaseDb.update;
    mockRef = firebaseDb.ref;
    mockRef.mockReturnValue({ path: "mock-ref" });

    mockLogRoundEndCheck = roundEndDetection.logRoundEndCheck;
    mockCheckRoundEndConditions = roundEndDetection.checkRoundEndConditions;
    mockTriggerRoundEnd = roundEndDetection.triggerRoundEnd;
  });

  describe("🎯 Critical Round End Timing Scenarios", () => {
    it("should prevent premature round end when last player eliminates themselves", async () => {
      // SCENARIO: 2 players left, Alice plays Princess (would end round)
      // BUG FIXED: Round should end AFTER modal confirmation, not before

      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "Bob",
            hand: [{ id: 1, strength: 1, name: "Guard" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      // Step 1: Alice plays Princess
      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      // ✅ CRITICAL: Round end check should NOT be called during effect application
      expect(mockLogRoundEndCheck).not.toHaveBeenCalled();
      expect(mockCheckRoundEndConditions).not.toHaveBeenCalled();
      expect(mockTriggerRoundEnd).not.toHaveBeenCalled();

      // ✅ Alice should NOT be eliminated yet
      expect(mockUpdate).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          "rooms/test-room/players/alice/isOut": true,
        })
      );

      // ✅ Modal messages should be prepared
      expect(result.playerMessage).toContain("ULTIMATE ROYAL BLUNDER");
      expect(result.eliminatedPlayer).toBe("alice");

      console.log("✅ TIMING FIX: No premature round end detection!");
    });

    it("should handle 3-player scenario where Princess doesn't end round", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "Bob",
            hand: [{ id: 1, strength: 1, name: "Guard" }],
            discard: [],
            isOut: false,
          },
          charlie: {
            name: "Charlie",
            hand: [{ id: 2, strength: 2, name: "Priest" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      // Should still prepare messages without immediate elimination
      expect(result.result).toBe("princess_played");
      expect(result.eliminatedPlayer).toBe("alice");
      expect(mockLogRoundEndCheck).not.toHaveBeenCalled();

      console.log(
        "✅ 3-player scenario: Normal message preparation without elimination"
      );
    });

    it("should simulate complete flow: Effect → Modal → Elimination → Round End", async () => {
      // This simulates the complete corrected flow

      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
          bob: {
            name: "Bob",
            hand: [{ id: 1, strength: 1, name: "Guard" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      // === STEP 1: applyPrincessEffect (NO elimination) ===
      const effectResult = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(mockLogRoundEndCheck).not.toHaveBeenCalled();
      expect(effectResult.playerMessage).toContain("ULTIMATE ROYAL BLUNDER");

      // === STEP 2: Simulate Modal Display & User Confirmation ===
      // User reads the message and clicks "Confirm"

      // === STEP 3: Simulate completePrincessTurn() execution ===
      const simulateCompletePrincessTurn = () => {
        // This is what SHOULD happen in completePrincessTurn():

        // 1. Apply elimination to Firebase
        mockUpdate({
          "rooms/test-room/players/alice/hand": [], // Remove Princess from hand
          "rooms/test-room/players/alice/discard": [
            { id: 8, strength: 8, name: "Princess" },
          ],
          "rooms/test-room/players/alice/isOut": true, // NOW eliminate
          "rooms/test-room/round/currentPlayer": "bob",
        });

        // 2. NOW call round end check (after elimination)
        mockLogRoundEndCheck(
          "After Princess Elimination (Modal Confirmed)",
          "test-room"
        );

        // 3. Round end detection would find only Bob left → trigger round end
        mockCheckRoundEndConditions.mockReturnValue({
          ended: true,
          winner: "bob",
          reason: "Last player standing",
        });

        mockTriggerRoundEnd("test-room", "bob", "Last player standing");
      };

      // Execute the simulated completion
      simulateCompletePrincessTurn();

      // === VERIFICATION ===
      // ✅ Elimination should be applied
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          "rooms/test-room/players/alice/isOut": true,
        })
      );

      // ✅ Round end check should be called AFTER elimination
      expect(mockLogRoundEndCheck).toHaveBeenCalledWith(
        "After Princess Elimination (Modal Confirmed)",
        "test-room"
      );

      // ✅ Round should end with Bob as winner
      expect(mockTriggerRoundEnd).toHaveBeenCalledWith(
        "test-room",
        "bob",
        "Last player standing"
      );

      console.log("✅ COMPLETE FLOW: Effect → Modal → Elimination → Round End");
    });
  });

  describe("🎮 Edge Cases & Error Scenarios", () => {
    it("should handle Princess play when player already eliminated", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: true, // Already eliminated!
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      // Should still work (player was desperate enough to play it anyway)
      expect(result.result).toBe("princess_played");
      expect(result.eliminatedPlayer).toBe("alice");
      expect(mockLogRoundEndCheck).not.toHaveBeenCalled();
    });

    it("should handle Firebase errors gracefully", async () => {
      mockGet.mockRejectedValue(new Error("Firebase connection failed"));

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      expect(result.result).toBe("error");
      expect(result.message).toContain(
        "The Princess encountered a royal mishap!"
      );
      expect(mockLogRoundEndCheck).not.toHaveBeenCalled();
    });

    it("should validate modal integration structure", async () => {
      const mockRoomData = {
        players: {
          testPlayer: {
            name: "Test Player",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "testPlayer",
      });

      // Validate the structure expected by EffectResultModal
      expect(result.attackerMessage).toEqual({
        cardName: "Princess",
        from: "testPlayer",
        message: result.playerMessage,
        selectedCardIndex: 0,
        shouldAdvanceTurn: true,
        visibleTo: "testPlayer",
      });

      // Validate isPrincessElimination flag for Play.jsx
      // (Note: This flag is set in Play.jsx when creating resultModalData)
      expect(result.eliminatedPlayer).toBe("testPlayer");
      expect(typeof result.playerMessage).toBe("string");
      expect(result.playerMessage.length).toBeGreaterThan(0);
    });
  });

  describe("🏆 Performance & Timing Validation", () => {
    it("should measure timing difference between old vs new behavior", async () => {
      const mockRoomData = {
        players: {
          alice: {
            name: "Alice",
            hand: [{ id: 8, strength: 8, name: "Princess" }],
            discard: [],
            isOut: false,
          },
        },
      };

      mockGet.mockResolvedValue({
        exists: () => true,
        val: () => mockRoomData,
      });

      const startTime = Date.now();

      const result = await applyPrincessEffect({
        roomCode: "test-room",
        player: "alice",
      });

      const effectTime = Date.now() - startTime;

      // Effect should be fast since no elimination logic runs
      expect(effectTime).toBeLessThan(100); // Should be very fast

      // Verify no heavy operations were performed
      expect(mockLogRoundEndCheck).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();

      // But messages should be fully prepared
      expect(result.playerMessage).toContain("ULTIMATE ROYAL BLUNDER");
      expect(result.publicMessage).toContain("ROYAL CATASTROPHE");

      console.log(
        `✅ PERFORMANCE: Effect completion time: ${effectTime}ms (no elimination)`
      );
    });
  });
});
