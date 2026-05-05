import { Vector2D } from '../core/Vector2D';
import { MAX_VELOCITY, POWER_MULTIPLIER } from '../config/constants';

export interface AimResult {
  direction: Vector2D;
  power: number;
  velocity: Vector2D;
}

export function computeAim(dragStart: Vector2D, dragEnd: Vector2D): AimResult {
  const direction = dragStart.subtract(dragEnd);
  const power = Math.min(direction.magnitude() * POWER_MULTIPLIER, MAX_VELOCITY);
  const velocity = direction.normalize().multiply(power);
  return { direction, power, velocity };
}
