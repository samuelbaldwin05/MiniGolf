import {
  HOLE_COUNT_MAX, HOLE_COUNT_MIN,
  TIMER_MAX, TIMER_MIN, TIMER_STEP,
} from '../config/constants';

export interface KeyboardHandlers {
  onDelete: () => void;
}

export class KeyboardInput {
  constructor(handlers: KeyboardHandlers) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        handlers.onDelete();
      }
    });

    this.bindNumberInput('hole-count', 1, HOLE_COUNT_MIN, HOLE_COUNT_MAX, 3);
    this.bindNumberInput('timer-seconds', TIMER_STEP, TIMER_MIN, TIMER_MAX, 30);
  }

  private bindNumberInput(id: string, step: number, min: number, max: number, fallback: number): void {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const v = parseInt(el.value, 10) || fallback;
        el.value = String(Math.min(v + step, max));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const v = parseInt(el.value, 10) || fallback;
        el.value = String(Math.max(v - step, min));
      }
    });
    el.addEventListener('blur', () => {
      const v = parseInt(el.value, 10);
      if (isNaN(v) || v < min || v > max) el.value = String(fallback);
    });
  }
}
