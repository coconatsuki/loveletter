import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import EffectResultModal from "../EffectResultModal";

// Mock the cardsData import
vi.mock("../../utils/cardsData", () => ({
  getCardImage: (cardName) => `${cardName.toLowerCase()}.jpeg`,
}));

describe("EffectResultModal - Baroness Romantic Styling", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 💄 BARONESS ATTACKER TESTS
  describe("💄 Baroness Attacker Display", () => {
    const baronessAttackerProps = {
      selectedCardId: 15,
      role: "attacker",
      resultText:
        "🍷✨ At her evening soirée, the Baroness fans herself with excitement...",
      cardDetails: {
        target1Name: "Alice",
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at hand",
        },
        target2Name: "Bob",
        target2Card: {
          id: 5,
          name: "Prince",
          strength: 5,
          effect: "Discard hand",
        },
      },
      onClose: mockOnClose,
    };

    test("renders with romantic Baroness styling for attacker", () => {
      render(<EffectResultModal {...baronessAttackerProps} />);

      // Check romantic header
      expect(screen.getByText("💄 The Court's Matchmaker")).toBeInTheDocument();

      // Check romantic crown decoration
      expect(screen.getByText("💄")).toBeInTheDocument();

      // Check card display layout exists
      expect(screen.getByText("Alice's ally")).toBeInTheDocument();
      expect(screen.getByText("Bob's ally")).toBeInTheDocument();
    });

    test("displays both revealed cards with proper styling", () => {
      render(<EffectResultModal {...baronessAttackerProps} />);

      // Check both cards are displayed
      expect(screen.getByText("Priest")).toBeInTheDocument();
      expect(screen.getByText("Prince")).toBeInTheDocument();

      // Check strength values
      expect(screen.getByText("2")).toBeInTheDocument(); // Priest strength
      expect(screen.getByText("5")).toBeInTheDocument(); // Prince strength

      // Check effects are shown
      expect(screen.getByText("Look at hand")).toBeInTheDocument();
      expect(screen.getByText("Discard hand")).toBeInTheDocument();
    });

    test("displays single card when only one target", () => {
      const singleTargetProps = {
        ...baronessAttackerProps,
        cardDetails: {
          target1Name: "Alice",
          target1Card: {
            id: 3,
            name: "Baron",
            strength: 3,
            effect: "Compare hands",
          },
          target2Name: null,
          target2Card: null,
        },
      };

      render(<EffectResultModal {...singleTargetProps} />);

      // Check single card is displayed
      expect(screen.getByText("Alice's ally")).toBeInTheDocument();
      expect(screen.getByText("Baron")).toBeInTheDocument();

      // Check second card is not displayed
      expect(screen.queryByText("Bob's ally")).not.toBeInTheDocument();
    });

    test("applies romantic button styling", () => {
      render(<EffectResultModal {...baronessAttackerProps} />);

      const continueButton = screen.getByText("☕ Continue");
      expect(continueButton).toBeInTheDocument();

      // Test hover effects (we can test the event handlers exist)
      fireEvent.mouseEnter(continueButton);
      fireEvent.mouseLeave(continueButton);

      // No errors should occur
      expect(continueButton).toBeInTheDocument();
    });

    test("calls onClose when continue button clicked", () => {
      render(<EffectResultModal {...baronessAttackerProps} />);

      const continueButton = screen.getByText("☕ Continue");
      fireEvent.click(continueButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // 💋 BARONESS TARGET TESTS
  describe("💋 Baroness Target Display", () => {
    const baronessTargetProps = {
      selectedCardId: 15,
      role: "target",
      resultText:
        "🎉💋 The Baroness' soirée hums with laughter when she takes your arm...",
      onClose: mockOnClose,
    };

    test("renders with romantic Baroness styling for target", () => {
      render(<EffectResultModal {...baronessTargetProps} />);

      // Check romantic header
      expect(screen.getByText("💄 The Court's Matchmaker")).toBeInTheDocument();

      // Check romantic crown decoration
      expect(screen.getByText("💄")).toBeInTheDocument();

      // Check romantic message is displayed
      expect(
        screen.getByText(/the baroness' soirée hums with laughter/i)
      ).toBeInTheDocument();
    });

    test("applies romantic target button styling", () => {
      render(<EffectResultModal {...baronessTargetProps} />);

      const continueButton = screen.getByText("💋 Continue");
      expect(continueButton).toBeInTheDocument();

      // Test hover effects
      fireEvent.mouseEnter(continueButton);
      fireEvent.mouseLeave(continueButton);

      expect(continueButton).toBeInTheDocument();
    });

    test("calls onClose when target continue button clicked", () => {
      render(<EffectResultModal {...baronessTargetProps} />);

      const continueButton = screen.getByText("💋 Continue");
      fireEvent.click(continueButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test("displays romantic emojis in target message", () => {
      render(<EffectResultModal {...baronessTargetProps} />);

      // The romantic emojis should be preserved in the formatted text
      expect(screen.getByText(/🎉💋/)).toBeInTheDocument();
    });

    test("does not show card details for targets", () => {
      render(<EffectResultModal {...baronessTargetProps} />);

      // Targets should not see card details - those are only for attackers
      expect(screen.queryByText(/ally/)).not.toBeInTheDocument();
      expect(screen.queryByText("Priest")).not.toBeInTheDocument();
      expect(screen.queryByText("Prince")).not.toBeInTheDocument();
    });
  });

  // 🎨 STYLING & THEME TESTS
  describe("🎨 Styling & Theme Consistency", () => {
    test("applies consistent romantic background for all Baroness effects", () => {
      const attackerProps = {
        selectedCardId: 15,
        role: "attacker",
        resultText: "Attacker message",
        cardDetails: {
          target1Name: "Alice",
          target1Card: { id: 2, name: "Priest", strength: 2, effect: "Look" },
        },
        onClose: mockOnClose,
      };

      const { rerender } = render(<EffectResultModal {...attackerProps} />);

      // Check modal exists (we can't directly test CSS, but we can verify it renders)
      expect(screen.getByText("💄 The Court's Matchmaker")).toBeInTheDocument();

      // Test target version
      const targetProps = {
        selectedCardId: 15,
        role: "target",
        resultText: "Target message",
        onClose: mockOnClose,
      };

      rerender(<EffectResultModal {...targetProps} />);

      // Same header should appear for targets
      expect(screen.getByText("💄 The Court's Matchmaker")).toBeInTheDocument();
    });

    test("shows correct crown decoration color for Baroness", () => {
      const props = {
        selectedCardId: 15,
        role: "attacker",
        resultText: "Test message",
        cardDetails: {
          target1Name: "Alice",
          target1Card: { id: 2, name: "Priest", strength: 2, effect: "Look" },
        },
        onClose: mockOnClose,
      };

      render(<EffectResultModal {...props} />);

      // Baroness should have the 💄 crown decoration
      expect(screen.getByText("💄")).toBeInTheDocument();

      // Should not have other card decorations
      expect(screen.queryByText("🔍")).not.toBeInTheDocument(); // Priest
      expect(screen.queryByText("👻")).not.toBeInTheDocument(); // Phantom King
      expect(screen.queryByText("🕯️")).not.toBeInTheDocument(); // Royal Confessor
    });

    test("formats text with romantic CSS classes", () => {
      const props = {
        selectedCardId: 15,
        role: "target",
        resultText:
          '<div class="effect-description baroness">Romantic message</div>',
        onClose: mockOnClose,
      };

      render(<EffectResultModal {...props} />);

      // Check that the romantic message is displayed
      expect(screen.getByText("Romantic message")).toBeInTheDocument();
    });
  });

  // 🔄 COMPARISON WITH OTHER CARDS
  describe("🔄 Comparison with Other Card Effects", () => {
    test("Baroness styling differs from Priest styling", () => {
      const priestProps = {
        selectedCardId: 2,
        role: "attacker",
        resultText: "Priest message\nRevealed Card: Guard (Strength 1)",
        cardDetails: {
          "Revealed Card": "Guard (Strength 1)",
        },
        onClose: mockOnClose,
      };

      const { rerender } = render(<EffectResultModal {...priestProps} />);

      // Priest should have different header
      expect(
        screen.getByText("Priest's Divine Revelation")
      ).toBeInTheDocument();
      expect(screen.getByText("🔍")).toBeInTheDocument(); // Priest crown

      // Switch to Baroness
      const baronessProps = {
        selectedCardId: 15,
        role: "attacker",
        resultText: "Baroness message",
        cardDetails: {
          target1Name: "Alice",
          target1Card: { id: 2, name: "Priest", strength: 2, effect: "Look" },
        },
        onClose: mockOnClose,
      };

      rerender(<EffectResultModal {...baronessProps} />);

      // Baroness should have different header and crown
      expect(screen.getByText("💄 The Court's Matchmaker")).toBeInTheDocument();
      expect(screen.getByText("💄")).toBeInTheDocument(); // Baroness crown
      expect(screen.queryByText("🔍")).not.toBeInTheDocument(); // No Priest crown
    });

    test("Baroness styling differs from Royal Confessor styling", () => {
      const confessorProps = {
        selectedCardId: 13,
        role: "attacker",
        resultText: "Confessor message",
        swappedCards: {
          attackerGave: { id: 1, name: "Guard", strength: 1, effect: "Guess" },
          attackerReceived: {
            id: 2,
            name: "Priest",
            strength: 2,
            effect: "Look",
          },
          targetGave: { id: 2, name: "Priest", strength: 2, effect: "Look" },
          targetReceived: {
            id: 1,
            name: "Guard",
            strength: 1,
            effect: "Guess",
          },
        },
        onClose: mockOnClose,
      };

      const { rerender } = render(<EffectResultModal {...confessorProps} />);

      // Royal Confessor should have different header
      expect(
        screen.getByText("🕯️ The Mutual Confession Ritual")
      ).toBeInTheDocument();
      expect(screen.getByText("🕯️")).toBeInTheDocument(); // Confessor crown

      // Switch to Baroness
      const baronessProps = {
        selectedCardId: 15,
        role: "attacker",
        resultText: "Baroness message",
        cardDetails: {
          target1Name: "Alice",
          target1Card: { id: 2, name: "Priest", strength: 2, effect: "Look" },
        },
        onClose: mockOnClose,
      };

      rerender(<EffectResultModal {...baronessProps} />);

      // Baroness should have different styling
      expect(screen.getByText("💄 The Court's Matchmaker")).toBeInTheDocument();
      expect(screen.getByText("💄")).toBeInTheDocument(); // Baroness crown
      expect(screen.queryByText("🕯️")).not.toBeInTheDocument(); // No Confessor crown
    });
  });

  // 📱 RESPONSIVE & LAYOUT TESTS
  describe("📱 Layout & Responsive Tests", () => {
    test("card layout handles different numbers of revealed cards", () => {
      // Test with two cards
      const twoCardsProps = {
        selectedCardId: 15,
        role: "attacker",
        resultText: "Two cards message",
        cardDetails: {
          target1Name: "Alice",
          target1Card: { id: 2, name: "Priest", strength: 2, effect: "Look" },
          target2Name: "Bob",
          target2Card: { id: 3, name: "Baron", strength: 3, effect: "Compare" },
        },
        onClose: mockOnClose,
      };

      const { rerender } = render(<EffectResultModal {...twoCardsProps} />);

      expect(screen.getByText("Alice's ally")).toBeInTheDocument();
      expect(screen.getByText("Bob's ally")).toBeInTheDocument();

      // Test with one card
      const oneCardProps = {
        ...twoCardsProps,
        cardDetails: {
          target1Name: "Alice",
          target1Card: { id: 2, name: "Priest", strength: 2, effect: "Look" },
          target2Name: null,
          target2Card: null,
        },
      };

      rerender(<EffectResultModal {...oneCardProps} />);

      expect(screen.getByText("Alice's ally")).toBeInTheDocument();
      expect(screen.queryByText("Bob's ally")).not.toBeInTheDocument();
    });

    test("message area scales properly for different content lengths", () => {
      const shortMessageProps = {
        selectedCardId: 15,
        role: "target",
        resultText: "Short message.",
        onClose: mockOnClose,
      };

      const { rerender } = render(<EffectResultModal {...shortMessageProps} />);

      expect(screen.getByText("Short message.")).toBeInTheDocument();

      const longMessageProps = {
        selectedCardId: 15,
        role: "target",
        resultText:
          "This is a very long message that contains multiple sentences and should test how the modal handles longer content. It includes romantic emojis 💋 and multiple paragraphs of text to ensure proper layout.",
        onClose: mockOnClose,
      };

      rerender(<EffectResultModal {...longMessageProps} />);

      expect(
        screen.getByText(/this is a very long message/i)
      ).toBeInTheDocument();
    });
  });
});
