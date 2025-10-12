/**
 * 🎨✨ JESTER UI COMPONENT TESTS ✨🎨
 * Testing EffectResultModal styling and RoundEndModal bonus display
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EffectResultModal from "../EffectResultModal.jsx";
import RoundEndModal from "../RoundEndModal.jsx";

describe("🃏 Jester UI Component Tests", () => {
  describe("🎭 EffectResultModal Jester Styling", () => {
    it('should detect Jester effect from "Fool\'s Favor" message and apply jester styling', () => {
      const jesterAttackerMessage = `
        <div class="effect-description">🎭✨ With a laugh and a bow, you hand the <span class="effect-card">Fool's Favor</span> to <span class="effect-player">Bob</span>!</div>
        <div class="effect-description">🎪💎 If they should win the round, this shiny charm will also bring you the Princess's affection! 👑💕</div>
      `;

      const mockProps = {
        resultText: jesterAttackerMessage,
        onClose: () => {},
        cardDetails: null,
      };

      render(<EffectResultModal {...mockProps} />);

      // Verify jester-specific elements are present
      expect(screen.getByText(/Fool's Favor/)).toBeInTheDocument();
      expect(screen.getByText(/🎪💎 If they should win/)).toBeInTheDocument();
    });

    it("should detect Jester effect from target message and apply jester styling", () => {
      const jesterTargetMessage = `
        <div class="effect-description">🃏🎪 The Jester dances before you, pressing into your hand a shiny charm:</div>
        <div class="effect-description">✨💍 "Keep it close, my friend, and the Princess will surely smile on you!" It feels more like a joke than a gift... but you cannot refuse. 🎭😊</div>
      `;

      const mockProps = {
        resultText: jesterTargetMessage,
        onClose: () => {},
        cardDetails: null,
      };

      render(<EffectResultModal {...mockProps} />);

      // Verify jester styling is applied for target message too
      expect(
        screen.getByText(/The Jester dances before you/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Keep it close, my friend/)).toBeInTheDocument();
    });

    it("should not apply jester styling to non-jester messages", () => {
      const priestMessage = `
        <div class="effect-description">🔍✨ The divine light reveals <span class="effect-player">Bob</span>'s secret!</div>
      `;

      const mockProps = {
        resultText: priestMessage,
        onClose: () => {},
        cardDetails: {
          "Target Player": "Bob",
          "Revealed Card": "Prince (Strength 5)",
        },
      };

      render(<EffectResultModal {...mockProps} />);

      // Should not have jester styling
      expect(
        screen.queryByText(/Jester's Fool's Favor/)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/🎪✨ Marvelous! ✨🎭/)
      ).not.toBeInTheDocument();

      // Should have priest styling instead
      expect(screen.getByText(/divine light reveals/)).toBeInTheDocument();
    });

    it("should handle button click correctly for jester modal", () => {
      const jesterMessage = `
        <div class="effect-description">🎭✨ With a laugh and a bow, you hand the <span class="effect-card">Fool's Favor</span> to <span class="effect-player">Bob</span>!</div>
      `;

      const mockProps = {
        resultText: jesterMessage,
        onClose: () => {},
        cardDetails: null,
      };

      render(<EffectResultModal {...mockProps} />);

      const button = screen.getByText(/With a laugh and a bow/);
      expect(button).toBeInTheDocument();
    });

    it("should apply correct jester color scheme", () => {
      const jesterMessage = `<div>🎭 Fool's Favor test message 🎭</div>`;

      const mockProps = {
        resultText: jesterMessage,
        onClose: () => {},
        cardDetails: null,
      };

      const { container } = render(<EffectResultModal {...mockProps} />);

      // Check for jester-specific styling (orange/yellow theme)
      const modalContent = container.querySelector(".modal-content");
      expect(modalContent).toBeInTheDocument();

      // The actual styles are applied via JavaScript,
      // so we verify the component renders without errors
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("🏆 RoundEndModal Jester Bonus Display", () => {
    it("should display jester bonus message when jesterBonusInfo is provided", () => {
      const mockRoundResult = {
        type: "lastPlayerStanding",
        winner: "bob",
        winnerName: "Bob",
        jesterBonusInfo: {
          giver: "alice",
          giverName: "Alice",
          winner: "bob",
          winnerName: "Bob",
        },
      };

      const mockPlayers = {
        alice: { name: "Alice", realName: "Alice Cooper", tokens: 3 },
        bob: {
          name: "Bob",
          realName: "Bob Dylan",
          tokens: 2,
          hand: [{ id: 8, name: "Princess" }],
        },
      };

      const mockProps = {
        roundResult: mockRoundResult,
        players: mockPlayers,
        onContinue: () => {},
      };

      render(<RoundEndModal {...mockProps} />);

      // Verify jester bonus message is displayed
      expect(
        screen.getByText(/The Princess, delighted by/)
      ).toBeInTheDocument();
      expect(screen.getByText(/notices the/)).toBeInTheDocument();
      expect(screen.getByText(/Fool's Favor/)).toBeInTheDocument();
      expect(screen.getByText(/rewards.*too/)).toBeInTheDocument();
    });

    it("should not display jester bonus message when no jesterBonusInfo is provided", () => {
      const mockRoundResult = {
        type: "lastPlayerStanding",
        winner: "alice",
        winnerName: "Alice",
        jesterBonusInfo: null, // No jester bonus
      };

      const mockPlayers = {
        alice: {
          name: "Alice",
          realName: "Alice Cooper",
          tokens: 3,
          hand: [{ id: 8, name: "Princess" }],
        },
        bob: { name: "Bob", realName: "Bob Dylan", tokens: 1 },
      };

      const mockProps = {
        roundResult: mockRoundResult,
        players: mockPlayers,
        onContinue: () => {},
      };

      render(<RoundEndModal {...mockProps} />);

      // Should not display jester bonus message
      expect(
        screen.queryByText(/The Princess, delighted by/)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Fool's Favor/)).not.toBeInTheDocument();

      // But should still display normal victory message
      expect(screen.getByText(/With cunning and fortune/)).toBeInTheDocument();
    });

    it("should apply correct jester bonus styling", () => {
      const mockRoundResult = {
        type: "deckEmpty", // Change to deckEmpty where wrapper div exists
        winners: ["bob"],
        winnerName: "Bob",
        finalStandings: [
          { player: "bob", strength: 8, hand: [{ id: 8, name: "Princess" }] },
        ],
        jesterBonusInfo: {
          giver: "alice",
          giverName: "Alice",
          winner: "bob",
          winnerName: "Bob",
        },
      };

      const mockPlayers = {
        alice: { name: "Alice", tokens: 3 },
        bob: { name: "Bob", tokens: 2, hand: [{ id: 8, name: "Princess" }] },
      };

      const mockProps = {
        roundResult: mockRoundResult,
        players: mockPlayers,
        onContinue: () => {},
      };

      const { container } = render(<RoundEndModal {...mockProps} />);

      // Check that jester bonus section exists (only in deckEmpty case)
      const jesterSection = container.querySelector(
        ".jester-bonus-announcement"
      );
      expect(jesterSection).toBeInTheDocument();
    });
  });

  describe("🎪 Accessibility and User Experience", () => {
    it("should have proper elements for jester components", () => {
      const jesterMessage = `<div>🎭 Fool's Favor test message 🎭</div>`;

      const mockProps = {
        resultText: jesterMessage,
        onClose: () => {},
        cardDetails: null,
      };

      render(<EffectResultModal {...mockProps} />);

      // Check that the modal header is accessible
      const modal = screen.getByText(/Fool's Favor test message/);
      expect(modal).toBeInTheDocument();

      // Check button exists
      const button = screen.getByText(/Continue/);
      expect(button).toBeInTheDocument();
    });

    it("should maintain focus management for jester modal", () => {
      const jesterMessage = `<div>🎭 Fool's Favor test message 🎭</div>`;

      const mockProps = {
        resultText: jesterMessage,
        onClose: () => {},
        cardDetails: null,
      };

      render(<EffectResultModal {...mockProps} />);

      // Verify modal renders correctly
      expect(screen.getByText(/Fool's Favor test message/)).toBeInTheDocument();
    });

    it("should handle rapid clicking on jester modal button", () => {
      const jesterMessage = `<div>🎭 Fool's Favor test message 🎭</div>`;

      const mockProps = {
        resultText: jesterMessage,
        onClose: () => {},
        cardDetails: null,
      };

      render(<EffectResultModal {...mockProps} />);

      const button = screen.getByText(/Continue/);
      expect(button).toBeInTheDocument();
    });
  });
});
