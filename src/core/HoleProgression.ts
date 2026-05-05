import type { GameMode, PlayerMode } from './types';
import type { TurnManager } from '../play/TurnManager';

export type Phase = 'design' | 'play';

/**
 * Tracks current hole index and decides when to advance.
 */
export class HoleProgression {
  currentHole = 1;
  totalHoles = 1;

  reset(totalHoles: number): void {
    this.currentHole = 1;
    this.totalHoles = totalHoles;
  }

  isLastHole(): boolean {
    return this.currentHole >= this.totalHoles;
  }

  advance(): boolean {
    this.currentHole++;
    return this.currentHole > this.totalHoles;
  }

  /**
   * Decide whether the play phase is complete (both players done, or single done).
   */
  isPlayPhaseComplete(turn: TurnManager, mode: GameMode, playerMode: PlayerMode): boolean {
    if (mode === 'premade' && playerMode === 'single') {
      return turn.player1HoleScore > 0;
    }
    return turn.player1HoleScore > 0 && turn.player2HoleScore > 0;
  }
}
