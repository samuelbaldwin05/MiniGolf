import type { Building } from '../entities/buildings/Building';
import { Wall } from '../entities/buildings/Wall';
import { Sand } from '../entities/buildings/Sand';
import { TallGrass } from '../entities/buildings/TallGrass';
import { Water } from '../entities/buildings/Water';
import { Ice } from '../entities/buildings/Ice';
import { drawWall } from './tiles/wall';
import { drawSand } from './tiles/sand';
import { drawTallGrass } from './tiles/tallGrass';
import { drawWater } from './tiles/water';
import { drawIce } from './tiles/ice';

export function drawBuilding(ctx: CanvasRenderingContext2D, b: Building): void {
  if (b instanceof Wall) drawWall(ctx, b);
  else if (b instanceof Sand) drawSand(ctx, b);
  else if (b instanceof TallGrass) drawTallGrass(ctx, b);
  else if (b instanceof Water) drawWater(ctx, b);
  else if (b instanceof Ice) drawIce(ctx, b);
}
