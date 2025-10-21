# CARDS FLOW DOCUMENTATION

## How do each card check for roundEnd conditions and when?

### 0 - JESTER

showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 0)

calls applyJesterEffect() (cardEffects) =>

     * Apply [`players/${target}/jesterToken`]: { giver: attacker } in Firebase

     * Set /targetMessage & setResultModalData & publicMessage

EffectResultModal onClose => handleEffectResultClose() => completeTurnWithCardIndex =>

Check if roundEnd/isFinal turn. If yes: end round / if no: advance turn to nextPlayer

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

### 2 - PRIEST

showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 2) {

calls applyPriestEffect() (cardEffects) =>

    * Fetch TargetCard & return enrichedTargetCard + all messages

     * update(ref(db, `rooms/${roomCode}/priestTarget`) with targetCard

     * Set /targetMessage & setResultModalData & publicMessage

EffectResultModal onClose => handleEffectResultClose() => completeTurnWithCardIndex =>

Check if roundEnd/isFinal turn. If yes: end round / if no: advance turn to nextPlayer

### 3 - BARON

calls applyBaronEffect() (cardEffects) =>

- Get attacker & target cards
- return attackerMessage,targetMessage, publicMessage, winner, isTie, result

## set /baronTarget & setBaronResultModalData

baronResultModalData triggers <BaronResultModal> with useRole, attacker/target names & card names, eliminatedPlayer, isTie + message.

onConfirm =>

if eliminatedPlayer (!isTie) => handlePlayerElimination() & update Firebase.

& publicNotification.

Then => handleEffectResultClose() => completeTurnWithCardIndex() => checkRoundEndConditions()

### Handmaid
