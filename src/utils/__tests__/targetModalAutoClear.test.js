import { describe, it, expect, beforeEach, vi } from "vitest";

describe("🎯 Target Modal Auto-Clear Logic", () => {
  let mockSetTargetMessageModalData;
  let mockSetRoomData;
  let mockSetPlayer;
  let mockSet;
  let mockRef;
  let roomDataListener;

  // Mock the Play component's useEffect logic
  const simulateRoomDataListener = (
    initialRoomData,
    nickname,
    targetMessageModalData,
    resultModalData
  ) => {
    // This simulates the useEffect in Play.jsx that listens to room data changes
    return (newRoomData) => {
      // Simulate setRoomData
      mockSetRoomData(newRoomData);

      // Simulate player update
      if (newRoomData?.players && nickname) {
        mockSetPlayer(newRoomData.players[nickname]);
      }

      // Auto-clear info-only result modals when it's no longer this player's turn
      if (
        newRoomData?.round?.currentPlayer !== nickname &&
        resultModalData?.isInfoOnly
      ) {
        mockSetTargetMessageModalData(null);
      }

      // Auto-clear target message modals when it becomes this player's turn
      if (
        newRoomData?.round?.currentPlayer === nickname &&
        targetMessageModalData
      ) {
        console.log(
          "🎯 AUTO-CLEAR: Clearing target message modal - it's now this player's turn"
        );
        mockSetTargetMessageModalData(null);
        // Also clear from Firebase
        mockSet(mockRef("rooms/TEST123/targetMessage"), null);
      }
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock React state setters
    mockSetTargetMessageModalData = vi.fn();
    mockSetRoomData = vi.fn();
    mockSetPlayer = vi.fn();

    // Mock Firebase functions
    mockSet = vi.fn().mockResolvedValue();
    mockRef = vi.fn().mockReturnValue("mock-ref");

    // Global mocks for Firebase (if needed by the test environment)
    global.set = mockSet;
    global.ref = mockRef;
  });

  it("should auto-clear target modal when player's turn starts", () => {
    const nickname = "alice";
    const initialTargetMessageModalData = {
      cardName: "Phantom King",
      from: "bob",
      message: "You've been targeted!",
      visibleTo: "alice",
    };

    // Create the room data listener simulation
    const handleRoomDataChange = simulateRoomDataListener(
      null, // initial room data
      nickname,
      initialTargetMessageModalData, // player has a target modal open
      null // no result modal
    );

    // Simulate room data change where it becomes alice's turn
    const newRoomData = {
      round: {
        currentPlayer: "alice", // It's now alice's turn
        deck: [],
      },
      players: {
        alice: {
          name: "alice",
          hand: [{ id: 1, name: "Guard" }],
          isOut: false,
        },
        bob: {
          name: "bob",
          hand: [{ id: 2, name: "Priest" }],
          isOut: false,
        },
      },
    };

    // Trigger the room data change
    handleRoomDataChange(newRoomData);

    // Verify the target modal was cleared
    expect(mockSetTargetMessageModalData).toHaveBeenCalledWith(null);

    // Verify Firebase was updated to clear the target message
    expect(mockSet).toHaveBeenCalledWith("mock-ref", null);
    expect(mockRef).toHaveBeenCalledWith("rooms/TEST123/targetMessage");
  });

  it("should NOT clear target modal when it's NOT the player's turn", () => {
    const nickname = "alice";
    const targetMessageModalData = {
      cardName: "Phantom King",
      from: "bob",
      message: "You've been targeted!",
      visibleTo: "alice",
    };

    const handleRoomDataChange = simulateRoomDataListener(
      null,
      nickname,
      targetMessageModalData,
      null
    );

    // Simulate room data change where it's someone else's turn
    const newRoomData = {
      round: {
        currentPlayer: "bob", // It's bob's turn, not alice's
        deck: [],
      },
      players: {
        alice: { name: "alice", hand: [], isOut: false },
        bob: { name: "bob", hand: [], isOut: false },
      },
    };

    handleRoomDataChange(newRoomData);

    // Verify the target modal was NOT cleared
    expect(mockSetTargetMessageModalData).not.toHaveBeenCalledWith(null);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("should NOT clear target modal when player has no modal open", () => {
    const nickname = "alice";
    const targetMessageModalData = null; // No modal open

    const handleRoomDataChange = simulateRoomDataListener(
      null,
      nickname,
      targetMessageModalData,
      null
    );

    // Simulate room data change where it becomes alice's turn
    const newRoomData = {
      round: {
        currentPlayer: "alice", // It's alice's turn
        deck: [],
      },
      players: {
        alice: { name: "alice", hand: [], isOut: false },
        bob: { name: "bob", hand: [], isOut: false },
      },
    };

    handleRoomDataChange(newRoomData);

    // Verify no clearing occurred since there was no modal
    expect(mockSetTargetMessageModalData).not.toHaveBeenCalledWith(null);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("should handle the complete Phantom King workflow with auto-clear", () => {
    const attacker = "alice";
    const target = "bob";

    // Phase 1: Bob has a target modal from Phantom King
    let targetModalData = {
      cardName: "Phantom King",
      from: attacker,
      message: "The Phantom King has exchanged your fates!",
      visibleTo: target,
    };

    const handleRoomDataChange = simulateRoomDataListener(
      null,
      target, // We're testing bob's perspective
      targetModalData,
      null
    );

    // Phase 2: Turn advances to someone else (alice completes their turn)
    let roomData = {
      round: {
        currentPlayer: "charlie", // Some other player's turn
        deck: [],
      },
      players: {
        alice: { name: "alice", hand: [], isOut: false },
        bob: { name: "bob", hand: [{ id: 3, name: "Baron" }], isOut: false },
        charlie: { name: "charlie", hand: [], isOut: false },
      },
    };

    handleRoomDataChange(roomData);

    // Modal should still be there since it's not bob's turn
    expect(mockSetTargetMessageModalData).not.toHaveBeenCalledWith(null);

    // Phase 3: Turn advances to bob (target)
    roomData = {
      round: {
        currentPlayer: target, // Now it's bob's turn
        deck: [],
      },
      players: {
        alice: { name: "alice", hand: [], isOut: false },
        bob: { name: "bob", hand: [{ id: 3, name: "Baron" }], isOut: false },
        charlie: { name: "charlie", hand: [], isOut: false },
      },
    };

    handleRoomDataChange(roomData);

    // Now the modal should be auto-cleared
    expect(mockSetTargetMessageModalData).toHaveBeenCalledWith(null);
    expect(mockSet).toHaveBeenCalledWith("mock-ref", null);
  });

  it("should clear multiple target modals correctly across different players", () => {
    // Test that the logic works correctly for different players
    const scenarios = [
      { nickname: "alice", shouldClear: true },
      { nickname: "bob", shouldClear: false },
      { nickname: "charlie", shouldClear: false },
    ];

    scenarios.forEach(({ nickname, shouldClear }) => {
      // Reset mocks for each scenario
      mockSetTargetMessageModalData.mockClear();
      mockSet.mockClear();

      const targetModalData = {
        cardName: "Prince",
        from: "someone",
        message: "You've been targeted!",
        visibleTo: nickname,
      };

      const handleRoomDataChange = simulateRoomDataListener(
        null,
        nickname,
        targetModalData,
        null
      );

      // Alice's turn starts
      const roomData = {
        round: {
          currentPlayer: "alice",
          deck: [],
        },
        players: {
          alice: { name: "alice", hand: [], isOut: false },
          bob: { name: "bob", hand: [], isOut: false },
          charlie: { name: "charlie", hand: [], isOut: false },
        },
      };

      handleRoomDataChange(roomData);

      if (shouldClear) {
        expect(mockSetTargetMessageModalData).toHaveBeenCalledWith(null);
        expect(mockSet).toHaveBeenCalled();
      } else {
        expect(mockSetTargetMessageModalData).not.toHaveBeenCalledWith(null);
        expect(mockSet).not.toHaveBeenCalled();
      }
    });
  });
});
