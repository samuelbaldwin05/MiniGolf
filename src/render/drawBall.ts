import type { Ball } from '../physics/Ball';

export function drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
  if (ball.isInHole) return;
  ctx.beginPath();
  ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawHole(ctx: CanvasRenderingContext2D, hole: { position: { x: number; y: number }; radius: number }): void {
  ctx.beginPath();
  ctx.arc(hole.position.x, hole.position.y, hole.radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.stroke();
}
