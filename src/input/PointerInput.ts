import { Vector2D } from '../core/Vector2D';

export interface PointerHandlers {
  onDown: (p: Vector2D) => void;
  onMove: (p: Vector2D) => void;
  onUp: (p: Vector2D) => void;
  onGlobalMove: (p: Vector2D) => void;
  onGlobalUp: (p: Vector2D) => void;
}

/**
 * Unified mouse + touch handler. Maps client coords to canvas-local coords
 * accounting for CSS-resized canvases on mobile.
 */
export class PointerInput {
  constructor(private canvas: HTMLCanvasElement, h: PointerHandlers) {
    canvas.addEventListener('mousedown', (e) => h.onDown(this.toCanvas(e.clientX, e.clientY)));
    canvas.addEventListener('mousemove', (e) => h.onMove(this.toCanvas(e.clientX, e.clientY)));
    canvas.addEventListener('mouseup', (e) => h.onUp(this.toCanvas(e.clientX, e.clientY)));

    document.addEventListener('mousemove', (e) => h.onGlobalMove(this.toCanvas(e.clientX, e.clientY)));
    document.addEventListener('mouseup', (e) => h.onGlobalUp(this.toCanvas(e.clientX, e.clientY)));

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      if (t) h.onDown(this.toCanvas(t.clientX, t.clientY));
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      if (t) {
        const p = this.toCanvas(t.clientX, t.clientY);
        h.onMove(p);
        h.onGlobalMove(p);
      }
    }, { passive: false });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      if (t) {
        const p = this.toCanvas(t.clientX, t.clientY);
        h.onUp(p);
        h.onGlobalUp(p);
      }
    }, { passive: false });
  }

  private toCanvas(clientX: number, clientY: number): Vector2D {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return new Vector2D((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
  }
}
