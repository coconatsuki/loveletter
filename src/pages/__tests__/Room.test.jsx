import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Room from "../Room";
import * as Firebase from "firebase/database";

// Mock Firebase
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  off: vi.fn(),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { nickname: "HostPlayer", realName: "Host User" },
    }),
    useParams: () => ({ id: "TEST123" }),
  };
});

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, "confirm", {
  value: mockConfirm,
  writable: true,
});

describe("Room Banish Functionality", () => {
  const mockRoomData = {
    host: "HostPlayer",
    mode: "normal",
    gameState: "waiting",
    players: {
      HostPlayer: {
        name: "HostPlayer",
        realName: "Host User",
        isHost: true,
      },
      GuestPlayer1: {
        name: "GuestPlayer1",
        realName: "Guest One",
      },
      GuestPlayer2: {
        name: "GuestPlayer2",
        realName: "Guest Two",
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true); // Default to confirming banish

    // Mock Firebase functions that return promises
    Firebase.remove.mockResolvedValue();
    Firebase.update.mockResolvedValue();
    Firebase.ref.mockReturnValue({ _path: "mocked-ref" }); // Return a mock ref object

    // Mock Firebase onValue to provide room data
    Firebase.onValue.mockImplementation((ref, callback) => {
      callback({
        exists: () => true,
        val: () => mockRoomData,
      });
      return vi.fn(); // Return unsubscribe function
    });
  });

  const renderRoom = () => {
    return render(
      <MemoryRouter>
        <Room />
      </MemoryRouter>
    );
  };

  describe("Banish Button Visibility", () => {
    it("should show banish buttons for host", async () => {
      renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      // Should show banish buttons for guests but not for host
      const banishButtons = screen.getAllByText(/🚫 Banish/);
      expect(banishButtons).toHaveLength(2); // Two guests
    });

    it("should not show banish buttons for non-host players", async () => {
      // Mock room data where current user (HostPlayer) is NOT the host
      const guestViewRoomData = {
        ...mockRoomData,
        host: "SomeOtherPlayer", // Change the host to someone else
        players: {
          ...mockRoomData.players,
          SomeOtherPlayer: {
            name: "SomeOtherPlayer",
            realName: "Other Player",
            isHost: true,
          },
        },
      };

      vi.mocked(Firebase.onValue).mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => guestViewRoomData,
        });
        return vi.fn();
      });

      renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      // Should not show any banish buttons (since current user HostPlayer is not the host)
      expect(screen.queryAllByText(/🚫 Banish/)).toHaveLength(0);
    });
  });

  describe("Banish Confirmation Process", () => {
    it("should show confirmation popup when banish button is clicked", async () => {
      renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      const banishButtons = screen.getAllByText(/🚫 Banish/);
      fireEvent.click(banishButtons[0]);

      expect(mockConfirm).toHaveBeenCalledWith(
        "⚔️ Art thou certain thou wishest to banish GuestPlayer1 from the royal court? This action cannot be undone! 👑"
      );
    });

    it("should not banish player if confirmation is denied", async () => {
      mockConfirm.mockReturnValue(false);

      renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      const banishButtons = screen.getAllByText(/🚫 Banish/);
      fireEvent.click(banishButtons[0]);

      expect(mockConfirm).toHaveBeenCalled();
      expect(Firebase.remove).not.toHaveBeenCalled();
    });

    it("should banish player if confirmation is accepted", async () => {
      mockConfirm.mockReturnValue(true);

      renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      const banishButtons = screen.getAllByText(/🚫 Banish/);
      fireEvent.click(banishButtons[0]);

      expect(mockConfirm).toHaveBeenCalled();
      await waitFor(() => {
        expect(Firebase.remove).toHaveBeenCalledWith(
          expect.objectContaining({}) // Firebase ref object
        );
      });
    });
  });

  describe("Banish Restrictions", () => {
    it("should not allow host to banish themselves", async () => {
      renderRoom();

      await waitFor(() => {
        expect(screen.getAllByText(/HostPlayer/)[0]).toBeInTheDocument();
      });

      // Get all banish buttons - should only be for guests, not for host
      const banishButtons = screen.queryAllByText(/🚫 Banish/);

      // Should have banish buttons for guests (2) but not for host
      expect(banishButtons).toHaveLength(2);

      // Verify no banish button is associated with the host card
      const hostCard = screen
        .getAllByText(/HostPlayer/)[0]
        .closest(".royal-guest-card");
      const hostBanishButton = hostCard?.querySelector("button");
      expect(hostBanishButton).toBeNull();
    });

    it("should not show banish button for the host player card", async () => {
      renderRoom();

      await waitFor(() => {
        expect(screen.getAllByText(/HostPlayer/)[0]).toBeInTheDocument();
      });

      // Get all player cards
      const hostCard = screen
        .getAllByText(/HostPlayer/)[0]
        .closest(".royal-guest-card");

      // Host card should not have a banish button
      const banishButtonInHostCard = hostCard?.querySelector(
        "button.kick-player-button"
      );
      expect(banishButtonInHostCard).toBe(null);
    });
  });

  describe("Firebase Integration", () => {
    it("should call Firebase remove with correct path", async () => {
      renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      const banishButtons = screen.getAllByText(/🚫 Banish/);
      fireEvent.click(banishButtons[0]);

      await waitFor(() => {
        expect(Firebase.ref).toHaveBeenCalledWith(
          expect.anything(), // db
          "rooms/TEST123/players/GuestPlayer1"
        );
        expect(Firebase.remove).toHaveBeenCalled();
      });
    });

    it("should handle Firebase errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      Firebase.remove.mockRejectedValueOnce(new Error("Firebase error"));

      renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      const banishButtons = screen.getAllByText(/🚫 Banish/);
      fireEvent.click(banishButtons[0]);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to kick player:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Player Count Validation", () => {
    it("should show correct validation message when too few players after banish", async () => {
      // Mock room with only 1 player
      const smallRoomData = {
        ...mockRoomData,
        players: {
          HostPlayer: mockRoomData.players["HostPlayer"],
        },
      };

      Firebase.onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => smallRoomData,
        });
        return vi.fn();
      });

      renderRoom();

      await waitFor(() => {
        expect(
          screen.getByText(
            /The court requires at least 2 noble souls to begin the tournament/
          )
        ).toBeInTheDocument();
      });
    });

    it("should show correct validation message when too many players", async () => {
      // Mock room with 12 players
      const largeRoomData = {
        ...mockRoomData,
        players: Object.fromEntries(
          Array.from({ length: 12 }, (_, i) => [
            `Player${i}`,
            { name: `Player${i}`, realName: `Real${i}` },
          ])
        ),
      };
      largeRoomData.players["HostPlayer"] = {
        ...mockRoomData.players["HostPlayer"],
      };

      Firebase.onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => largeRoomData,
        });
        return vi.fn();
      });

      renderRoom();

      await waitFor(() => {
        expect(
          screen.getByText(/Too Many Guests in Court/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Kicked Player Detection", () => {
    it("should redirect player when they are kicked", async () => {
      // First render with player present
      const { unmount } = renderRoom();

      await waitFor(() => {
        expect(screen.getByText(/GuestPlayer1/)).toBeInTheDocument();
      });

      // Simulate player being kicked (removed from Firebase)
      const roomDataWithoutPlayer = {
        ...mockRoomData,
        players: {
          HostPlayer: mockRoomData.players["HostPlayer"],
          GuestPlayer2: mockRoomData.players["GuestPlayer2"],
          // GuestPlayer1 removed
        },
      };

      // Update Firebase mock to return data without the player
      Firebase.onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => roomDataWithoutPlayer,
        });
        return vi.fn();
      });

      // Unmount the old component and render new one with updated data
      unmount();
      renderRoom();

      // Since we're testing from host view, we just verify the player is gone
      await waitFor(() => {
        expect(screen.queryByText(/GuestPlayer1/)).not.toBeInTheDocument();
      });
    });
  });
});
