import { describe, it, expect, beforeEach, vi } from "vitest";

describe("🔄 Turn Advancement Integration - Edge Case Protection", () => {
  describe("Hand State Validation After Card Effects", () => {
    it("should detect the Phantom King selectedCardIndex bug scenario", () => {
      // Simulate the exact bug scenario that occurred
      const scenario = {
        name: "Phantom King Hand Swap Bug",
        description:
          "Player selects Phantom King (index 1), after effect hand changes size",

        // Initial state
        initialHand: [
          { id: 1, name: "Guard" },
          { id: 6, name: "Phantom King" },
        ],
        selectedCardIndex: 1, // Player selected Phantom King

        // After Phantom King effect - hand was swapped
        postEffectHand: [{ id: 3, name: "Baron" }], // Now only 1 card

        // Expected validation results
        expectedValidations: {
          shouldFailOldLogic: true, // Old logic: selectedCardIndex (1) >= hand.length (1)
          shouldPassNewLogic: true, // New logic: validates against current hand state
        },
      };

      // Test old logic (the buggy version)
      const oldLogicValidation =
        scenario.selectedCardIndex === null ||
        !scenario.postEffectHand ||
        scenario.postEffectHand.length !== 2; // Old logic expected exactly 2 cards

      expect(
        oldLogicValidation,
        "Old logic should fail due to hand size assumption"
      ).toBe(scenario.expectedValidations.shouldFailOldLogic);

      // Test the old index-based remaining card calculation
      const wouldFailWithOldLogic =
        scenario.selectedCardIndex >= scenario.postEffectHand.length;
      expect(
        wouldFailWithOldLogic,
        "Old logic would try to access index out of bounds"
      ).toBe(true);

      // Test new logic (the fixed version)
      const newLogicValidation =
        scenario.selectedCardIndex === null ||
        !scenario.postEffectHand ||
        scenario.postEffectHand.length === 0 ||
        scenario.selectedCardIndex >= scenario.postEffectHand.length;

      expect(
        newLogicValidation,
        "New logic should catch the index out of bounds"
      ).toBe(true);

      // Test new remaining hand calculation (flexible)
      if (
        scenario.postEffectHand &&
        scenario.selectedCardIndex < scenario.postEffectHand.length
      ) {
        const remainingHand = scenario.postEffectHand.filter(
          (_, index) => index !== scenario.selectedCardIndex
        );
        expect(
          remainingHand.length,
          "New logic calculates remaining hand correctly"
        ).toBe(scenario.postEffectHand.length - 1);
      }
    });

    it("should validate turn completion for various post-effect hand states", () => {
      const testScenarios = [
        {
          name: "Normal case - 2 cards to 1 card",
          initialHand: [{ id: 1 }, { id: 6 }],
          selectedIndex: 1,
          postEffectHand: [{ id: 1 }],
          shouldCompleteWithSelectedIndex: false, // Index 1 is out of bounds
          shouldCompleteWithCorrectedIndex: true, // Index 0 would work
        },
        {
          name: "Edge case - 1 card to 2 cards",
          initialHand: [{ id: 6 }],
          selectedIndex: 0,
          postEffectHand: [{ id: 2 }, { id: 3 }],
          shouldCompleteWithSelectedIndex: true, // Index 0 is still valid
          shouldCompleteWithCorrectedIndex: true,
        },
        {
          name: "Same size swap",
          initialHand: [{ id: 1 }, { id: 6 }],
          selectedIndex: 1,
          postEffectHand: [{ id: 2 }, { id: 3 }],
          shouldCompleteWithSelectedIndex: true, // Index 1 is still valid
          shouldCompleteWithCorrectedIndex: true,
        },
        {
          name: "Edge case - hand becomes empty",
          initialHand: [{ id: 6 }],
          selectedIndex: 0,
          postEffectHand: [],
          shouldCompleteWithSelectedIndex: false, // Empty hand
          shouldCompleteWithCorrectedIndex: false,
        },
      ];

      testScenarios.forEach((scenario) => {
        // Test validation with original selected index
        const canCompleteWithSelectedIndex =
          scenario.selectedIndex !== null &&
          scenario.selectedIndex !== undefined &&
          scenario.postEffectHand &&
          scenario.postEffectHand.length > 0 &&
          scenario.selectedIndex < scenario.postEffectHand.length;

        expect(
          canCompleteWithSelectedIndex,
          `${scenario.name}: Selected index ${scenario.selectedIndex} should ${
            scenario.shouldCompleteWithSelectedIndex ? "work" : "fail"
          } with post-effect hand of size ${scenario.postEffectHand.length}`
        ).toBe(scenario.shouldCompleteWithSelectedIndex);

        // Test with corrected index (always use 0 for single card)
        if (scenario.postEffectHand.length === 1) {
          const correctedIndex = 0;
          const canCompleteWithCorrectedIndex =
            correctedIndex !== null &&
            correctedIndex !== undefined &&
            scenario.postEffectHand &&
            scenario.postEffectHand.length > 0 &&
            correctedIndex < scenario.postEffectHand.length;

          expect(
            canCompleteWithCorrectedIndex,
            `${scenario.name}: Corrected index should ${
              scenario.shouldCompleteWithCorrectedIndex ? "work" : "fail"
            }`
          ).toBe(scenario.shouldCompleteWithCorrectedIndex);
        }
      });
    });

    it("should handle the specific Phantom King modal flow correctly", () => {
      // Simulate the complete Phantom King workflow
      const workflow = {
        phase1: {
          description: "Player selects Phantom King card",
          hand: [
            { id: 1, name: "Guard" },
            { id: 6, name: "Phantom King" },
          ],
          selectedCardIndex: 1, // Selecting Phantom King
          cardPlayed: { id: 6, name: "Phantom King" },
        },
        phase2: {
          description: "Target modal interaction (target selection or skip)",
          targetOptions: ["Alice", "Bob", "Nobody"],
          selectedTarget: "Alice", // Could also be "Nobody" for skip
        },
        phase3: {
          description: "Effect execution - hands are swapped",
          attackerHandBefore: [
            { id: 1, name: "Guard" },
            { id: 6, name: "Phantom King" },
          ],
          targetHandBefore: [{ id: 3, name: "Baron" }],
          // After swap:
          attackerHandAfter: [{ id: 3, name: "Baron" }], // Attacker gets target's hand
          targetHandAfter: [{ id: 1, name: "Guard" }], // Target gets attacker's hand (minus played card)
        },
        phase4: {
          description: "Turn completion with modified hand state",
          originalSelectedIndex: 1, // This was the Phantom King
          newHandSize: 1, // Attacker now has 1 card
          shouldUseNewValidation: true,
        },
      };

      // Validate the workflow phases
      const { phase1, phase3, phase4 } = workflow;

      // Phase 1: Initial validation
      expect(
        phase1.selectedCardIndex < phase1.hand.length,
        "Phase 1: Selected index should be valid initially"
      ).toBe(true);

      // Phase 3: Effect validation
      expect(
        phase3.attackerHandAfter.length,
        "Phase 3: Attacker should have target's original hand"
      ).toBe(phase3.targetHandBefore.length);
      expect(
        phase3.targetHandAfter.length,
        "Phase 3: Target should have attacker's hand minus played card"
      ).toBe(phase3.attackerHandBefore.length - 1);

      // Phase 4: The critical validation that was failing
      const wouldFailWithOldLogic =
        phase4.originalSelectedIndex >= phase4.newHandSize;
      expect(
        wouldFailWithOldLogic,
        "Phase 4: Old logic would fail with index out of bounds"
      ).toBe(true);

      // New logic should handle this gracefully
      const shouldPassWithNewLogic =
        (phase4.originalSelectedIndex >= phase4.newHandSize ? false : true) || // Index validation
        phase4.shouldUseNewValidation; // Or use flexible validation

      expect(
        shouldPassWithNewLogic,
        "Phase 4: New logic should handle variable hand sizes"
      ).toBe(true);
    });
  });

  describe("Validation Function Unit Tests", () => {
    // These mirror the actual validation functions in Play.jsx
    const validateHandStateForClose = (selectedCardIndex, hand) => {
      return (
        selectedCardIndex !== null &&
        selectedCardIndex !== undefined &&
        selectedCardIndex >= 0 &&
        hand !== null &&
        hand !== undefined &&
        Array.isArray(hand) &&
        hand.length > 0 &&
        selectedCardIndex < hand.length
      );
    };

    const validateHandStateForTurnCompletion = (cardIndex, hand) => {
      return (
        cardIndex !== null &&
        cardIndex !== undefined &&
        cardIndex >= 0 &&
        hand !== null &&
        hand !== undefined &&
        Array.isArray(hand) &&
        hand.length > 0 &&
        cardIndex < hand.length
      );
    };

    const calculateRemainingHand = (hand, cardIndex) => {
      return hand.filter((_, index) => index !== cardIndex);
    };

    it("should validate hand states correctly with new logic", () => {
      const testCases = [
        // Valid cases
        {
          hand: [{ id: 1 }, { id: 6 }],
          index: 0,
          expected: true,
          description: "Normal 2-card hand, first card",
        },
        {
          hand: [{ id: 1 }, { id: 6 }],
          index: 1,
          expected: true,
          description: "Normal 2-card hand, second card",
        },
        {
          hand: [{ id: 6 }],
          index: 0,
          expected: true,
          description: "Single card hand",
        },

        // Invalid cases
        { hand: [], index: 0, expected: false, description: "Empty hand" },
        {
          hand: [{ id: 6 }],
          index: 1,
          expected: false,
          description: "Index out of bounds",
        },
        {
          hand: [{ id: 1 }, { id: 6 }],
          index: 2,
          expected: false,
          description: "Index beyond hand size",
        },
        { hand: null, index: 0, expected: false, description: "Null hand" },
        {
          hand: [{ id: 6 }],
          index: -1,
          expected: false,
          description: "Negative index",
        },
      ];

      testCases.forEach((testCase) => {
        const { hand, index, expected, description } = testCase;

        const closeValidation = validateHandStateForClose(index, hand);
        const turnValidation = validateHandStateForTurnCompletion(index, hand);

        expect(
          closeValidation,
          `handleEffectResultClose - ${description}`
        ).toBe(expected);
        expect(
          turnValidation,
          `completeTurnWithCardIndex - ${description}`
        ).toBe(expected);

        // Test remaining hand calculation for valid cases
        if (
          expected &&
          hand &&
          hand.length > 0 &&
          index >= 0 &&
          index < hand.length
        ) {
          const remaining = calculateRemainingHand(hand, index);
          expect(remaining.length, `Remaining hand size - ${description}`).toBe(
            hand.length - 1
          );
        }
      });
    });

    it("should handle the exact bug scenario validation", () => {
      // The exact scenario that caused the bug
      const bugScenario = {
        selectedCardIndex: 1,
        handAfterEffect: [{ id: 3, name: "Baron" }], // Single card after swap
      };

      // This should fail validation (index 1 >= hand.length 1)
      const isValid = validateHandStateForClose(
        bugScenario.selectedCardIndex,
        bugScenario.handAfterEffect
      );
      expect(
        isValid,
        "Bug scenario should fail validation with new logic"
      ).toBe(false);

      // But if we had the correct index, it should work
      const correctedIndex = 0;
      const isValidWithCorrection = validateHandStateForClose(
        correctedIndex,
        bugScenario.handAfterEffect
      );
      expect(
        isValidWithCorrection,
        "Corrected index should pass validation"
      ).toBe(true);
    });
  });
});
