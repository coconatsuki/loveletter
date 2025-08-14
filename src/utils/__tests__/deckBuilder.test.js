import { describe, it, expect } from 'vitest'
import { buildDeck } from '../deckBuilder'

describe('Deck Builder', () => {
  it('should create normal mode deck with correct total card count', () => {
    const deck = buildDeck('normal')
    // Normal mode: 16 total cards (5 Guards + 2 Priests + 2 Barons + 2 Handmaids + 2 Princes + 1 King + 1 Countess + 1 Princess)
    expect(deck).toHaveLength(16)
  })

  it('should create premium mode deck with more cards', () => {
    const deck = buildDeck('premium')
    // Premium mode should have more cards than normal mode
    expect(deck.length).toBeGreaterThan(16)
  })

  it('should have correct number of Guard cards in normal mode', () => {
    const deck = buildDeck('normal')
    const guardCards = deck.filter(card => card.id === 1)
    expect(guardCards).toHaveLength(5)
  })

  it('should have correct number of Guard cards in premium mode', () => {
    const deck = buildDeck('premium')
    const guardCards = deck.filter(card => card.id === 1)
    expect(guardCards).toHaveLength(8)
  })

  it('should include Princess card in both modes', () => {
    const normalDeck = buildDeck('normal')
    const premiumDeck = buildDeck('premium')
    
    const normalPrincess = normalDeck.filter(card => card.id === 8)
    const premiumPrincess = premiumDeck.filter(card => card.id === 8)
    
    expect(normalPrincess).toHaveLength(1)
    expect(premiumPrincess).toHaveLength(1)
  })
})
