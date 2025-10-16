import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, get, update } from "firebase/database";
import { applyRoyalConfessorEffect } from "../cardEffects";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(() => "mock-ref"),
  get: vi.fn(),
  update: vi.fn(),
}));

// Helper function to create proper Firebase snapshot mock
const createMockSnapshot = (data) => ({
  exists: () => !!data,
  val: () => data,
});

describe("🕯️ Royal Confessor Effects - The Mutual Confession Ritual", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("applyRoyalConfessorEffect", () => {
    const mockRoomCode = "TEST123";
    const mockAttacker = "alice";
    const mockSelectedCardIndex = 1;
    const mockCardPlayed = {
      id: 13,
      name: "Royal Confessor",
      strength: 2,
      effect: "Choose two players and they trade hands",
    };

    describe("External Attacker Scenarios (attacker ≠ target1)", () => {
      it("should handle normal hand swap between two external players", async () => {
        const mockTarget1 = "bob";
        const mockTarget2 = "charlie";

        const mockTarget1Card = {
          id: 3,
          name: "Baron",
          strength: 3,
          effect: "Compare hands privately",
        };

        const mockTarget2Card = {
          id: 5,
          name: "Prince",
          strength: 5,
          effect: "Target discards hand and draws new card",
        };

        vi.mocked(get).mockResolvedValue(
          createMockSnapshot({
            players: {
              alice: {
                name: "Alice",
                hand: [
                  { id: 4, name: "Handmaid" },
                  mockCardPlayed, // Royal Confessor at index 1
                ],
                discard: [],
              },
              bob: {
                name: "Bob",
                hand: [mockTarget1Card],
                discard: [],
              },
              charlie: {
                name: "Charlie",
                hand: [mockTarget2Card],
                discard: [],
              },
            },
          })
        );

        const result = await applyRoyalConfessorEffect({
          roomCode: mockRoomCode,
          target1: mockTarget1,
          target2: mockTarget2,
          attacker: mockAttacker,
          selectedCardIndex: mockSelectedCardIndex,
          cardPlayed: mockCardPlayed,
        });

        // Check that Royal Confessor was discarded first
        expect(vi.mocked(update)).toHaveBeenNthCalledWith(1, "mock-ref", {
          "players/alice/hand": [{ id: 4, name: "Handmaid" }], // Remaining card
          "players/alice/discard": [mockCardPlayed], // Royal Confessor discarded
        });

        // Check that hands were swapped
        expect(vi.mocked(update)).toHaveBeenNthCalledWith(2, "mock-ref", {
          "players/bob/hand": [mockTarget2Card], // Bob gets Charlie's card
          "players/charlie/hand": [mockTarget1Card], // Charlie gets Bob's card
        });

        expect(result.result).toBe("confession");
        expect(result.isSelfTarget).toBe(false);
        expect(result.newTarget1Card).toEqual(mockTarget2Card); // What target1 received
        expect(result.newTarget2Card).toEqual(mockTarget1Card); // What target2 received

        // Check messages
        expect(result.externalAttackerMessage).toContain(
          "Royal Confessor clasps his hands piously"
        );
        expect(result.externalAttackerMessage).toContain("bob");
        expect(result.externalAttackerMessage).toContain("charlie");
        expect(result.target1Message).toContain("devout benefactor");
        expect(result.target1Message).toContain("alice");
        expect(result.target2Message).toContain("devout benefactor");
        expect(result.target2Message).toContain("alice");
        expect(result.publicMessage).toContain("Royal Confessor summoned");
      });
    });

    describe("Self-Target Scenarios (attacker = target1)", () => {
      it("should handle attacker targeting themselves and another player", async () => {
        const mockTarget1 = mockAttacker; // Alice targets herself
        const mockTarget2 = "bob";

        const mockAttackerRemainingCard = {
          id: 6,
          name: "Phantom King",
          strength: 6,
          effect: "Trade hands with another player",
        };

        const mockTarget2Card = {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at another player's hand",
        };

        vi.mocked(get).mockResolvedValue(
          createMockSnapshot({
            players: {
              alice: {
                name: "Alice",
                hand: [
                  mockAttackerRemainingCard,
                  mockCardPlayed, // Royal Confessor at index 1
                ],
                discard: [],
              },
              bob: {
                name: "Bob",
                hand: [mockTarget2Card],
                discard: [],
              },
            },
          })
        );

        const result = await applyRoyalConfessorEffect({
          roomCode: mockRoomCode,
          target1: mockTarget1,
          target2: mockTarget2,
          attacker: mockAttacker,
          selectedCardIndex: mockSelectedCardIndex,
          cardPlayed: mockCardPlayed,
        });

        // Check that Royal Confessor was discarded first
        expect(vi.mocked(update)).toHaveBeenNthCalledWith(1, "mock-ref", {
          "players/alice/hand": [mockAttackerRemainingCard], // Remaining card after discard
          "players/alice/discard": [mockCardPlayed], // Royal Confessor discarded
        });

        // Check that hands were swapped between attacker and target2
        expect(vi.mocked(update)).toHaveBeenNthCalledWith(2, "mock-ref", {
          "players/alice/hand": [mockTarget2Card], // Alice gets Bob's card
          "players/bob/hand": [mockAttackerRemainingCard], // Bob gets Alice's remaining card
        });

        expect(result.result).toBe("confession");
        expect(result.isSelfTarget).toBe(true);
        expect(result.newTarget1Card).toEqual(mockTarget2Card); // What attacker received
        expect(result.newTarget2Card).toEqual(mockAttackerRemainingCard); // What target2 received

        // Check self-target specific messages
        expect(result.attackerSelfTargetMessage).toContain(
          "Seeking divine favor, you step forth"
        );
        expect(result.attackerSelfTargetMessage).toContain("bob");
        expect(result.target2Message).toContain("them"); // Should refer to attacker as "them"
      });
    });

    describe("Error Handling", () => {
      it("should handle missing game data", async () => {
        vi.mocked(get).mockResolvedValue(createMockSnapshot(null));

        const result = await applyRoyalConfessorEffect({
          roomCode: mockRoomCode,
          target1: "bob",
          target2: "charlie",
          attacker: mockAttacker,
          selectedCardIndex: mockSelectedCardIndex,
          cardPlayed: mockCardPlayed,
        });

        expect(result).toBeUndefined();
        expect(vi.mocked(update)).not.toHaveBeenCalled();
      });

      it("should handle targets with invalid hand sizes", async () => {
        const mockTarget1 = "bob";
        const mockTarget2 = "charlie";

        vi.mocked(get).mockResolvedValue(
          createMockSnapshot({
            players: {
              alice: {
                name: "Alice",
                hand: [{ id: 4, name: "Handmaid" }, mockCardPlayed],
                discard: [],
              },
              bob: {
                name: "Bob",
                hand: [], // Invalid: empty hand
                discard: [],
              },
              charlie: {
                name: "Charlie",
                hand: [{ id: 5, name: "Prince" }],
                discard: [],
              },
            },
          })
        );

        const result = await applyRoyalConfessorEffect({
          roomCode: mockRoomCode,
          target1: mockTarget1,
          target2: mockTarget2,
          attacker: mockAttacker,
          selectedCardIndex: mockSelectedCardIndex,
          cardPlayed: mockCardPlayed,
        });

        // Should fail due to invalid hand size, but discard should still happen
        expect(result).toBeUndefined();
        expect(vi.mocked(update)).toHaveBeenCalledTimes(1); // Only the discard
      });
    });

    describe("Message Content Validation", () => {
      it("should include correct player names in external targeting messages", async () => {
        vi.mocked(get).mockResolvedValue(
          createMockSnapshot({
            players: {
              alice: {
                name: "Alice",
                hand: [{ id: 4, name: "Handmaid" }, mockCardPlayed],
                discard: [],
              },
              bob: {
                name: "Bob",
                hand: [{ id: 3, name: "Baron" }],
                discard: [],
              },
              charlie: {
                name: "Charlie",
                hand: [{ id: 5, name: "Prince" }],
                discard: [],
              },
            },
          })
        );

        const result = await applyRoyalConfessorEffect({
          roomCode: mockRoomCode,
          target1: "bob",
          target2: "charlie",
          attacker: mockAttacker,
          selectedCardIndex: mockSelectedCardIndex,
          cardPlayed: mockCardPlayed,
        });

        // Verify message content
        expect(result.externalAttackerMessage).toContain("bob");
        expect(result.externalAttackerMessage).toContain("charlie");
        expect(result.target1Message).toContain("alice");
        expect(result.target1Message).toContain("charlie");
        expect(result.target2Message).toContain("alice");
        expect(result.target2Message).toContain("bob");
        expect(result.publicMessage).toContain("Royal Confessor summoned");
      });

      it("should use proper pronouns in self-targeting messages", async () => {
        vi.mocked(get).mockResolvedValue(
          createMockSnapshot({
            players: {
              alice: {
                name: "Alice",
                hand: [{ id: 4, name: "Handmaid" }, mockCardPlayed],
                discard: [],
              },
              bob: {
                name: "Bob",
                hand: [{ id: 3, name: "Baron" }],
                discard: [],
              },
            },
          })
        );

        const result = await applyRoyalConfessorEffect({
          roomCode: mockRoomCode,
          target1: mockAttacker, // Self-target
          target2: "bob",
          attacker: mockAttacker,
          selectedCardIndex: mockSelectedCardIndex,
          cardPlayed: mockCardPlayed,
        });

        expect(result.attackerSelfTargetMessage).toContain("you step forth");
        expect(result.target2Message).toContain("them"); // Refers to attacker as "them"
      });
    });
  });
});
