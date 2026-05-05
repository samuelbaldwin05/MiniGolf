import type { Building } from '../entities/buildings/Building';

export class RotationHandle {
  private el: HTMLDivElement;
  isRotating = false;
  target: Building | null = null;

  constructor(private canvas: HTMLCanvasElement, private onStart: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'rotation-handle';
    this.el.style.display = 'none';
    document.body.appendChild(this.el);

    this.el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isRotating = true;
      this.onStart();
    });
    this.el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isRotating = true;
      this.onStart();
    }, { passive: false });
  }

  show(b: Building): void {
    this.target = b;
    const rect = this.canvas.getBoundingClientRect();
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const angle = b.rotation * Math.PI / 180;
    const dist = b.height / 2 + 10;
    const hx = cx + Math.sin(angle) * dist;
    const hy = cy - Math.cos(angle) * dist;
    this.el.style.left = (rect.left + hx) + 'px';
    this.el.style.top = (rect.top + hy) + 'px';
    this.el.style.display = 'block';
  }

  hide(): void {
    this.target = null;
    this.el.style.display = 'none';
  }

  /** Rotate the current target so its top points toward (canvasX, canvasY). */
  rotateTo(b: Building, canvasX: number, canvasY: number): void {
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const angle = Math.atan2(canvasY - cy, canvasX - cx) * 180 / Math.PI;
    b.rotation = angle;
    this.show(b);
  }

  endRotation(): void {
    this.isRotating = false;
  }
}
