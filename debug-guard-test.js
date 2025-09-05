// Quick debug test for Guard workflow
import { applyGuardEffect } from "./src/utils/cardEffects.js";

// Mock Firebase
const mockGet = async () => ({
  val: () => ({
    mode: "normal", // Normal mode
    players: {
      Luffyyyyyy: {
        hand: [{ id: 6, strength: 6, name: "Phantom King" }], // Target has Phantom King (strength 6)
      },
    },
  }),
});

// Mock Firebase database
global.db = {};
const { get } = await import("firebase/database");
get.mockImplementation(mockGet);

console.log("🛡️ Testing Guard workflow...");

// Test scenario: Lady Jsonette guesses strength 5, target has Phantom King (strength 6)
const result = await applyGuardEffect({
  roomCode: "TEST123",
  attacker: "Lady Jsonette",
  target: "Luffyyyyyy",
  guess: 5,
});

console.log("🎯 Guard Effect Result:", {
  requiresPrompt: result.requiresPrompt,
  hasAssassin: result.hasAssassin,
  isCorrectGuess: result.isCorrectGuess,
  result: result.result,
  targetCard: result.targetCard,
  guessedStrength: result.guessedStrength,
  actualStrength: result.actualStrength,
});

console.log("✅ Expected behavior:");
console.log(
  "- requiresPrompt should be TRUE (always show AssassinPromptModal)"
);
console.log("- hasAssassin should be FALSE (Phantom King is not Assassin)");
console.log("- isCorrectGuess should be FALSE (guessed 5, actual 6)");
console.log('- result should be "wrongGuess"');
console.log('- Target should see AssassinPromptModal with "Continue" button');
