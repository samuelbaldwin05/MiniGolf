import { Vector2D } from '../core/Vector2D';
import { HOLE_RADIUS, HOLE_DETECTION_THRESHOLD } from '../config/constants';
import type { CircleBody } from '../physics/collisions';

export class Hole {
  position: Vector2D;
  radius = HOLE_RADIUS;

  constructor(x: number, y: number) {
    this.position = new Vector2D(x, y);
  }

  contains(ball: CircleBody): boolean {
    return this.position.distance(ball.position) < this.radius;
  }

  isBallHalfIn(ball: CircleBody): boolean {
    const distance = this.position.distance(ball.position);
    return distance < (this.radius - ball.radius * HOLE_DETECTION_THRESHOLD);
  }
}
