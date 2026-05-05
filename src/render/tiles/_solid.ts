import type { Building } from '../../entities/buildings/Building';

export function drawSolid(
  ctx: CanvasRenderingContext2D,
  b: Building,
  color: string,
): void {
  if (b.rotation !== 0) {
    ctx.save();
    ctx.translate(b.x + b.width / 2, b.y + b.height / 2);
    ctx.rotate(b.rotation * Math.PI / 180);
    ctx.fillStyle = color;
    ctx.fillRect(-b.width / 2, -b.height / 2, b.width, b.height);
    ctx.restore();
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
  }
}
