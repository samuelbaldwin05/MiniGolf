import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CONFETTI_COLORS,
  CONFETTI_COUNT,
  CONFETTI_GRAVITY,
  CONFETTI_LIFETIME_MS,
} from '../config/constants';

export interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export class ConfettiSystem {
  particles: ConfettiParticle[] = [];
  active = false;
  startTime = 0;

  spawn(originX: number, originY: number): void {
    this.active = true;
    this.startTime = Date.now();
    this.particles = [];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      this.particles.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY - 20 - Math.random() * 30,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? '#FFD700',
        size: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
  }

  update(): void {
    if (!this.active) return;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (!p) continue;
      p.vy += CONFETTI_GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > CANVAS_HEIGHT + 50 || p.x < -50 || p.x > CANVAS_WIDTH + 50) {
        this.particles.splice(i, 1);
      }
    }
    if (Date.now() - this.startTime > CONFETTI_LIFETIME_MS) {
      this.active = false;
      this.particles = [];
    }
  }
}
