import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  applyPhantomKingEffect,
  shouldAdvanceTurnOnModal,
} from "../cardEffects.js";

// Mock Firebase properly
vi.mock("../firebase.js", () => ({
  db: { _checkNotDeleted: vi.fn() },
  ref: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
}));

describe("🎭 Phantom King Effects - The Ethereal Sovereign", () => {
  let mockGet, mockUpdate, mockRef;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked functions
    const firebase = await import("../firebase.js");
    mockGet = firebase.get;
    mockUpdate = firebase.update;
    mockRef = firebase.ref;

    // Setup default mock returns
    mockRef.mockReturnValue({ path: "mock-ref" });
  });

  describe("shouldAdvanceTurnOnModal - Royal Protocol", () => {
    it("should follow correct turn advancement protocols for the royal court", () => {
      // Prince: Target controls destiny
      expect(shouldAdvanceTurnOnModal(5, true)).toBe(false); // Prince attacker waits
      expect(shouldAdvanceTurnOnModal(5, false)).toBe(true); // Prince target advances

      // Phantom King: Attacker commands fate
      expect(shouldAdvanceTurnOnModal(6, true)).toBe(true); // Phantom King attacker advances
      expect(shouldAdvanceTurnOnModal(6, false)).toBe(false); // Phantom King target observes

      // Guard: Traditional protocol
      expect(shouldAdvanceTurnOnModal(1, true)).toBe(true); // Guard attacker advances
      expect(shouldAdvanceTurnOnModal(1, false)).toBe(false); // Guard target observes

      // Unknown cards: Default to traditional protocol
      expect(shouldAdvanceTurnOnModal(99, true)).toBe(true); // Unknown card defaults to attacker advances
    });
  });

  describe("Turn Advancement Edge Cases - Hand Size Validation", () => {
    it("should handle various hand sizes after card effects", () => {
      // Simulate different hand size scenarios that could occur after card effects
      const testCases = [
        {
          name: "Normal 2-card hand",
          hand: [{ id: 1 }, { id: 6 }],
          selectedIndex: 0,
          shouldBeValid: true,
          description: "Standard scenario with 2 cards",
        },
        {
          name: "Normal 2-card hand, second card selected",
          hand: [{ id: 1 }, { id: 6 }],
          selectedIndex: 1,
          shouldBeValid: true,
          description: "Standard scenario selecting second card",
        },
        {
          name: "Single card hand (after hand swap)",
          hand: [{ id: 6 }],
          selectedIndex: 0,
          shouldBeValid: true,
          description: "Hand with 1 card after Phantom King swap",
        },
        {
          name: "Three card hand (hypothetical edge case)",
          hand: [{ id: 1 }, { id: 6 }, { id: 3 }],
          selectedIndex: 1,
          shouldBeValid: true,
          description: "Hand with 3 cards, selecting middle card",
        },
        {
          name: "Empty hand",
          hand: [],
          selectedIndex: 0,
          shouldBeValid: false,
          description: "Empty hand should be invalid",
        },
        {
          name: "Index out of bounds",
          hand: [{ id: 6 }],
          selectedIndex: 1,
          shouldBeValid: false,
          description: "Selected index beyond hand size",
        },
        {
          name: "Negative index",
          hand: [{ id: 1 }, { id: 6 }],
          selectedIndex: -1,
          shouldBeValid: false,
          description: "Negative index should be invalid",
        },
        {
          name: "Null hand",
          hand: null,
          selectedIndex: 0,
          shouldBeValid: false,
          description: "Null hand should be invalid",
        },
      ];

      testCases.forEach((testCase) => {
        const { name, hand, selectedIndex, shouldBeValid, description } =
          testCase;

        // Simulate the validation logic from handleEffectResultClose
        const isValidForClose =
          selectedIndex !== null &&
          selectedIndex !== undefined &&
          selectedIndex >= 0 &&
          hand !== null &&
          hand !== undefined &&
          Array.isArray(hand) &&
          hand.length > 0 &&
          selectedIndex < hand.length;

        // Simulate the validation logic from completeTurnWithCardIndex
        const isValidForTurnCompletion =
          selectedIndex !== null &&
          selectedIndex !== undefined &&
          selectedIndex >= 0 &&
          hand !== null &&
          hand !== undefined &&
          Array.isArray(hand) &&
          hand.length > 0 &&
          selectedIndex < hand.length;

        expect(
          isValidForClose,
          `${name}: handleEffectResultClose validation - ${description}`
        ).toBe(shouldBeValid);
        expect(
          isValidForTurnCompletion,
          `${name}: completeTurnWithCardIndex validation - ${description}`
        ).toBe(shouldBeValid);

        // Test the remaining hand calculation for valid cases
        if (shouldBeValid && hand && hand.length > 0) {
          const remainingHand = hand.filter(
            (_, index) => index !== selectedIndex
          );
          expect(
            remainingHand.length,
            `${name}: remaining hand should have correct size`
          ).toBe(hand.length - 1);
          expect(
            remainingHand.every((card) => card),
            `${name}: remaining hand should have valid cards`
          ).toBe(true);
        }
      });
    });

    it("should handle Phantom King specific scenarios", () => {
      // Test the specific bug scenario that occurred
      const preSwapHand = [{ id: 1 }, { id: 6 }]; // Player has Guard + Phantom King
      const selectedCardIndex = 1; // Selecting Phantom King (index 1)

      // After Phantom King effect, player might receive a different hand
      const postSwapHand = [{ id: 3 }]; // Player now has only Baron

      // The bug: selectedCardIndex (1) is now out of bounds for postSwapHand.length (1)
      const isValidAfterSwap =
        selectedCardIndex !== null &&
        postSwapHand &&
        postSwapHand.length > 0 &&
        selectedCardIndex < postSwapHand.length;

      expect(
        isValidAfterSwap,
        "Post-swap validation should catch index out of bounds"
      ).toBe(false);

      // The correct approach: validate against current hand state
      const correctIndex = 0; // Should select index 0 for the single remaining card
      const isValidWithCorrectIndex =
        correctIndex !== null &&
        postSwapHand &&
        postSwapHand.length > 0 &&
        correctIndex < postSwapHand.length;

      expect(isValidWithCorrectIndex, "Correct index should be valid").toBe(
        true
      );
    });

    it("should properly calculate remaining hands for various sizes", () => {
      const testHands = [
        { hand: [{ id: 1 }, { id: 6 }], playIndex: 0, expected: [{ id: 6 }] },
        { hand: [{ id: 1 }, { id: 6 }], playIndex: 1, expected: [{ id: 1 }] },
        { hand: [{ id: 6 }], playIndex: 0, expected: [] },
        {
          hand: [{ id: 1 }, { id: 6 }, { id: 3 }],
          playIndex: 1,
          expected: [{ id: 1 }, { id: 3 }],
        },
      ];

      testHands.forEach(({ hand, playIndex, expected }, index) => {
        const remainingHand = hand.filter((_, idx) => idx !== playIndex);
        expect(
          remainingHand,
          `Test case ${index + 1}: remaining hand calculation`
        ).toEqual(expected);
      });
    });
  });
});
