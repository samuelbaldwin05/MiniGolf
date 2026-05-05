import { Vector2D } from '../../core/Vector2D';
import type { TileType } from '../../core/types';
import type { Hole } from '../../entities/Hole';

export interface PlacementRect {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export function computePlacementRect(start: Vector2D, end: Vector2D): PlacementRect {
  const startX = Math.min(start.x, end.x);
  const startY = Math.min(start.y, end.y);
  const endX = Math.max(start.x, end.x);
  const endY = Math.max(start.y, end.y);
  return {
    startX,
    startY,
    width: endX - startX,
    height: endY - startY,
  };
}

export function rectOverlapsHole(rect: PlacementRect, hole: Hole): boolean {
  const left = rect.startX;
  const right = rect.startX + rect.width;
  const top = rect.startY;
  const bottom = rect.startY + rect.height;
  const cx = Math.max(left, Math.min(hole.position.x, right));
  const cy = Math.max(top, Math.min(hole.position.y, bottom));
  const dx = hole.position.x - cx;
  const dy = hole.position.y - cy;
  return dx * dx + dy * dy < hole.radius * hole.radius;
}

export function drawPreview(
  ctx: CanvasRenderingContext2D,
  rect: PlacementRect,
  type: TileType,
  invalid: boolean,
): void {
  const { startX, startY, width, height } = rect;
  ctx.save();
  ctx.globalAlpha = 0.6;

  if (type === 'wall') {
    ctx.fillStyle = invalid ? '#FF0000' : '#8B4513';
    ctx.fillRect(startX, startY, width, height);
    ctx.strokeStyle = invalid ? '#CC0000' : '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
  } else {
    const gradient = ctx.createLinearGradient(startX, startY, startX + width, startY + height);
    if (invalid) {
      gradient.addColorStop(0, '#FF6666');
      gradient.addColorStop(0.5, '#FF8888');
      gradient.addColorStop(1, '#FFAAAA');
    } else if (type === 'sand') {
      gradient.addColorStop(0, '#F4D03F');
      gradient.addColorStop(0.5, '#F7DC6F');
      gradient.addColorStop(1, '#F8C471');
    } else if (type === 'tallGrass') {
      gradient.addColorStop(0, '#2E8B57');
      gradient.addColorStop(0.5, '#3CB371');
      gradient.addColorStop(1, '#228B22');
    } else if (type === 'water') {
      gradient.addColorStop(0, '#1E90FF');
      gradient.addColorStop(0.5, '#00BFFF');
      gradient.addColorStop(1, '#87CEEB');
    } else {
      gradient.addColorStop(0, '#E0F6FF');
      gradient.addColorStop(0.5, '#F0F8FF');
      gradient.addColorStop(1, '#E6F3FF');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(startX, startY, width, height);
  }
  ctx.restore();
}
