import { Sand } from '../../entities/buildings/Sand';
import { drawSolid } from './_solid';

export function drawSand(ctx: CanvasRenderingContext2D, s: Sand): void {
  drawSolid(ctx, s, '#F4D03F');
}
