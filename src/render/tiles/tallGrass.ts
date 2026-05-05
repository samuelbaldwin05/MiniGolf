import { TallGrass } from '../../entities/buildings/TallGrass';
import { drawSolid } from './_solid';

export function drawTallGrass(ctx: CanvasRenderingContext2D, b: TallGrass): void {
  drawSolid(ctx, b, '#2E8B57');
}
