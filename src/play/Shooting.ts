import type { Vector2D } from '../core/Vector2D';
import type { Ball } from '../physics/Ball';
import { MIN_VELOCITY } from '../config/constants';

export interface ShotResult {
  shot: boolean;
}

/**
 * Apply a shot to the ball. Returns whether a stroke should be counted.
 */
export function shootBall(ball: Ball, velocity: Vector2D): ShotResult {
  if (!velocity || velocity.magnitude() < MIN_VELOCITY) {
    return { shot: false };
  }
  ball.lastPosition = ball.position.clone();
  ball.velocity = velocity;
  ball.isMoving = true;
  return { shot: true };
}
