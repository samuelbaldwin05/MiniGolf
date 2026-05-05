import type { ConfettiSystem } from '../effects/Confetti';

export function drawConfetti(ctx: CanvasRenderingContext2D, system: ConfettiSystem): void {
  if (!system.active) return;
  for (const p of system.particles) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }
}
