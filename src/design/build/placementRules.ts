import { Vector2D } from '../../core/Vector2D';
import type { Ball } from '../../physics/Ball';
import type { Building } from '../../entities/buildings/Building';
import { WALL_THICKNESS, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../config/constants';
import type { PlacementRect } from './Placement';

/**
 * Reject if rect overlaps the ball spawn (using max-dim heuristic from legacy).
 */
export function rectOverlapsBall(rect: PlacementRect, ball: Ball): boolean {
  const cx = rect.startX + rect.width / 2;
  const cy = rect.startY + rect.height / 2;
  const dist = Math.sqrt(
    (cx - ball.position.x) ** 2 + (cy - ball.position.y) ** 2,
  );
  const minDist = ball.radius + Math.max(rect.width, rect.height) / 2;
  return dist < minDist;
}

export function holeOverlapsBall(holePos: Vector2D, ball: Ball, holeRadius: number): boolean {
  return holePos.distance(ball.position) < (holeRadius + ball.radius);
}

export function holeOverlapsBuildings(holePos: Vector2D, holeRadius: number, walls: Building[]): boolean {
  for (const b of walls) {
    const left = b.x;
    const right = b.x + b.width;
    const top = b.y;
    const bottom = b.y + b.height;
    if (
      !(right < holePos.x - holeRadius ||
        left > holePos.x + holeRadius ||
        bottom < holePos.y - holeRadius ||
        top > holePos.y + holeRadius)
    ) {
      return true;
    }
  }
  return false;
}

export function ballOverlapsBuildings(pos: Vector2D, ball: Ball, walls: Building[]): boolean {
  for (const b of walls) {
    if (
      b.x < pos.x + ball.radius &&
      b.x + b.width > pos.x - ball.radius &&
      b.y < pos.y + ball.radius &&
      b.y + b.height > pos.y - ball.radius
    ) {
      return true;
    }
  }
  return false;
}

export function isWithinPlayBoundaries(x: number, y: number, w = 0, h = 0): boolean {
  return (
    x >= WALL_THICKNESS &&
    y >= WALL_THICKNESS &&
    x + w <= CANVAS_WIDTH - WALL_THICKNESS &&
    y + h <= CANVAS_HEIGHT - WALL_THICKNESS
  );
}
