export type TileType = 'wall' | 'sand' | 'tallGrass' | 'water' | 'ice';

export type GameState = 'start' | 'design' | 'play' | 'win';
export type Phase = 'design' | 'play';
export type GameMode = 'custom' | 'premade';
export type PlayerMode = 'single' | 'multiplayer';
export type CourseId = 'test' | 'beginner' | 'advanced';
export type PlayerNumber = 1 | 2;

export interface Point {
  x: number;
  y: number;
}

export interface BuildingData {
  type: TileType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface HoleData {
  name: string;
  ballPosition: Point;
  holePosition: Point;
  walls: BuildingData[];
}

export interface Course {
  name: string;
  holes: number;
  courses: HoleData[];
}

export interface BoundingBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
