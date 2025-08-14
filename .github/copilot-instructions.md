# Love Letter Online - AI Coding Agent Instructions

## General context & overview

Public: a group of (fun & geeky) colleagues composed of developers, analyst, product owner & people lead & scrum master.

Context: the "Friday fun" weekly meetings: 30 minutes meetings that we organize each Friday morning to play together and bond as a cross-country & cross-nationality & remote team.

Style/Tone: The global style should be light-hearted and fun, reflecting the playful nature of the game, and have a medieval-geek-humoristic tone (especially for notifications & prompts).

## Architecture Overview

This is a real-time multiplayer Love Letter card game built with React + Vite and Firebase Realtime Database. The game supports both normal and premium modes with different card sets.

### Core Data Flow

- **Firebase**: All game state lives in Firebase Realtime Database at `rooms/{roomCode}`
- **Real-time sync**: Components use Firebase `onValue()` listeners for live updates
- **State structure**: `rooms/{id}/players/{nickname}`, `rooms/{id}/round`, `rooms/{id}/notifications`
- **No authentication**: Players join with nickname only

### Key Components & Routing

- **Landing** (`/`) → **Room** (`/room/:id`) → **Play** (`/play/:id`)
- A new room is created using the route (`/create`) that is only accessible to the game admin.
- Navigation uses React Router with `state` to pass nickname/realName between routes
- Game flow: Landing form → Room lobby → Play game → back to Room for next round

## Critical Patterns

### Card System

- Cards defined in `src/utils/cardsData.js` with `id`, `strength`, `countNormal`, `countPremium`
- Card effects in `src/utils/cardEffects.js` - each returns promises with specific result objects
- Two game modes: "normal" (base cards) for 2 to 5 players, and "premium" (extended set) for 5 to 9 players.
- Deck building in `src/utils/deckBuilder.js` filters by mode

### Firebase Integration

- **Room structure**: `players`, `host`, `gameState`, `round`, `mode`, `notifications`, `actionResult`
- **Player object**: `{name, realName, hand: [], discard: [], isOut: boolean, tokens: number}`
- **Round object**: `{deck: [], currentPlayer, actionResult, guardPrompt}`
- Use `ref(db, path)` + `onValue()` for subscriptions, `update()` for mutations

### Game Logic Patterns

- **Turn-based**: `currentPlayer` field determines whose turn
- **Card effects**: Async functions that read current state, apply effects, return result objects
- **Modal system**: `TargetModal`, `EffectResultModal`, `AssassinPromptModal` handle player interactions
- **Notifications**: Real-time feed using `src/utils/pushNotification.js`

### State Management

- React useState for local UI state, Firebase for shared game state
- Heavy use of `useEffect` with Firebase listeners
- No global state management - each component manages its Firebase subscriptions

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Component Conventions

- Functional components with hooks
- Firebase listeners in `useEffect` with cleanup
- Modal components receive `onConfirm`/`onCancel` callbacks
- File naming: PascalCase for components, camelCase for utilities

## Key Files to Understand

- `src/utils/cardEffects.js` - Core game logic for all 17+ card types
- `src/pages/Play.jsx` - Main game interface with 400+ lines of game state management
- `src/utils/cardsData.js` - Card definitions (normal vs premium modes)
- `src/utils/firebase.js` - Database configuration and export

When modifying game logic, always test with multiple players in different browser tabs to verify real-time sync works correctly.

## Gameplay (rules)

- Love Letter is played in a series of rounds.
- At the start of each round, one card is discarded face-down(so the process of elimination cannot be used to prove which cards are left for the round, as this adds some randomness)
- One card is then dealt to each player and the rest become the draw deck.
- During each player's turn, one card is first drawn from the deck, and the player gets to play either that card or the card already in their hand.
- After processing the effect described on the played card, the next player gets a turn.
- This process is repeated until either the deck runs out (in which case the player holding the highest-value card wins the round) or all players but one are eliminated, in which case the last player still in play wins the round.
- Once a round ends, the winner of the round receives a "love token" (an equivalent of a victory point)
- We display a "round scoring screen" displaying how many "love token" each player has, and who won the last round. From that screen, it should also be possible to kick out some players out (if they don't want or have time to play an other round).
- From that same screen, it should also be possible to end the game right away (with a "end game now" button)
- After clicking on the "play an other round" button from that "round scoring screen", all cards are collected and shuffled, and play continues with a new round, with the winner of the previous round taking the first turn (or player with the most love token if the previous round winner left the game).
- The game ends when the admin clicks on "end game now" button on the "round scoring
- We then display the "final scoring board" with the winner being the one having accumulated the highest number of love token (and will marry the princess & become king)

## Cards workflows

### The GUARD's card workflow (id: 1 / strength: 1)

NORMAL MODE (for 2-5 players)

- The attacker picks the Guard (& select a target & guess a card strength)
- The system checks if the guess is correct (if the target's hand is holding a card having the guessed strength)
- We DON'T NEED ANY "Assassin" PROMPT on the TARGET'S SIDE (on normal mode) because we Don't have any assassin card on normal mode.
- If the Guess is correct, we:
  - Display a "you've been eliminated" kind of message for the target (and we kick him out of the game -- they can still Watch but we skip his turn.
  - Display a notif explaining what happened to everyone, in the notifications feed
  - Display the result to the Attacker (you guessed correctly! kind of message)
- If the Guess is wrong, we do more or less the same with different messages, and without eliminating the target (we just tell him what the guessed strength was and that it failed)

PREMIUM MODE (for 6-9 players)

- The attacker picks the Guard (& select a target & guess a card strength)
- The system checks if the guess is correct (if the target's hand is holding a card having the guessed strength) AND it also checks if the target is holding the assassin card.
- We ALWAYS display what is called the AssassinPromptModal (even if the naming is bad, imo) even if the target doesn't have the assassin. The Reason behind that logic is that if the attacker would know RIGHT AWAY if the target has an assassin or not, if we only display the AssassinPromptModal when the target has an assassin card. But a target, regardless of the guessed strength (if it's correct or not) can have an assassin & choose not to use it. So we want to keep that a secret and display that prompt in any case (and make the a button ttacker waits until the target clicks confirm -- or sometimes 'use assassin to strike back' if they have the assassin card)

The rest of the logic is similar to the normal mode, except if the target has the assassin card and actually decides to use it. In that case, we:

- notify the attacker in a result prompt that the target had the assassin and striked back, and got them eliminated
- We kick the attacker out of the game -- they can still Watch but we skip his turn.
- We notify everyone that the attacker has been eliminated, killed by the target's assassin.

### The Priest's card workflow (id: 2 / strength: 2)

NORMAL & PREMIM MODE

- The attacker picks the Priest card & select a target
- We notify the target that the card in their hand will be revealed to the attacker (no need of a button on the target's side prompt)
- We also send a notif on the Notification feed (but without revealing the target's card publicly)
- The system reveals the target's card to the attacker in a modal containing a "continue" button.
- When the attacker press "continue", we clear (remove) both modals (on the target & attacker's side) and we move on to next player;

## Summary of the cards count, strength and effects

### Normal mode (for 2~5 players)

Card ID → Card Name (Strength, Count) → Effect(s)

ID 1 → Guard (Strength: 1, Count: 5)
→ Choose another player and name a card (except Guard).
→ If that player holds the named card, they're eliminated from the round.

ID 2 → Priest (Strength: 2, Count: 2)
→ Privately look at another player's hand.

ID 3 → Baron (Strength: 3, Count: 2)
→ Choose another player. You both secretly compare hands.
→ The player with the lower-strength card is eliminated.

ID 4 → Handmaid (Strength: 4, Count: 2)
→ You are immune to all card effects until your next turn.

ID 5 → Prince (Strength: 5, Count: 2)
→ Choose any player (yourself included). They discard their hand and draw a new one.

ID 6 → King (Strength: 6, Count: 1)
→ Trade hands with another player.

ID 7 → Countess (Strength: 7, Count: 1)
→ Must be played immediately if held with either the King or the Prince.
→ Otherwise, does nothing when played.

ID 8 → Princess (Strength: 8, Count: 1)
→ If you play or discard this card for any reason, you're eliminated from the round.

### Premium mode (for 5~9 players)

ID 0 → Jester (Strength: 0, Count: 1)
→ Give another player the Jester token.
→ If that player wins the round, you also win an Affection Token.

ID 1 → Guard (Strength: 1, Count: 8)
→ Choose a player and name a strength (except 1).
→ If they hold a card with that strength, they're eliminated.

ID 2 → Priest (Strength: 2, Count: 2)
→ Privately look at another player's hand.

ID 3 → Baron (Strength: 3, Count: 2)
→ Privately compare hands with another player.
→ The one with the lower strength is eliminated.

ID 4 → Handmaid (Strength: 4, Count: 2)
→ You are immune to all card effects until your next turn.

ID 5 → Prince (Strength: 5, Count: 2)
→ Choose any player (yourself included).
→ They discard their hand and draw a new one.

ID 6 → King (Strength: 6, Count: 1)
→ Trade hands with another player.

ID 7 → Countess (Strength: 7, Count: 1)
→ If held with the King or Prince, this must be played immediately.
→ Otherwise, does nothing when played.

ID 8 → Princess (Strength: 8, Count: 1)
→ If you play or discard this card for any reason, you're eliminated.

ID 9 → Bishop (Strength: 9, Count: 1)
→ Choose a player and name a strength.
→ If correct: they discard and draw a new card, and you win an Affection Token (round continues).
→ At round end, this card beats all except the Princess.

ID 10 → Constable (Strength: 6, Count: 1)
→ If played or discarded and you get eliminated before round end,
→ You still win an Affection Token.

ID 11 → Dowager Queen (Strength: 7, Count: 1)
→ Privately compare hands with another player.
→ The player with the higher card is eliminated.

ID 12 → Sycophant (Strength: 4, Count: 2)
→ Choose a player.
→ That player becomes the forced target of the next effect-card.

ID 13 → Cardinal (Strength: 2, Count: 2)
→ Choose any two players (including yourself). They swap hands.
→ If you are one of them, you may look at your new hand.

ID 14 → Assassin (Strength: 0, Count: 1)
→ Does nothing when played.
→ If targeted by a Guard, you may reveal this to eliminate the attacker.
→ Then discard this card and draw a new one.

ID 15 → Baroness (Strength: 3, Count: 2)
→ Privately view up to two other players' hands.

ID 16 → Count (Strength: 5, Count: 2)
→ If played or discarded and you survive until the end of the round,
→ Add 1 to the strength of your hand card.
