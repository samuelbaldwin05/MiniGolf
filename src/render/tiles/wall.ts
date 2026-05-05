import { Wall } from '../../entities/buildings/Wall';

export function drawWall(ctx: CanvasRenderingContext2D, w: Wall): void {
  if (w.rotation !== 0) {
    ctx.save();
    ctx.translate(w.x + w.width / 2, w.y + w.height / 2);
    ctx.rotate(w.rotation * Math.PI / 180);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-w.width / 2, -w.height / 2, w.width, w.height);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(-w.width / 2, -w.height / 2, w.width, w.height);
    ctx.restore();
  } else {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(w.x, w.y, w.width, w.height);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x, w.y, w.width, w.height);
  }
}
