import type { TileType, BoundingBox } from '../../core/types';
import { Vector2D } from '../../core/Vector2D';
import { getBoundingBox, getClosestPointOnRect, rectIntersectsBall } from '../../physics/collisions';
import type { CircleBody } from '../../physics/collisions';

export abstract class Building {
  abstract readonly type: TileType;
  rotation = 0;
  zIndex = 0;
  hitboxPadding = 0;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  intersects(ball: CircleBody): boolean {
    return rectIntersectsBall(this, ball, this.hitboxPadding);
  }

  getClosestPoint(ball: CircleBody): Vector2D {
    return getClosestPointOnRect(this, ball, this.hitboxPadding);
  }

  getBoundingBox(): BoundingBox {
    return getBoundingBox(this, this.hitboxPadding);
  }
}
