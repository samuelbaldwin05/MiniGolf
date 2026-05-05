import { Vector2D } from '../core/Vector2D';
import {
  BALL_RADIUS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FRICTION,
  MIN_VELOCITY,
} from '../config/constants';

export class Ball {
  position: Vector2D;
  velocity = new Vector2D(0, 0);
  radius = BALL_RADIUS;
  isMoving = false;
  isInHole = false;
  initialPosition: Vector2D;
  lastPosition: Vector2D;
  lastStationaryPosition: Vector2D;
  endPosition: Vector2D;
  currentFriction = FRICTION;

  constructor(x: number, y: number, public color: string) {
    this.position = new Vector2D(x, y);
    this.initialPosition = new Vector2D(x, y);
    this.lastPosition = new Vector2D(x, y);
    this.lastStationaryPosition = new Vector2D(x, y);
    this.endPosition = new Vector2D(x, y);
  }

  reset(x: number, y: number): void {
    this.position = new Vector2D(x, y);
    this.initialPosition = new Vector2D(x, y);
    this.endPosition = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.isMoving = false;
    this.isInHole = false;
    this.currentFriction = FRICTION;
  }

  respawn(): void {
    this.position = this.initialPosition.clone();
    this.endPosition = this.initialPosition.clone();
    this.velocity = new Vector2D(0, 0);
    this.isMoving = false;
    this.isInHole = false;
    this.currentFriction = FRICTION;
  }

  isOutOfBounds(): boolean {
    return (
      this.position.x < this.radius ||
      this.position.x > CANVAS_WIDTH - this.radius ||
      this.position.y < this.radius ||
      this.position.y > CANVAS_HEIGHT - this.radius
    );
  }

  /**
   * Returns true if the ball came to rest this frame (so caller can do water check).
   */
  hasStopped(): boolean {
    return this.velocity.magnitude() < MIN_VELOCITY && !this.isMoving;
  }
}
