# CARDS FLOW DOCUMENTATION

## How do each card check for roundEnd conditions and when?

### JESTER - 0

showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 0)

calls applyJesterEffect() (cardEffects) =>

     * Apply [`players/${target}/jesterToken`]: { giver: attacker } in Firebase

     * Set /targetMessage & setResultModalData & publicMessage

EffectResultModal onClose => handleEffectResultClose() => completeTurnWithCardIndex =>

Check if roundEnd/isFinal turn. If yes: end round / if no: advance turn to nextPlayer

### GUARD - 1

setShowTargetModal(true) => <TargetModal> => handleTargetConfirm() => applyGuardEffect() =>

- Check if player has ASSASSIN / & if GUESS WAS CORRECT

& returns: hasAssassin, isCorrectGuess, targetCard, eliminatedPlayer

/guardPrompt in Firebase (for TARGET), with result from applyGuardEffect() => <AssassinPromptModal> => handleAssassinPromptClose() (From TARGET's side) =>

- calls applyGuard2Effect() that generates the resultTexts (public, attacker, target)
  & eliminates TARGET if necessary. Or discard Assassin (and draw new card) if necessary

- pushNotification,

- Reset /guardPrompt (for target), Set /guard2Prompt (EffectResultModal for attacker) and Set attackerMarkedForElimination in Firebase =>

When attacker closes EffectResultModal => handleEffectResultClose() => CompleteGuardTurn() => Eliminate attacker if necessary =>

completeTurnWithCardIndex() - without discarding if attacker is eliminated

### PRIEST - 2

showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 2) {

calls applyPriestEffect() (cardEffects) =>

    * Fetch TargetCard & return enrichedTargetCard + all messages

     * update(ref(db, `rooms/${roomCode}/priestTarget`) with targetCard

     * Set /targetMessage & setResultModalData & publicMessage

EffectResultModal onClose => handleEffectResultClose() => completeTurnWithCardIndex =>

Check if roundEnd/isFinal turn. If yes: end round / if no: advance turn to nextPlayer

### BARON - 3

calls applyBaronEffect() (cardEffects) =>

- Get attacker & target cards

If attacker looses, we discard their second card (they only have Baron in hand now & update the selectedCardIndex, just in case)

- return attackerMessage,targetMessage, publicMessage, winner, isTie, result

set /baronTarget & setBaronResultModalData that triggers <BaronResultModal> which, onConfirm =>

handlePlayerElimination(loser) (with discardRemainingHand: false if attacker==loser, as it will be done later)

& update Firebase.

& publicNotification.

Then => handleEffectResultClose() => completeTurnWithCardIndex() => checkRoundEndConditions()

### Handmaid - 4

PlayCard() => playHandmaid() - special Handling (no target selection)

applyHandmaidEffect() (in cardEffects.js) => add currentPlayer to protectedPlayer array & update firebase. + send back public message & playerMessage

=> handleEffectResultClose() => completeTurnWithCardIndex()

### Prince - 5

PlayCard() => showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 5) {

calls applyPrince() (cardEffects) => discard hand (that is NOT the prince, for SelfTarget)

If discarded card is princess => trigger elimination right away for external target (for selfTarget: on EffectResultModal onClose())

If discarded card is NOT princess => draw new card (if SelfTarget: use the original princeCardIndex, so we don't discard the wrong card later)

handleEffectResultClose =>
if (cardSelectedId == 5 && SelfTarget && princessDiscarded) => Eliminate player NOW, but WITHOUT CLEANING THEIR HAND ({discardRemainingHand: false})

If (SelfTarget && princessDiscarded), the prince card should be discarded into handleEffectResultClose that will call handleElimination() which will clean the remaining card.

completeTurnWithCardIndex(option: isDiscarding=false) => checks for roundEnd & advance turn.

### Phantom King - 6

PlayCard() => showTargetModal => handleTargetConfirm() => if (cardPlayed.id === 6) =>

applyPhantomKingEffect (in cardEffect.js) => get phantomKingCard, secondAttackerCard, targetCard,

then swap hands (secondAttackerCard & targetCard) while respecting the original phantomKingCardIndex (to make sure we don't mess up when it's discarded later, in completeTurnWithCardIndex()) & update Firebase

handleEffectResultClose => completeTurnWithCardIndex() - Phantom King is discarded here)

### Countess - 7

playCard() => playCountess => setSelectedCardIndex() => applyCountessEffect() (cardEffects.js) =>

generate public message & attacker result message

=> setResultModalData with result & push notifs => handleEffectResultClose => completeTurnWithCardIndex() - Countess is discarded here

### Princess - 8

playCard => playPrincess (card.id === 8) => setSelectedCardIndex() & setIsPlaying(true) =>

applyPrincessEffect() (from cardEffects.js) => generate public & player messages =>

=> pushNotification() & setResultModalData() => handleEffectResultClose() =>

completePrincessTurn() => Eliminate the playerwith handleElimination() which will clean the remaining/second card.

completeTurnWithCardIndex(option: isDiscarding=false) => checks for roundEnd & advance turn.

### Inquisitor - 9

setShowTargetModal() => show <InquisitorTargetModal> / pass it: isDeckEmpty + onConfirm={handleTargetConfirm}

// If Deck empty => Can't target anyone

handleTargetConfirm => applyInquisitorEffect() with attacker, target & guess =>

if: wasCorrect => awardLoveToken (add +1 to "tokens" + "roundTokens" & set loveTokenOrigin: "inquistorGuess":1)

if: wasCorrect & isPrincessFound (target.id==8 & wasCorrect) =>

handlePlayerElimination(target) & update firebase

if: wasCorrect & !isPrincessFound (target.id==8 & wasCorrect) =>

handlePlayerDiscard(target) + draw new hand & update Firebase

- returns the attackerMessage, targetMessage, publicMessage, foundPrincess, discardedCard

// pushNotif() + update .../targetResult && setResultModalData(attackerMessage)

handleEffectResultClose => completeTurnWithCardIndex() - Inquisitor is discarded here)

### Chamberlain - 10

playCard() => playChamberlain() => applyChamberlainEffect() =>

just return attackerMessage & publicMessage()

---

pushNotification() & setResultModalData()

handleEffectResultClose => completeTurnWithCardIndex()

---

in handleCardDiscard() =>

- if (gameMode == "premium" & card.id == 10) => set /chamerlainToken (as false)

in handlePlayerElimination() =>

- if eliminatedPlayer has "chamberlainToken=false" => we set it to true

in triggerRoundEnd() =>

- for EACH player, we check if one has a chamberlainToken=true

if so, we reward them a token + roundToken. + set "loveTokenOrigin: chamberlainToken: 1"

### Regent Queen - 11

setShowTargetModal() => handleTargetConfirm() => applyRegentQueenEffect() =>

- compare strength, define winner/loser &

- IF eliminatedPlayer==attacker => Discard remaining card HERE & updatePlayedCardIndex(0) to make sure the RegentQueen is discarded later.

- generate narratives

pushNotifications() & Set /regentQueenTarget (in Firebase) for TARGET & setRegentQueenResultModalData() for ATTACKER

<RegentQueenResultModal> (for ATTACKER)=> ELIMINATE LOSER (discardRemainingHand: false if attackerEliminated, true if targetEliminated)

reset /regentQueenTarget & RegentQueenResultModalData => handleEffectResultClose() => Regent queen is discarded in completeTurnWithCardIndex()

### Court Whisperer - 12

setShowTargetModal() => handleTargetConfirm() => applyCourtWhispererEffect() =>

    * just generates narratives (attacker, target, public)

if (!isSelfTarget) => /targetMessage + pushNotification() + setResultModalData() => handleEffectResultClose() => completeCourtWhispererTurn() =>

- set /nextTarget object in Firebase

=> completeTurnWithCardIndex()

### Royal Confessor - 13

RoyalConfessorTargetModal() => <RoyalConfessorTargetModal> => handleTargetConfirm() => applyRoyalConfessorEffect() =>

- Get target1Card, target2Card, royalConfessorCard, attackerSecondCard.
- Proceed to Hand Swapping. If isSelfTarget => new hand respects the original cardIndex of the royalConfessor
- Generate narratives

set /targetMessage & (IF Target1 is external => /target2Message) & setRoyalConfessorResultModalData() => <RoyalConfessorResultModal> =>

handleEffectResultClose(); => completeTurnWithCardIndex()

### Assassin - 14

playCard() => playAssassin() => applyAssassinEffect() => generates narratives => pushNotification() => setResultModalData()

=> handleEffectResultClose() => completeTurnWithCardIndex()

### Baroness - 15

setShowTargetModal() => BaronessTargetModal() => <BaronessTargetModal> => handleTargetConfirm() => applyBaronessEffect() =>

- Get Target1Card and (if Target2) get Target2Card & generate narratives

Set /targetMessage (and IF NECESSARY also /target2Message) and setResultModalData() and pushNotification()

=> handleEffectResultClose() => completeTurnWithCardIndex()

### Duke - 16

playCard() => playDuke() => applyDukeEffect() => generate attacker & public messages =>

=> pushNotification() & setResultModalData() => handleEffectResultClose() =>

=> completeDukeTurn() => increment /dukeToken in firebase =>

=> handleEffectResultClose() => completeTurnWithCardIndex()
