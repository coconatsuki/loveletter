/**
 * 🃏 JESTER CARD TESTING SCRIPT 🃏
 * Quick test to verify Jester card logic implementation
 */

import { applyJesterEffect } from "./src/utils/cardEffects.js";

// Mock Firebase functions for testing
const mockFirebase = {
  data: {
    rooms: {
      TEST123: {
        players: {
          alice: {
            name: "Alice",
            realName: "Alice Cooper",
            hand: [{ id: 5, name: "Prince" }],
          },
          bob: {
            name: "Bob",
            realName: "Bob Dylan",
            hand: [{ id: 2, name: "Priest" }],
          },
        },
      },
    },
  },
};

// Mock Firebase get function
global.get = async (ref) => ({
  val: () => mockFirebase.data.rooms["TEST123"],
});

// Mock Firebase update function
global.update = async (ref, updates) => {
  console.log("🔄 Firebase update called with:", updates);
  // Simulate the jester token being set
  if (updates["players/bob/jesterToken"]) {
    mockFirebase.data.rooms["TEST123"].players.bob.jesterToken =
      updates["players/bob/jesterToken"];
    console.log("✅ Jester token set:", updates["players/bob/jesterToken"]);
  }
  return Promise.resolve();
};

// Test the Jester effect
async function testJesterEffect() {
  console.log("🎭 TESTING JESTER CARD EFFECT 🎭\n");

  try {
    const result = await applyJesterEffect({
      roomCode: "TEST123",
      attacker: "alice",
      target: "bob",
    });

    console.log("📋 JESTER EFFECT RESULT:");
    console.log("Result type:", result.result);
    console.log("Attacker:", result.attacker);
    console.log("Target:", result.target);
    console.log("Attacker message:", result.attackerMessage);
    console.log("Target message:", result.targetMessage);
    console.log("Public message:", result.publicMessage);

    // Verify the token was set
    const bobData = mockFirebase.data.rooms["TEST123"].players.bob;
    if (bobData.jesterToken && bobData.jesterToken.giver === "alice") {
      console.log("✅ Jester token correctly assigned to Bob from Alice!");
    } else {
      console.log("❌ Jester token was not assigned correctly!");
    }

    console.log("\n🎉 JESTER TEST COMPLETED!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testJesterEffect();
