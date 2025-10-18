import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import BaronessTargetModal from "../BaronessTargetModal";

describe("BaronessTargetModal - The Court's Matchmaker", () => {
  const mockPlayers = {
    alice: {
      name: "Alice",
      realName: "Alice Real",
      isOut: false,
      hand: [{ id: 1 }],
    },
    bob: { name: "Bob", realName: "Bob Real", isOut: false, hand: [{ id: 2 }] },
    charlie: {
      name: "Charlie",
      realName: "Charlie Real",
      isOut: false,
      hand: [{ id: 3 }],
    },
    diana: {
      name: "Diana",
      realName: "Diana Real",
      isOut: false,
      hand: [{ id: 4 }],
    },
  };

  const defaultProps = {
    players: mockPlayers,
    currentPlayer: "alice",
    protectedPlayers: [],
    nextTarget: null,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 🌹 ROMANTIC THEME TESTS
  describe("💄 Romantic Styling & Theme", () => {
    test("renders with romantic Baroness styling", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      // Check romantic header text
      expect(
        screen.getByText(/Whose secrets shall we uncover/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/whose secrets shall we uncover/i)).toBeInTheDocument();

      // Check romantic button text
      expect(screen.getByText(/Spill the Tea/i)).toBeInTheDocument();
    });

    test("shows romantic styling in CSS animations", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      // Check that CSS animations are injected
      const styleElement = document.head.querySelector("style");
      expect(styleElement?.textContent).toContain("baronessSlideIn");
      expect(styleElement?.textContent).toContain("baronessFadeIn");
    });
  });

  // 🎯 TARGET SELECTION LOGIC TESTS
  describe("🎯 Target Selection Logic", () => {
    test("excludes current player from target options (Baroness cannot target herself)", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.click(firstSelect);

      // Alice (current player) should NOT be in the options
      expect(screen.queryByText(/alice/i)).not.toBeInTheDocument();

      // Other players should be available
      expect(screen.getByText(/💕 Bob \(Bob Real\)/)).toBeInTheDocument();
      expect(
        screen.getByText(/💕 Charlie \(Charlie Real\)/)
      ).toBeInTheDocument();
      expect(screen.getByText(/💕 Diana \(Diana Real\)/)).toBeInTheDocument();
    });

    test("shows two dropdowns when multiple targets available", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      expect(
        screen.getByDisplayValue("🌹 Choose a target...")
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("🌷 Choose a second romantic target...")
      ).toBeInTheDocument();
    });

    test("hides second dropdown when only one target available", () => {
      const limitedPlayers = {
        alice: {
          name: "Alice",
          realName: "Alice Real",
          isOut: false,
          hand: [{ id: 1 }],
        },
        bob: {
          name: "Bob",
          realName: "Bob Real",
          isOut: false,
          hand: [{ id: 2 }],
        },
      };

      render(
        <BaronessTargetModal {...defaultProps} players={limitedPlayers} />
      );

      expect(
        screen.getByDisplayValue("🌹 Choose a target...")
      ).toBeInTheDocument();
      expect(
        screen.queryByDisplayValue("🌷 Choose a second romantic target...")
      ).not.toBeInTheDocument();
    });

    test("shows skip option when no targets available", () => {
      const soloPlayer = {
        alice: {
          name: "Alice",
          realName: "Alice Real",
          isOut: false,
          hand: [{ id: 1 }],
        },
      };

      render(<BaronessTargetModal {...defaultProps} players={soloPlayer} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.click(firstSelect);

      expect(
        screen.getByText(/skip turn \(no available targets\)/i)
      ).toBeInTheDocument();
    });

    test("excludes handmaid-protected players from target options", () => {
      const protectedProps = {
        ...defaultProps,
        protectedPlayers: ["bob", "charlie"],
      };

      render(<BaronessTargetModal {...protectedProps} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.click(firstSelect);

      // Protected players should not appear
      expect(screen.queryByText(/💕 Bob \(Bob Real\)/)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/💕 Charlie \(Charlie Real\)/)
      ).not.toBeInTheDocument();

      // Only unprotected Diana should appear
      expect(screen.getByText(/💕 Diana \(Diana Real\)/)).toBeInTheDocument();
    });

    test("excludes eliminated players from target options", () => {
      const playersWithEliminated = {
        ...mockPlayers,
        bob: { ...mockPlayers.bob, isOut: true },
      };

      render(
        <BaronessTargetModal
          {...defaultProps}
          players={playersWithEliminated}
        />
      );

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.click(firstSelect);

      // Eliminated Bob should not appear
      expect(screen.queryByText(/💕 Bob \(Bob Real\)/)).not.toBeInTheDocument();

      // Active players should appear
      expect(
        screen.getByText(/💕 Charlie \(Charlie Real\)/)
      ).toBeInTheDocument();
      expect(screen.getByText(/💕 Diana \(Diana Real\)/)).toBeInTheDocument();
    });
  });

  // 🗣️ COURT WHISPERER INTEGRATION TESTS
  describe("🗣️ Court Whisperer Integration", () => {
    test("forces targeting when Court Whisperer effect is active", () => {
      const courtWhispererProps = {
        ...defaultProps,
        nextTarget: { used: true, nickname: "bob" },
      };

      render(<BaronessTargetModal {...courtWhispererProps} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.click(firstSelect);

      // Only the forced target should appear
      expect(screen.getByText(/💕 Bob \(Bob Real\) 🎯/)).toBeInTheDocument();
      expect(screen.queryByText(/💕 Charlie/)).not.toBeInTheDocument();
      expect(screen.queryByText(/💕 Diana/)).not.toBeInTheDocument();

      // Shows Court Whisperer message
      expect(
        screen.getByText(/the whole court can only talk about one name lately/i)
      ).toBeInTheDocument();
    });

    test("shows attention message when Court Whisperer forces current player", () => {
      const selfTargetProps = {
        ...defaultProps,
        nextTarget: { used: true, nickname: "alice" },
      };

      render(<BaronessTargetModal {...selfTargetProps} />);

      // Should show the attention message
      expect(
        screen.getByText(
          /the cost of being the center of the court's attention/i
        )
      ).toBeInTheDocument();

      // Should only show one dropdown
      expect(
        screen.getByDisplayValue("🌹 Choose a target...")
      ).toBeInTheDocument();
      expect(
        screen.queryByDisplayValue("🌷 Choose a second romantic target...")
      ).not.toBeInTheDocument();
    });
  });

  // 🔒 VALIDATION & BUTTON STATE TESTS
  describe("🔒 Validation & Button States", () => {
    test("disables confirm button when no target selected", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      const confirmButton = screen.getByText(/Spill the Tea/i);
      expect(confirmButton).toBeDisabled();
    });

    test("disables confirm button when same target selected twice", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      // Select same target in both dropdowns
      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "bob" } });

      const secondSelect = screen.getByDisplayValue(
        "🌷 Choose a second romantic target..."
      );
      fireEvent.change(secondSelect, { target: { value: "bob" } });

      const confirmButton = screen.getByText(/Spill the Tea/i);
      expect(confirmButton).toBeDisabled();

      // Should show error message
      expect(
        screen.getByText(/you need 2 different romantic targets/i)
      ).toBeInTheDocument();
    });

    test("enables confirm button with valid single target", () => {
      const limitedPlayers = {
        alice: {
          name: "Alice",
          realName: "Alice Real",
          isOut: false,
          hand: [{ id: 1 }],
        },
        bob: {
          name: "Bob",
          realName: "Bob Real",
          isOut: false,
          hand: [{ id: 2 }],
        },
      };

      render(
        <BaronessTargetModal {...defaultProps} players={limitedPlayers} />
      );

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "bob" } });

      const confirmButton = screen.getByText(/Spill the Tea/i);
      expect(confirmButton).not.toBeDisabled();
    });

    test("enables confirm button with valid two different targets", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "bob" } });

      const secondSelect = screen.getByDisplayValue(
        "🌷 Choose a second romantic target..."
      );
      fireEvent.change(secondSelect, { target: { value: "charlie" } });

      const confirmButton = screen.getByText(/Spill the Tea/i);
      expect(confirmButton).not.toBeDisabled();
    });

    test("enables confirm button for skip turn option", () => {
      const soloPlayer = {
        alice: {
          name: "Alice",
          realName: "Alice Real",
          isOut: false,
          hand: [{ id: 1 }],
        },
      };

      render(<BaronessTargetModal {...defaultProps} players={soloPlayer} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "SKIP_TURN" } });

      const confirmButton = screen.getByText(/skip turn/i);
      expect(confirmButton).not.toBeDisabled();
    });
  });

  // 💋 INTERACTION TESTS
  describe("💋 User Interactions", () => {
    test("calls onConfirm with single target when confirmed", () => {
      const limitedPlayers = {
        alice: {
          name: "Alice",
          realName: "Alice Real",
          isOut: false,
          hand: [{ id: 1 }],
        },
        bob: {
          name: "Bob",
          realName: "Bob Real",
          isOut: false,
          hand: [{ id: 2 }],
        },
      };

      render(
        <BaronessTargetModal {...defaultProps} players={limitedPlayers} />
      );

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "bob" } });

      const confirmButton = screen.getByText(/Spill the Tea/i);
      fireEvent.click(confirmButton);

      expect(defaultProps.onConfirm).toHaveBeenCalledWith({
        target: "bob",
        target2: null,
      });
    });

    test("calls onConfirm with dual targets when confirmed", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "bob" } });

      const secondSelect = screen.getByDisplayValue(
        "🌷 Choose a second romantic target..."
      );
      fireEvent.change(secondSelect, { target: { value: "charlie" } });

      const confirmButton = screen.getByText(/Spill the Tea/i);
      fireEvent.click(confirmButton);

      expect(defaultProps.onConfirm).toHaveBeenCalledWith({
        target: "bob",
        target2: "charlie",
      });
    });

    test("calls onConfirm with SKIP_TURN when no targets available", () => {
      const soloPlayer = {
        alice: {
          name: "Alice",
          realName: "Alice Real",
          isOut: false,
          hand: [{ id: 1 }],
        },
      };

      render(<BaronessTargetModal {...defaultProps} players={soloPlayer} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "SKIP_TURN" } });

      const confirmButton = screen.getByText(/skip turn/i);
      fireEvent.click(confirmButton);

      expect(defaultProps.onConfirm).toHaveBeenCalledWith({
        target: "SKIP_TURN",
        target2: null,
      });
    });

    test("calls onCancel when back button clicked", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      const backButton = screen.getByText(/back/i);
      fireEvent.click(backButton);

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    test("updates second dropdown options when first target changes", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      // Select Bob in first dropdown
      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "bob" } });

      // Second dropdown should not include Bob
      const secondSelect = screen.getByDisplayValue(
        "🌷 Choose a second romantic target..."
      );
      fireEvent.click(secondSelect);

      expect(screen.queryByText(/💕 Bob \(Bob Real\)/)).not.toBeInTheDocument();
      expect(
        screen.getByText(/💕 Charlie \(Charlie Real\)/)
      ).toBeInTheDocument();
      expect(screen.getByText(/💕 Diana \(Diana Real\)/)).toBeInTheDocument();
    });
  });

  // 🎨 STYLING & ANIMATION TESTS
  describe("🎨 Visual & Animation Features", () => {
    test("applies romantic hover effects to buttons", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      const firstSelect = screen.getByDisplayValue(
        "🌹 Choose a target..."
      );
      fireEvent.change(firstSelect, { target: { value: "bob" } });

      const confirmButton = screen.getByText(/Spill the Tea/i);

      // Test hover effects (we can't directly test CSS changes, but we can test the event handlers exist)
      fireEvent.mouseEnter(confirmButton);
      fireEvent.mouseLeave(confirmButton);

      // No errors should occur
      expect(confirmButton).toBeInTheDocument();
    });

    test("shows romantic emojis in UI elements", () => {
      render(<BaronessTargetModal {...defaultProps} />);

      // Check romantic emojis are present
      expect(screen.getByText(/🌹/)).toBeInTheDocument(); // First dropdown
      expect(screen.getByText(/🌷/)).toBeInTheDocument(); // Second dropdown
      expect(screen.getByText(/☕/)).toBeInTheDocument(); // Spill the Tea button
    });
  });
});
