import type { GameState, Phase } from './types';

export const GAME_STATES = {
  START: 'start',
  DESIGN: 'design',
  PLAY: 'play',
  WIN: 'win',
} as const satisfies Record<string, GameState>;

export const PHASES = {
  DESIGN: 'design',
  PLAY: 'play',
} as const satisfies Record<string, Phase>;

export class StateMachine {
  state: GameState = GAME_STATES.START;
  phase: Phase = PHASES.DESIGN;

  setState(s: GameState): void {
    this.state = s;
  }

  setPhase(p: Phase): void {
    this.phase = p;
  }

  isPlaying(): boolean {
    return this.state === GAME_STATES.DESIGN || this.state === GAME_STATES.PLAY;
  }
}
