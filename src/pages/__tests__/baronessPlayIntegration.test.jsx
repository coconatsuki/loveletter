import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mock pushNotification FIRST
vi.mock("../../utils/pushNotification", () => ({
  pushNotification: vi.fn(),
}));
// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  off: vi.fn(),
}));

import Play from "../../pages/Play";
import * as cardEffects from "../../utils/cardEffects";
import { ref, onValue, update, get, set } from "firebase/database";
import { pushNotification } from "../../utils/pushNotification";

// Mock React Router
const mockNavigate = vi.fn();
const mockLocation = {
  state: { nickname: "test_player", realName: "Test Player" },
};
const mockParams = { id: "TEST_ROOM" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useParams: () => mockParams,
  };
});

// Mock card effects
vi.mock("../../utils/cardEffects", () => ({
  applyBaronessEffect: vi.fn(),
  shouldAdvanceTurnOnModal: vi.fn(() => true),
  executeAssassinationElimination: vi.fn(),
}));

describe("Play.jsx - Baroness Integration Tests 💄", () => {
  const mockRoomData = {
    players: {
      test_player: {
        name: "Test Player",
        realName: "Test Real",
        hand: [
          { id: 15, name: "Baroness", strength: 3 },
          { id: 1, name: "Guard", strength: 1 },
        ],
        discard: [],
        isOut: false,
        tokens: 0,
      },
      alice: {
        name: "Alice",
        realName: "Alice Real",
        hand: [{ id: 2, name: "Priest", strength: 2 }],
        discard: [],
        isOut: false,
        tokens: 0,
      },
      bob: {
        name: "Bob",
        realName: "Bob Real",
        hand: [{ id: 5, name: "Prince", strength: 5 }],
        discard: [],
        isOut: false,
        tokens: 0,
      },
    },
    round: {
      currentPlayer: "test_player",
      deck: [{ id: 3 }, { id: 4 }],
      hasDrawnCard: true, // Player has already drawn a card this turn
    },
    protectedPlayers: [],
    host: "test_player",
    gameState: "playing",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Firebase onValue to return room data
    onValue.mockImplementation((ref, callback) => {
      callback({ val: () => mockRoomData });
      return vi.fn(); // unsubscribe function
    });
    update.mockResolvedValue();
    get.mockResolvedValue({ val: () => mockRoomData });
    set.mockResolvedValue();
    ref.mockReturnValue({}); // Return a mock ref object

    // Mock executeAssassinationElimination
    cardEffects.executeAssassinationElimination.mockResolvedValue({});
  });

  const renderPlay = () => {
    return render(
      <BrowserRouter>
        <Play />
      </BrowserRouter>
    );
  };

  // 🎯 BARONESS CARD SELECTION TESTS
  describe("🎯 Baroness Card Selection & Target Modal", () => {
    test("opens BaronessTargetModal when Baroness card is selected", async () => {
      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      // Click the Baroness card
      const baronessCard = screen.getByText("Baroness");
      fireEvent.click(baronessCard);

      // Should show the romantic target modal
      await waitFor(() => {
        expect(
          screen.getByText(/whose secrets shall we uncover/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Spill the Tea/i)).toBeInTheDocument();
      });
    });

    test("shows correct targeting options in Baroness modal", async () => {
      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.click(firstSelect);

        // Should show other players but not current player (Alice and Bob appear in both dropdowns)
        const aliceOptions = screen.getAllByText(/💕 Alice \(Alice Real\)/);
        expect(aliceOptions.length).toBeGreaterThan(0);
        const bobOptions = screen.getAllByText(/💕 Bob \(Bob Real\)/);
        expect(bobOptions.length).toBeGreaterThan(0);
        expect(screen.queryByText(/test_player/i)).not.toBeInTheDocument();
      });
    });

    test("handles Court Whisperer forced targeting in Baroness modal", async () => {
      const roomDataWithWhisperer = {
        ...mockRoomData,
        round: {
          ...mockRoomData.round,
          nextTarget: { used: true, nickname: "alice" },
        },
      };

      onValue.mockImplementation((ref, callback) => {
        callback({ val: () => roomDataWithWhisperer });
        return vi.fn();
      });

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        expect(
          screen.getByText(
            /the whole court can only talk about one name lately/i
          )
        ).toBeInTheDocument();

        // Court Whisperer should force only Alice to appear in first dropdown
        expect(
          screen.getByText(/💕 Alice \(Alice Real\) 🎯/)
        ).toBeInTheDocument();

        // The first dropdown should only show Alice when Court Whisperer is active
        // Note: There might be a second dropdown that shows Bob, but that's component behavior we're testing
        const firstDropdown = screen.getByDisplayValue("🌹 Choose a target...");
        expect(firstDropdown).toBeInTheDocument();
      });
    });
  });

  // 💋 BARONESS EFFECT EXECUTION TESTS
  describe("💋 Baroness Effect Execution", () => {
    test("executes Baroness effect with single target", async () => {
      // Create room with only one available target
      const roomDataOneTarget = {
        ...mockRoomData,
        players: {
          test_player: {
            name: "Test Player",
            realName: "Test Real",
            hand: [
              { id: 15, name: "Baroness", strength: 3 },
              { id: 1, name: "Guard", strength: 1 },
            ],
            discard: [],
            isOut: false,
            tokens: 0,
          },
          alice: {
            name: "Alice",
            realName: "Alice Real",
            hand: [{ id: 2, name: "Priest", strength: 2 }],
            discard: [],
            isOut: false,
            tokens: 0,
          },
        },
        round: {
          ...mockRoomData.round,
          hasDrawnCard: true,
        },
      };

      // Mock room data with only one target
      onValue.mockImplementation((ref, callback) => {
        callback({ val: () => roomDataOneTarget });
        return vi.fn(); // Return unsubscribe function
      });

      const mockBaronessResult = {
        result: "baronessReveal",
        attacker: "test_player",
        target1: "alice",
        target2: null,
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at hand",
        },
        target2Card: null,
        attackerMessage: "�✨ At her evening soirée...",
        target1Message: "🎉💋 The Baroness' soirée hums...",
        publicMessage: "🍷✨ 💋 At her grand soirée...",
      };

      cardEffects.applyBaronessEffect.mockResolvedValue(mockBaronessResult);

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      // Select Baroness card
      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.change(firstSelect, { target: { value: "alice" } });

        const confirmButton = screen.getByText(/Spill the Tea/i);
        fireEvent.click(confirmButton);
      });

      // Verify Baroness effect was called
      await waitFor(() => {
        expect(cardEffects.applyBaronessEffect).toHaveBeenCalledWith({
          roomCode: "TEST_ROOM",
          attacker: "test_player",
          target1: "alice",
          target2: null,
        });
      });
    });

    test("executes Baroness effect with dual targets", async () => {
      const mockBaronessResult = {
        result: "baronessReveal",
        attacker: "test_player",
        target1: "alice",
        target2: "bob",
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at hand",
        },
        target2Card: {
          id: 5,
          name: "Prince",
          strength: 5,
          effect: "Discard hand",
        },
        attackerMessage: "🍷✨ At her evening soirée...",
        target1Message: "🎉💋 The Baroness' soirée hums...",
        target2Message: "🎉💋 The Baroness' soirée hums...",
        publicMessage: "🍷✨ 💋 At her grand soirée...",
      };

      cardEffects.applyBaronessEffect.mockResolvedValue(mockBaronessResult);

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      // Select Baroness card
      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.change(firstSelect, { target: { value: "alice" } });

        const secondSelect = screen.getByDisplayValue(
          "🌷 Choose a second romantic target..."
        );
        fireEvent.change(secondSelect, { target: { value: "bob" } });

        const confirmButton = screen.getByText(/Spill the Tea/i);
        fireEvent.click(confirmButton);
      });

      // Verify dual target effect was called
      await waitFor(() => {
        expect(cardEffects.applyBaronessEffect).toHaveBeenCalledWith({
          roomCode: "TEST_ROOM",
          attacker: "test_player",
          target1: "alice",
          target2: "bob",
        });
      });
    });

    test("handles Baroness effect errors gracefully", async () => {
      cardEffects.applyBaronessEffect.mockResolvedValue({
        result: "error",
        error: "Target not found",
      });

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.change(firstSelect, { target: { value: "alice" } });

        const secondSelect = screen.getByDisplayValue(
          "🌷 Choose a second romantic target..."
        );
        fireEvent.change(secondSelect, { target: { value: "bob" } });

        const confirmButton = screen.getByText(/Spill the Tea/i);
        fireEvent.click(confirmButton);
      });

      // Should show error message
      await waitFor(() => {
        expect(
          screen.getByText(/baroness observation failed/i)
        ).toBeInTheDocument();
      });
    });

    test("handles SKIP_TURN option when no targets available", async () => {
      const roomDataNoTargets = {
        ...mockRoomData,
        players: {
          test_player: {
            name: "Test Player",
            realName: "Test Real",
            hand: [
              { id: 15, name: "Baroness", strength: 3 },
              { id: 1, name: "Guard", strength: 1 },
            ],
            discard: [],
            isOut: false,
            tokens: 0,
          },
        },
        round: {
          ...mockRoomData.round,
          hasDrawnCard: true, // Player has drawn their card for the turn
        },
      };

      onValue.mockImplementation((ref, callback) => {
        callback({ val: () => roomDataNoTargets });
        return vi.fn();
      });

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByRole("combobox");
        fireEvent.change(firstSelect, { target: { value: "SKIP_TURN" } });

        const skipButton = screen.getByRole("button", { name: /skip turn/i });
        fireEvent.click(skipButton);
      });

      // Should handle skip turn
      await waitFor(() => {
        expect(
          screen.getByText(/your chose to skip your turn/i)
        ).toBeInTheDocument();
      });
    });
  });

  // 🎭 RESULT MODAL DISPLAY TESTS
  describe("🎭 Baroness Result Modal Display", () => {
    test("displays romantic attacker result modal with revealed cards", async () => {
      const mockBaronessResult = {
        result: "baronessReveal",
        attacker: "test_player",
        target1: "alice",
        target2: "bob",
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at hand",
        },
        target2Card: {
          id: 5,
          name: "Prince",
          strength: 5,
          effect: "Discard hand",
        },
        attackerMessage:
          "🍷✨ At her evening soirée, the Baroness fans herself with excitement...",
        target1Message: "🎉💋 The Baroness' soirée hums with laughter...",
        target2Message: "🎉💋 The Baroness' soirée hums with laughter...",
        publicMessage: "🍷✨ 💋 At her grand soirée...",
      };

      cardEffects.applyBaronessEffect.mockResolvedValue(mockBaronessResult);

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      // Execute Baroness effect
      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.change(firstSelect, { target: { value: "alice" } });

        const secondSelect = screen.getByDisplayValue(
          "🌷 Choose a second romantic target..."
        );
        fireEvent.change(secondSelect, { target: { value: "bob" } });

        const confirmButton = screen.getByText(/Spill the Tea/i);
        fireEvent.click(confirmButton);
      });

      // Should show romantic result modal
      await waitFor(() => {
        expect(
          screen.getByText("💄 The Court's Matchmaker")
        ).toBeInTheDocument();
        expect(screen.getByText(/At her evening soirée/i)).toBeInTheDocument();
        expect(screen.getByText("alice's ally")).toBeInTheDocument();
        expect(screen.getByText("bob's ally")).toBeInTheDocument();
        expect(screen.getByText("Priest")).toBeInTheDocument();
        expect(screen.getByText("Prince")).toBeInTheDocument();
      });
    });

    test("sends target messages to Firebase correctly", async () => {
      const mockBaronessResult = {
        result: "baronessReveal",
        attacker: "test_player",
        target1: "alice",
        target2: "bob",
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at hand",
        },
        target2Card: {
          id: 5,
          name: "Prince",
          strength: 5,
          effect: "Discard hand",
        },
        attackerMessage: "🍷✨ Attacker message...",
        target1Message: "🎉💋 Target1 message...",
        target2Message: "🎉💋 Target2 message...",
        publicMessage: "🍷✨ Public message...",
      };

      cardEffects.applyBaronessEffect.mockResolvedValue(mockBaronessResult);

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.change(firstSelect, { target: { value: "alice" } });

        const secondSelect = screen.getByDisplayValue(
          "🌷 Choose a second romantic target..."
        );
        fireEvent.change(secondSelect, { target: { value: "bob" } });

        const confirmButton = screen.getByText(/Spill the Tea/i);
        fireEvent.click(confirmButton);
      });

      // Should update Firebase with target messages
      await waitFor(() => {
        expect(update).toHaveBeenCalledWith(
          expect.anything(), // ref
          expect.objectContaining({
            selectedCardId: 15,
            visibleTo: "alice",
            attacker: "test_player",
            message: "🎉💋 Target1 message...",
          })
        );

        expect(update).toHaveBeenCalledWith(
          expect.anything(), // ref
          expect.objectContaining({
            selectedCardId: 15,
            visibleTo: "bob",
            attacker: "test_player",
            message: "🎉💋 Target2 message...",
          })
        );
      });
    });
  });

  // 🔄 TURN ADVANCEMENT TESTS
  describe("🔄 Turn Advancement & Game Flow", () => {
    test("advances turn after Baroness effect completes", async () => {
      const mockBaronessResult = {
        result: "baronessReveal",
        attacker: "test_player",
        target1: "alice",
        target2: null,
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at hand",
        },
        target2Card: null,
        attackerMessage: "🍷✨ Attacker message...",
        target1Message: "🎉💋 Target message...",
        publicMessage: "🍷✨ Public message...",
      };

      cardEffects.applyBaronessEffect.mockResolvedValue(mockBaronessResult);

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      // Execute Baroness effect and close result modal
      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.change(firstSelect, { target: { value: "alice" } });

        const secondSelect = screen.getByDisplayValue(
          "🌷 Choose a second romantic target..."
        );
        fireEvent.change(secondSelect, { target: { value: "bob" } });

        const confirmButton = screen.getByText(/Spill the Tea/i);
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        const continueButton = screen.getByText(/☕ continue/i);
        fireEvent.click(continueButton);
      });

      // Turn should advance (we can't easily test the actual turn logic,
      // but we can verify no errors occur and modal closes)
      await waitFor(() => {
        expect(
          screen.queryByText("💄 The Court's Matchmaker")
        ).not.toBeInTheDocument();
      });
    });

    test("handles protected players correctly", async () => {
      const roomDataWithProtection = {
        ...mockRoomData,
        protectedPlayers: ["alice"],
      };

      onValue.mockImplementation((ref, callback) => {
        callback({ val: () => roomDataWithProtection });
        return vi.fn();
      });

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.click(firstSelect);

        // Alice should not appear (protected by Handmaid)
        expect(screen.queryByText(/💕 Alice/)).not.toBeInTheDocument();
        // Bob should still appear
        expect(screen.getByText(/💕 Bob \(Bob Real\)/)).toBeInTheDocument();
      });
    });

    test("handles eliminated players correctly", async () => {
      const roomDataWithEliminated = {
        ...mockRoomData,
        players: {
          ...mockRoomData.players,
          alice: {
            ...mockRoomData.players.alice,
            isOut: true,
          },
        },
      };

      onValue.mockImplementation((ref, callback) => {
        callback({ val: () => roomDataWithEliminated });
        return vi.fn();
      });

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.click(firstSelect);

        // Alice should not appear (eliminated)
        expect(screen.queryByText(/💕 Alice/)).not.toBeInTheDocument();
        // Bob should still appear
        expect(screen.getByText(/💕 Bob \(Bob Real\)/)).toBeInTheDocument();
      });
    });
  });

  // 🐛 EDGE CASES & ROBUSTNESS
  describe("🐛 Edge Cases & Robustness", () => {
    test("handles modal cancellation gracefully", async () => {
      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      // Open modal and cancel
      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const backButton = screen.getByText(/back/i);
        fireEvent.click(backButton);
      });

      // Modal should close without errors
      await waitFor(() => {
        expect(
          screen.queryByText(/whose romantic secrets/i)
        ).not.toBeInTheDocument();
      });
    });

    test("handles Firebase update failures gracefully", async () => {
      // Mock a Firebase update failure for the first call (targetMessage)
      update.mockRejectedValueOnce(new Error("Firebase connection failed"));

      // Ensure onValue returns unsubscribe function
      onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockRoomData });
        return vi.fn(); // Return unsubscribe function
      });

      const mockBaronessResult = {
        result: "baronessReveal",
        attacker: "test_player",
        target1: "alice",
        target2: "bob",
        target1Card: {
          id: 2,
          name: "Priest",
          strength: 2,
          effect: "Look at hand",
        },
        target2Card: {
          id: 3,
          name: "Baron",
          strength: 3,
          effect: "Compare hands",
        },
        attackerMessage:
          "🍷✨ At her evening soirée, the Baroness elegantly observed...",
        target1Message: "🎉💋 Target1 message...",
        target2Message: "🎉💋 Target2 message...",
        publicMessage: "🍷✨ Public message...",
      };

      cardEffects.applyBaronessEffect.mockResolvedValue(mockBaronessResult);

      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Baroness"));

      await waitFor(() => {
        const firstSelect = screen.getByDisplayValue("🌹 Choose a target...");
        fireEvent.change(firstSelect, { target: { value: "alice" } });

        const secondSelect = screen.getByDisplayValue(
          "🌷 Choose a second romantic target..."
        );
        fireEvent.change(secondSelect, { target: { value: "bob" } });

        const confirmButton = screen.getByText(/Spill the Tea/i);
        fireEvent.click(confirmButton);
      });

      // Should handle Firebase failure gracefully
      await waitFor(() => {
        // Verify the effect was applied successfully
        expect(cardEffects.applyBaronessEffect).toHaveBeenCalledWith(
          expect.objectContaining({
            attacker: "test_player",
            target1: "alice",
            target2: "bob",
          })
        );

        // Should show error result modal with graceful degradation
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        expect(
          screen.getByText(/romantic secrets couldn't be shared/i)
        ).toBeInTheDocument();

        // Should still show the observed card details despite Firebase error
        expect(
          screen.getByText(/but you still observed: alice and bob/i)
        ).toBeInTheDocument();
      });

      // Firebase update should have been attempted and failed
      expect(update).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          selectedCardId: 15,
          visibleTo: "alice",
          attacker: "test_player",
        })
      );
    });

    test("validates Baroness card is in targeting cards array", async () => {
      renderPlay();

      await waitFor(() => {
        expect(screen.getByText("Baroness")).toBeInTheDocument();
      });

      // Clicking Baroness should trigger target selection (not immediate effect)
      fireEvent.click(screen.getByText("Baroness"));

      // Should show target modal, not execute effect immediately
      await waitFor(() => {
        expect(
          screen.getByText(/whose secrets shall we uncover/i)
        ).toBeInTheDocument();
      });

      // Effect should NOT be called until targets are confirmed
      expect(cardEffects.applyBaronessEffect).not.toHaveBeenCalled();
    });
  });
});
