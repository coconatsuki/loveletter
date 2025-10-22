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

If attacker looses, we discard their second card (they only have Baron in hand now & update the selectedCardIndex, just in case)

- return attackerMessage,targetMessage, publicMessage, winner, isTie, result

set /baronTarget & setBaronResultModalData that triggers <BaronResultModal> which, onConfirm =>

handlePlayerElimination(loser) (with discardRemainingHand: false if attacker==loser, as it will be done later)

& update Firebase.

& publicNotification.

Then => handleEffectResultClose() => completeTurnWithCardIndex() => checkRoundEndConditions()

### Handmaid

PlayCard() => playHandmaid() - special Handling (no target selection)

applyHandmaidEffect() (in cardEffects.js) => add currentPlayer to protectedPlayer array & update firebase. + send back public message & playerMessage

=> handleEffectResultClose() => completeTurnWithCardIndex()

### Prince

PlayCard() => showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 5) {

calls applyPrince() (cardEffects) => discard hand (that is NOT the prince, for SelfTarget)

If discarded card is princess => trigger elimination right away for external target (for selfTarget: on EffectResultModal onClose())

If discarded card is NOT princess => draw new card (if SelfTarget: use the original princeCardIndex, so we don't discard the wrong card later)

handleEffectResultClose =>
if (cardSelectedId == 5 && SelfTarget && princessDiscarded) => Eliminate player NOW, but WITHOUT CLEANING THEIR HAND ({discardRemainingHand: false})

If (SelfTarget && princessDiscarded), the prince card should be discarded in completeTurnWithCardIndex() function, that also checks for roundEnd & advance turn.

### Phantom King

PlayCard() => showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 6) =>

applyPhantomKingEffect (in cardEffect.js) => get phantomKingCard, secondAttackerCard, targetCard,

then swap hands (secondAttackerCard & targetCard) while respecting the original phantomKingCardIndex (to make sure we don't mess up when it's discarded later, in completeTurnWithCardIndex()) & update Firebase

handleEffectResultClose => completeTurnWithCardIndex() - Phantom King is discarded here)
