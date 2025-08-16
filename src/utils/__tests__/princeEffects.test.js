import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, get, update } from 'firebase/database';
import { applyPrinceEffect } from '../cardEffects';

// Mock Firebase
vi.mock('firebase/database', () => ({
  ref: vi.fn(() => 'mock-ref'),
  get: vi.fn(),
  update: vi.fn(),
}));

describe('Prince Card Effects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('applyPrinceEffect', () => {
    const mockRoomCode = 'TEST123';
    const mockAttacker = 'alice';

    it('should handle normal card swap (other player)', async () => {
      const mockTarget = 'bob';
      const mockDiscardedCard = { id: 2, name: 'Priest', strength: 2, effect: 'Look at another player\'s hand' };
      const mockNewCard = { id: 4, name: 'Handmaid', strength: 4, effect: 'Protection until next turn' };
      
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice' },
            bob: { name: 'Bob', hand: [mockDiscardedCard], discard: [] }
          },
          round: { deck: [{ id: 1, name: 'Guard' }, mockNewCard] } // New card is at the end
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: mockTarget
      });

      expect(vi.mocked(update)).toHaveBeenCalledWith('mock-ref', {
        [`players/${mockTarget}/hand`]: [mockNewCard],
        [`players/${mockTarget}/discard`]: [mockDiscardedCard],
        'round/deck': [{ id: 1, name: 'Guard' }]
      });

      expect(result.result).toBe('cardSwapped');
      expect(result.attacker).toBe(mockAttacker);
      expect(result.target).toBe(mockTarget);
      expect(result.isSelfTarget).toBe(false);
      expect(result.discardedCard).toEqual(mockDiscardedCard);
      expect(result.newCard).toEqual(mockNewCard);
      expect(result.wasPrincessDiscarded).toBe(false);
      expect(result.eliminatedPlayer).toBe(null);
      
      expect(result.publicMessage).toContain('Alice commands Bob');
      expect(result.publicMessage).toContain('Prince\'s authority');
      expect(result.attackerMessage).toContain('ROYAL DECREE EXECUTED');
      expect(result.targetMessage).toContain('ROYAL COMMAND');
      expect(result.targetMessage).toContain('Priest');
    });

    it('should handle self-targeting', async () => {
      const mockSelfTarget = mockAttacker; // alice targets herself
      const mockDiscardedCard = { id: 3, name: 'Baron', strength: 3, effect: 'Compare hands' };
      const mockNewCard = { id: 5, name: 'Prince', strength: 5, effect: 'Target discards and draws' };
      
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice', hand: [mockDiscardedCard], discard: [{ id: 1 }] }
          },
          round: { deck: [mockNewCard] } // New card is at the end
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: mockSelfTarget
      });

      expect(result.result).toBe('cardSwapped');
      expect(result.isSelfTarget).toBe(true);
      expect(result.targetMessage).toBe(null); // No separate target message for self
      
      expect(result.publicMessage).toContain('Alice uses the Prince\'s wisdom on themselves');
      expect(result.attackerMessage).toContain('ROYAL SELF-REFLECTION');
      expect(result.attackerMessage).toContain('Baron');
      expect(result.attackerMessage).toContain('Prince');
    });

    it('should handle Princess elimination (other player)', async () => {
      const mockTarget = 'bob';
      const princessCard = { id: 8, name: 'Princess', strength: 8, effect: 'Lose if discarded' };
      
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice' },
            bob: { name: 'Bob', hand: [princessCard], discard: [] }
          },
          round: { deck: [{ id: 1, name: 'Guard' }] }
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: mockTarget
      });

      expect(vi.mocked(update)).toHaveBeenCalledWith('mock-ref', {
        [`players/${mockTarget}/hand`]: [], // Empty because Princess eliminated
        [`players/${mockTarget}/discard`]: [princessCard],
        'round/deck': [{ id: 1, name: 'Guard' }], // Deck unchanged - no draw
        [`players/${mockTarget}/isOut`]: true
      });

      expect(result.result).toBe('princessEliminated');
      expect(result.wasPrincessDiscarded).toBe(true);
      expect(result.eliminatedPlayer).toBe(mockTarget);
      expect(result.newCard).toBe(null);
      
      expect(result.publicMessage).toContain('ROYAL CATASTROPHE');
      expect(result.publicMessage).toContain('Princess');
      expect(result.attackerMessage).toContain('ROYAL CATASTROPHE');
      expect(result.targetMessage).toContain('ROYAL DOOM');
    });

    it('should handle Princess self-elimination', async () => {
      const princessCard = { id: 8, name: 'Princess', strength: 8 };
      
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice', hand: [princessCard], discard: [] }
          },
          round: { deck: [] }
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: mockAttacker // Self-target
      });

      expect(result.result).toBe('princessEliminated');
      expect(result.isSelfTarget).toBe(true);
      expect(result.wasPrincessDiscarded).toBe(true);
      expect(result.eliminatedPlayer).toBe(mockAttacker);
      expect(result.targetMessage).toBe(null);
      
      expect(result.publicMessage).toContain('OH NO! Alice commanded themselves');
      expect(result.publicMessage).toContain('PRINCESS');
      expect(result.attackerMessage).toContain('ROYAL TRAGEDY');
    });

    it('should handle empty deck scenario', async () => {
      const mockTarget = 'bob';
      const mockDiscardedCard = { id: 2, name: 'Priest', strength: 2 };
      
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice' },
            bob: { name: 'Bob', hand: [mockDiscardedCard], discard: [] }
          },
          round: { deck: [] } // Empty deck!
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: mockTarget
      });

      expect(vi.mocked(update)).toHaveBeenCalledWith('mock-ref', {
        [`players/${mockTarget}/hand`]: [], // No new card drawn
        [`players/${mockTarget}/discard`]: [mockDiscardedCard],
        'round/deck': []
      });

      expect(result.result).toBe('cardSwapped');
      expect(result.newCard).toBe(null);
      
      expect(result.publicMessage).toContain('finds the royal deck empty');
      expect(result.attackerMessage).toContain('The royal deck was empty');
      expect(result.targetMessage).toContain('The royal deck was empty');
    });

    it('should handle invalid target player', async () => {
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice' }
            // bob doesn't exist!
          }
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: 'nonexistent'
      });

      expect(result.result).toBe('error');
      expect(result.error).toBe('Invalid target player');
    });

    it('should have proper medieval themed messages', async () => {
      const mockTarget = 'bob';
      const mockCard = { id: 1, name: 'Guard', strength: 1 };
      const mockNewCard = { id: 2, name: 'Priest', strength: 2 };
      
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice' },
            bob: { name: 'Bob', hand: [mockCard], discard: [] }
          },
          round: { deck: [mockNewCard] }
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: mockTarget
      });

      // Check royal themes
      expect(result.publicMessage).toMatch(/👑.*✨/);
      expect(result.publicMessage).toContain('royal');
      expect(result.attackerMessage).toMatch(/👑.*✨.*ROYAL DECREE.*✨.*👑/);
      expect(result.targetMessage).toMatch(/👑.*✨.*ROYAL COMMAND.*✨.*👑/);
      
      // Check for medieval quotes
      expect(result.attackerMessage).toContain('"The Prince\'s wisdom guides the court..."');
      expect(result.targetMessage).toContain('"By royal decree, a fresh beginning awaits..."');
      expect(result.targetMessage).toContain('His Royal Highness, The Prince');
    });

    it('should have correct effect properties', async () => {
      const mockCard = { id: 1, name: 'Guard', strength: 1 };
      const mockNewCard = { id: 2, name: 'Priest', strength: 2 };
      
      vi.mocked(get).mockResolvedValue({
        val: () => ({
          players: {
            alice: { name: 'Alice', hand: [mockCard], discard: [] }
          },
          round: { deck: [mockNewCard] }
        })
      });

      const result = await applyPrinceEffect({
        roomCode: mockRoomCode,
        attacker: mockAttacker,
        target: mockAttacker
      });

      expect(result.requiresPrompt).toBe(false);
      expect(typeof result.publicMessage).toBe('string');
      expect(typeof result.attackerMessage).toBe('string');
      expect(typeof result.result).toBe('string');
    });
  });
});
