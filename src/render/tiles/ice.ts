import { Ice } from '../../entities/buildings/Ice';

export function drawIce(ctx: CanvasRenderingContext2D, b: Ice): void {
  if (b.rotation !== 0) {
    ctx.save();
    ctx.translate(b.x + b.width / 2, b.y + b.height / 2);
    ctx.rotate(b.rotation * Math.PI / 180);
    ctx.fillStyle = '#E0F6FF';
    ctx.fillRect(-b.width / 2, -b.height / 2, b.width, b.height);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    const sx = (Math.random() - 0.5) * b.width * 0.6;
    const sy = (Math.random() - 0.5) * b.height * 0.6;
    ctx.beginPath();
    ctx.moveTo(sx - 2, sy);
    ctx.lineTo(sx + 2, sy);
    ctx.moveTo(sx, sy - 2);
    ctx.lineTo(sx, sy + 2);
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.fillStyle = '#E0F6FF';
    ctx.fillRect(b.x, b.y, b.width, b.height);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    const sx = b.x + Math.random() * b.width;
    const sy = b.y + Math.random() * b.height;
    ctx.beginPath();
    ctx.moveTo(sx - 2, sy);
    ctx.lineTo(sx + 2, sy);
    ctx.moveTo(sx, sy - 2);
    ctx.lineTo(sx, sy + 2);
    ctx.stroke();
  }
}
