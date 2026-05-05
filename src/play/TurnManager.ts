import type { PlayerNumber, GameMode, PlayerMode } from '../core/types';
import { PLAYER1_COLOR, PLAYER2_COLOR } from '../config/constants';

export class TurnManager {
  currentPlayer: PlayerNumber = 1;
  player1Score = 0;
  player2Score = 0;
  player1HoleScore = 0;
  player2HoleScore = 0;

  resetAll(): void {
    this.currentPlayer = 1;
    this.player1Score = 0;
    this.player2Score = 0;
    this.player1HoleScore = 0;
    this.player2HoleScore = 0;
  }

  resetHoleScores(): void {
    this.player1HoleScore = 0;
    this.player2HoleScore = 0;
  }

  /**
   * Determine which player should currently be playing based on hole scores.
   */
  whoIsPlaying(mode: GameMode, playerMode: PlayerMode): PlayerNumber {
    if (mode === 'premade' && playerMode === 'single') return 1;
    if (this.player1HoleScore === 0 && this.player2HoleScore === 0) return 1;
    if (this.player1HoleScore > 0 && this.player2HoleScore === 0) return 2;
    if (this.player1HoleScore === 0 && this.player2HoleScore > 0) return 1;
    return 1;
  }

  ballColorForCurrentTurn(mode: GameMode, playerMode: PlayerMode): string {
    return this.whoIsPlaying(mode, playerMode) === 1 ? PLAYER1_COLOR : PLAYER2_COLOR;
  }

  /**
   * Increment the current shooter's hole score (based on ball color).
   */
  countShotByColor(ballColor: string, mode: GameMode, playerMode: PlayerMode): void {
    if (mode === 'premade' && playerMode === 'single') {
      this.player1HoleScore++;
      return;
    }
    if (ballColor === PLAYER1_COLOR) this.player1HoleScore++;
    else if (ballColor === PLAYER2_COLOR) this.player2HoleScore++;
    else if (this.currentPlayer === 1) this.player1HoleScore++;
    else this.player2HoleScore++;
  }

  /**
   * Add hole scores into totals and clear them.
   */
  commitHole(): void {
    this.player1Score += this.player1HoleScore;
    this.player2Score += this.player2HoleScore;
    this.player1HoleScore = 0;
    this.player2HoleScore = 0;
  }

  static playerName(p: PlayerNumber): string {
    return p === 1 ? 'Blue' : 'Red';
  }
}
