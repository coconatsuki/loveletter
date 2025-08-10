# Love Letter Online - AI Coding Agent Instructions

## Architecture Overview

This is a real-time multiplayer Love Letter card game built with React + Vite and Firebase Realtime Database. The game supports both normal and premium modes with different card sets.

All the game rules are described in this Wikipedia page => https://en.wikipedia.org/wiki/Love_Letter_(card_game)

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
