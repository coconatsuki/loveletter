// Hardcoded popover positioning logic based on player count and position
// This avoids complex dynamic calculations and prevents popovers from hiding behind the Chronicle sidebar

export const getPopoverPositioning = (totalPlayers) => {
  // Mapping of player count to array where index = player position (0-based), value = 'LEFT' or 'RIGHT'
  const positioningMap = {
    2: ["RIGHT", "LEFT"],
    3: ["RIGHT", "RIGHT", "LEFT"],
    4: ["RIGHT", "RIGHT", "LEFT", "RIGHT"],
    5: ["RIGHT", "RIGHT", "LEFT", "RIGHT", "LEFT"],
    6: ["RIGHT", "RIGHT", "LEFT", "RIGHT", "RIGHT", "LEFT"],
    7: ["RIGHT", "RIGHT", "LEFT", "RIGHT", "RIGHT", "LEFT", "RIGHT"],
    8: ["RIGHT", "RIGHT", "LEFT", "RIGHT", "RIGHT", "LEFT", "RIGHT", "LEFT"],
    9: [
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
      "RIGHT",
      "LEFT",
    ],
    10: [
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
    ],
    11: [
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
      "RIGHT",
      "LEFT",
      "RIGHT",
      "LEFT",
    ],
  };

  return positioningMap[totalPlayers] || [];
};

/**
 * Determines if a popover should show on the left side for a specific player position
 * @param {number} playerIndex - 0-based index of the player in the players array
 * @param {number} totalPlayers - Total number of players in the current round
 * @returns {boolean} - true if popover should show on left, false for right
 */
export const shouldShowPopoverOnLeft = (playerIndex, totalPlayers) => {
  const positioning = getPopoverPositioning(totalPlayers);
  return positioning[playerIndex] === "LEFT";
};
