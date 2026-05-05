import { CANVAS_HEIGHT, CANVAS_WIDTH, GRASS_COLOR } from '../config/constants';
import type { Ball } from '../physics/Ball';
import type { Hole } from '../entities/Hole';
import type { Building } from '../entities/buildings/Building';
import type { Wall } from '../entities/buildings/Wall';
import { drawBuilding } from './drawBuildings';
import { drawBall, drawHole } from './drawBall';
import { drawAimLine } from './drawAimLine';
import { drawConfetti } from './drawConfetti';
import type { ConfettiSystem } from '../effects/Confetti';
import type { Selection } from '../design/build/Selection';
import { drawPreview, computePlacementRect, rectOverlapsHole, type PlacementRect } from '../design/build/Placement';
import type { TileType } from '../core/types';
import { Vector2D } from '../core/Vector2D';

export interface PreviewState {
  active: boolean;
  start: Vector2D;
  end: Vector2D;
  type: TileType;
}

export interface AimState {
  active: boolean;
  start: Vector2D;
  end: Vector2D;
  devMode: boolean;
}

export interface RenderInputs {
  ball: Ball;
  hole: Hole;
  walls: Building[];
  boundaryWalls: Wall[];
  selection: Selection;
  confetti: ConfettiSystem;
  preview: PreviewState;
  aim: AimState;
  showBuildingPreview: boolean;
}

export class Renderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(input: RenderInputs): void {
    const { ctx } = this;
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Terrain (non-wall) sorted by zIndex
    const terrain = input.walls.filter(b => b.type !== 'wall').sort((a, b) => a.zIndex - b.zIndex);
    for (const b of terrain) drawBuilding(ctx, b);

    // Walls
    const placedWalls = input.walls.filter(b => b.type === 'wall').sort((a, b) => a.zIndex - b.zIndex);
    for (const b of placedWalls) {
      drawBuilding(ctx, b);
      if (input.selection.selected === b) input.selection.drawOutline(ctx, b);
    }

    // Outline non-wall selection too
    if (input.selection.selected && input.selection.selected.type !== 'wall') {
      input.selection.drawOutline(ctx, input.selection.selected);
    }

    // Boundary walls on top
    for (const w of input.boundaryWalls) drawBuilding(ctx, w);

    // Building preview
    if (input.showBuildingPreview && input.preview.active) {
      const rect: PlacementRect = computePlacementRect(input.preview.start, input.preview.end);
      if (rect.width >= 10 && rect.height >= 10) {
        const invalid = rectOverlapsHole(rect, input.hole);
        drawPreview(ctx, rect, input.preview.type, invalid);
      }
    }

    drawHole(ctx, input.hole);
    drawBall(ctx, input.ball);
    drawConfetti(ctx, input.confetti);

    if (input.aim.active) {
      drawAimLine(ctx, input.ball, input.aim.start, input.aim.end, input.aim.devMode);
    }
  }
}
