import { Wall } from './buildings/Wall';
import { CANVAS_WIDTH, CANVAS_HEIGHT, WALL_THICKNESS } from '../config/constants';

export function createBoundaryWalls(): Wall[] {
  return [
    new Wall(0, 0, CANVAS_WIDTH, WALL_THICKNESS),
    new Wall(0, CANVAS_HEIGHT - WALL_THICKNESS, CANVAS_WIDTH, WALL_THICKNESS),
    new Wall(0, 0, WALL_THICKNESS, CANVAS_HEIGHT),
    new Wall(CANVAS_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, CANVAS_HEIGHT),
  ];
}
