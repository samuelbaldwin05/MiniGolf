import { Vector2D } from '../core/Vector2D';
import type { BoundingBox } from '../core/types';

export interface RotatedRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface CircleBody {
  position: Vector2D;
  radius: number;
}

export function getClosestPointOnRect(
  rect: RotatedRect,
  ball: CircleBody,
  padding = 0,
): Vector2D {
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const expandedW = rect.width + 2 * padding;
  const expandedH = rect.height + 2 * padding;

  if (rect.rotation === 0) {
    const minX = centerX - expandedW / 2;
    const minY = centerY - expandedH / 2;
    const maxX = centerX + expandedW / 2;
    const maxY = centerY + expandedH / 2;
    const cx = Math.max(minX, Math.min(ball.position.x, maxX));
    const cy = Math.max(minY, Math.min(ball.position.y, maxY));
    return new Vector2D(cx, cy);
  }

  const angle = -rect.rotation * Math.PI / 180;
  const relX = ball.position.x - centerX;
  const relY = ball.position.y - centerY;
  const rotatedX = relX * Math.cos(angle) - relY * Math.sin(angle);
  const rotatedY = relX * Math.sin(angle) + relY * Math.cos(angle);

  const closestLocalX = Math.max(-expandedW / 2, Math.min(rotatedX, expandedW / 2));
  const closestLocalY = Math.max(-expandedH / 2, Math.min(rotatedY, expandedH / 2));

  const back = rect.rotation * Math.PI / 180;
  const wx = closestLocalX * Math.cos(back) - closestLocalY * Math.sin(back);
  const wy = closestLocalX * Math.sin(back) + closestLocalY * Math.cos(back);
  return new Vector2D(wx + centerX, wy + centerY);
}

export function rectIntersectsBall(
  rect: RotatedRect,
  ball: CircleBody,
  padding = 0,
): boolean {
  const closest = getClosestPointOnRect(rect, ball, padding);
  const dx = ball.position.x - closest.x;
  const dy = ball.position.y - closest.y;
  return dx * dx + dy * dy < ball.radius * ball.radius;
}

export function getBoundingBox(rect: RotatedRect, padding = 0): BoundingBox {
  if (rect.rotation === 0) {
    return {
      left: rect.x - padding,
      right: rect.x + rect.width + padding,
      top: rect.y - padding,
      bottom: rect.y + rect.height + padding,
    };
  }
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const angle = rect.rotation * Math.PI / 180;
  const corners = [
    { x: -rect.width / 2, y: -rect.height / 2 },
    { x: rect.width / 2, y: -rect.height / 2 },
    { x: rect.width / 2, y: rect.height / 2 },
    { x: -rect.width / 2, y: rect.height / 2 },
  ];
  const xs: number[] = [];
  const ys: number[] = [];
  for (const c of corners) {
    const rx = c.x * Math.cos(angle) - c.y * Math.sin(angle);
    const ry = c.x * Math.sin(angle) + c.y * Math.cos(angle);
    xs.push(rx + centerX);
    ys.push(ry + centerY);
  }
  return {
    left: Math.min(...xs) - padding,
    right: Math.max(...xs) + padding,
    top: Math.min(...ys) - padding,
    bottom: Math.max(...ys) + padding,
  };
}

export function reflectVelocity(velocity: Vector2D, normal: Vector2D, restitution: number): Vector2D {
  const dot = velocity.x * normal.x + velocity.y * normal.y;
  const reflected = new Vector2D(
    velocity.x - 2 * dot * normal.x,
    velocity.y - 2 * dot * normal.y,
  );
  return reflected.multiply(restitution);
}
