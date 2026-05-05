import { Ball } from './Ball';
import { MIN_VELOCITY, SUB_STEP_FACTOR } from '../config/constants';

export type StepCollisionCheck = () => void;

export interface StepResult {
  stoppedThisFrame: boolean;
}

/**
 * Sub-stepping integrator. Advances the ball by deltaTime using small sub-steps
 * to prevent tunneling. Friction is applied AFTER all steps. Returns whether the
 * ball came to rest this frame so the caller can run post-stop checks (water).
 */
export function stepBall(
  ball: Ball,
  deltaTime: number,
  onStepCollision: StepCollisionCheck,
): StepResult {
  if (!ball.isMoving || ball.isInHole) return { stoppedThisFrame: false };

  ball.lastPosition = ball.position.clone();

  const maxStepDistance = ball.radius * SUB_STEP_FACTOR;
  const velocityMagnitude = ball.velocity.magnitude();

  if (velocityMagnitude > 0) {
    const stepDistance = velocityMagnitude * deltaTime;
    const numSteps = Math.max(1, Math.ceil(stepDistance / maxStepDistance));
    const stepTime = deltaTime / numSteps;

    for (let i = 0; i < numSteps; i++) {
      ball.position = ball.position.add(ball.velocity.multiply(stepTime));
      onStepCollision();
    }
  }

  ball.velocity = ball.velocity.multiply(ball.currentFriction);

  if (ball.velocity.magnitude() < MIN_VELOCITY) {
    ball.velocity.x = 0;
    ball.velocity.y = 0;
    ball.isMoving = false;
    return { stoppedThisFrame: true };
  }

  return { stoppedThisFrame: false };
}
