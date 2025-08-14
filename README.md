# Love Letter Online - TODO List 📜⚔️

## 🏰 About The Project

A real-time multiplayer Love Letter card game built with React + Vite and Firebase Realtime Database. Features both normal mode (2-5 players) and premium mode (6-9 players) with medieval-themed notifications and comprehensive testing.

## ✅ Completed Cards

### 🛡️ Guard (ID: 1) - COMPLETE

- ✅ Target selection
- ✅ Guess strength validation (cannot guess 1)
- ✅ Correct/wrong guess handling
- ✅ Assassin interactions (premium mode)
- ✅ Unified UX across both modes
- ✅ 9 comprehensive tests covering all scenarios
- ✅ Medieval-themed notifications

### 🔮 Priest (ID: 2) - COMPLETE

- ✅ Target selection (no guess needed)
- ✅ Card revelation to attacker only
- ✅ Target notification modal (no buttons)
- ✅ Enhanced result modal with card effect descriptions
- ✅ Both normal and premium mode support
- ✅ 11 comprehensive tests covering all scenarios
- ✅ Epic medieval notifications with emojis

## 🚧 Cards To Implement

### ⚖️ Baron (ID: 3) - COMPLETE

- ✅ Target selection  
- ✅ Strength comparison logic with dual-player result display
- ✅ Modal showing both cards to both players
- ✅ Elimination handling (lower strength player eliminated)
- ✅ Tie handling (no elimination)  
- ✅ 10 comprehensive tests covering all scenarios
- ✅ Medieval-themed notifications with epic emojis

### 🛡️ Handmaid (ID: 4) - TODO

- 🔄 No target selection needed
- 🔄 Protection until next turn logic
- 🔄 Visual indication of protection status
- 🔄 Skip targeting protected players in other cards
- 🔄 Testing suite
- 🔄 Medieval notifications

### 👑 Prince (ID: 5) - TODO

- 🔄 Target selection (can target self)
- 🔄 Discard and draw logic (already exists in cardEffects.js)
- 🔄 Princess elimination check
- 🔄 Empty deck handling
- 🔄 Testing suite
- 🔄 Medieval notifications

### 🤴 King (ID: 6) - TODO

- 🔄 Target selection
- 🔄 Hand trading logic (already exists in cardEffects.js)
- 🔄 Both players see the trade result
- 🔄 Testing suite
- 🔄 Medieval notifications

### 👸 Countess (ID: 7) - TODO

- 🔄 Auto-play when holding King or Prince
- 🔄 Manual play option when safe
- 🔄 No effect when played
- 🔄 Testing suite
- 🔄 Medieval notifications

### 💎 Princess (ID: 8) - TODO

- 🔄 Cannot be played manually
- 🔄 Auto-elimination when discarded/played
- 🔄 Winning condition (highest strength)
- 🔄 Testing suite
- 🔄 Medieval notifications

## 🏅 Premium Mode Cards (TODO)

### 🎭 Jester (ID: 0)

- 🔄 Give Jester token to target
- 🔄 Shared victory condition

### ⛪ Bishop (ID: 9)

- 🔄 Guess and win token mechanic
- 🔄 Strength 9 at round end

### 🏛️ Constable (ID: 10)

- 🔄 Posthumous token award

### 👑 Dowager Queen (ID: 11)

- 🔄 Reverse Baron (higher strength eliminated)

### 🎪 Sycophant (ID: 12)

- 🔄 Force next effect targeting

### 🔄 Cardinal (ID: 13)

- 🔄 Two-player hand swap

### ⚔️ Assassin (ID: 14) - PARTIALLY COMPLETE

- ✅ Guard interaction (defensive reveal)
- 🔄 Manual play logic
- 🔄 Draw new card after reveal

### 👁️ Baroness (ID: 15)

- 🔄 View up to two hands

### 📊 Count (ID: 16)

- 🔄 +1 strength if survive round

## 🧪 Testing Strategy

- Maintain comprehensive test coverage for each card
- Test both normal and premium modes
- Cover edge cases (empty deck, elimination, handmade protection, etc.)
- Validate medieval notification content
- Ensure proper modal workflows

## 🎨 UI/UX Consistency

- Reuse existing modals where possible
- Maintain medieval theme and emoji usage
- Clear card effect descriptions
- Intuitive interaction patterns
- Proper error handling and feedback

## 🔄 Current Priority

**Handmaid Card Implementation** - Focus on protection mechanics and visual indicators

## Next steps

- At the start of each round, one card is randomly discarded (so the process of elimination cannot be used to prove which cards are left for the round) to add some randomness.

- Improve the UI with classic loveletters colors & styling
- Improve the UX
- Add validations on the game creation & joining process (at least 2 players, all must have a real name AND a nickname that have more than two characters long, etc)
- Create the Round scoring board and all the buttons & logic in it (kickout players, play an other round, end game, ...)
- Create the Game final result board & display the winner and congrats message & image.

## 📝 Notes

- Basic card effects already exist in `cardEffects.js`
- Modal system established with Guard/Priest/Baron
- Firebase real-time sync patterns proven
- Testing patterns established (35/35 tests passing)
- Medieval notification style guide established

---

_"In the realm of Love Letter, every card tells a story... ours is still being written!" 🏰✨_
