import { Water } from '../../entities/buildings/Water';
import { drawSolid } from './_solid';

export function drawWater(ctx: CanvasRenderingContext2D, b: Water): void {
  drawSolid(ctx, b, '#1E90FF');
}
