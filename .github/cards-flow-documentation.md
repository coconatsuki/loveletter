# CARDS FLOW DOCUMENTATION

## How do each card check for roundEnd conditions and when?

### 0 - JESTER

### 1 - GUARD

## **AssassinPromptModal / onAcknowledge ()** =>

if correctGuess:

- call handlePlayerElimination() & update fireBase (eliminationUpdates)

- pushNotification(public message)

---

if !correctGuess: /

- pushNotification(public message)

---

in any case (onAcknowledge):

- /actionResult with AssassinPromptModal attackerMessage

- completeGuardTurn

---

**AssassinPromptModal / onReveal** =>

- resolveAssassinDefense (cardEffects.js) =>

  - call handleCardDiscard() => Guard-Target discard assassin & draw a newCard (if deckNotEmpty)

  * round/pendingAssassinationTarget: attacker

    - update firebase

- /actionResult with AssassinPromptModal attackerMessage

- completeGuardTurn

---

AssassinPromptModal / onIgnore =>

- pushNotification(public message)

- /actionResult with AssassinPromptModal attackerMessage

- completeGuardTurn

---

CompleteGuardTurn() => trigger completeTurnWithCardIndex(1) which is calling checkRoundEndConditions()

And if it's NOT the end of the round => Turn advancement to next player + update of Handmaid protected players.
