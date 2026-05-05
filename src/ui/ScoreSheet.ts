import type { GameMode, PlayerMode } from '../core/types';

export interface ScoreSnapshot {
  currentHole: number;
  totalHoles: number;
  player1HoleScore: number;
  player2HoleScore: number;
  player1Score: number;
  player2Score: number;
  gameMode: GameMode;
  playerMode: PlayerMode;
}

export class ScoreSheet {
  private currentHoleEl = document.getElementById('current-hole');
  private p1Hole = document.getElementById('player1-hole-score');
  private p2Hole = document.getElementById('player2-hole-score');
  private p1Total = document.getElementById('player1-total-score');
  private p2Total = document.getElementById('player2-total-score');

  update(s: ScoreSnapshot): void {
    if (this.currentHoleEl) this.currentHoleEl.textContent = String(s.currentHole);
    if (this.p1Hole) this.p1Hole.textContent = String(s.player1HoleScore);
    if (this.p2Hole) this.p2Hole.textContent = String(s.player2HoleScore);
    if (this.p1Total) this.p1Total.textContent = String(s.player1Score + s.player1HoleScore);
    if (this.p2Total) this.p2Total.textContent = String(s.player2Score + s.player2HoleScore);

    // Hide P2 row in single-player premade
    const rows = document.querySelectorAll('.score-row');
    const p2Row = rows[1] as HTMLElement | undefined;
    if (p2Row) {
      const hide = s.gameMode === 'premade' && s.playerMode === 'single';
      p2Row.style.display = hide ? 'none' : 'flex';
    }
  }
}
