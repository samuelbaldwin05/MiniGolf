import type { Ball } from '../physics/Ball';
import { Vector2D } from '../core/Vector2D';
import {
  AIM_DOT_COLOR,
  AIM_DOT_OUTLINE,
  AIM_DOT_SPACING,
  AIM_LINE_MAX_LENGTH,
  MAX_VELOCITY,
  MIN_VELOCITY,
  POWER_MULTIPLIER,
} from '../config/constants';

export function drawAimLine(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  dragStart: Vector2D,
  dragEnd: Vector2D,
  devMode = false,
): void {
  const direction = dragStart.subtract(dragEnd);
  const power = Math.min(direction.magnitude() * POWER_MULTIPLIER, MAX_VELOCITY);
  if (power <= MIN_VELOCITY) return;

  const behind = direction.normalize();
  const lineLength = Math.min((power / MAX_VELOCITY) * AIM_LINE_MAX_LENGTH, AIM_LINE_MAX_LENGTH);
  const numDots = Math.floor(lineLength / AIM_DOT_SPACING) + 1;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  for (let i = 0; i < numDots; i++) {
    const distance = numDots > 1 ? (i / (numDots - 1)) * lineLength : 0;
    const dx = ball.position.x - behind.x * distance;
    const dy = ball.position.y - behind.y * distance;
    const dotSize = Math.max(2, 2 + i * 0.8);

    ctx.beginPath();
    ctx.arc(dx, dy, dotSize, 0, 2 * Math.PI);
    ctx.fillStyle = AIM_DOT_COLOR;
    ctx.fill();
    ctx.strokeStyle = AIM_DOT_OUTLINE;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (devMode) {
    ctx.fillStyle = '#FF0000';
    ctx.font = '20px Arial';
    ctx.fillText(`Power Level: ${Math.round(power * 100)}`, 10, 30);
  }

  ctx.restore();
}
