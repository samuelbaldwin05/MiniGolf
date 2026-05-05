import type { TileType } from '../../core/types';
import { Vector2D } from '../../core/Vector2D';
import type { Ball } from '../../physics/Ball';
import type { Hole } from '../../entities/Hole';
import type { Building } from '../../entities/buildings/Building';
import { Wall } from '../../entities/buildings/Wall';
import { Sand } from '../../entities/buildings/Sand';
import { TallGrass } from '../../entities/buildings/TallGrass';
import { Water } from '../../entities/buildings/Water';
import { Ice } from '../../entities/buildings/Ice';
import { Selection } from './Selection';
import { UndoStack } from './UndoStack';
import { computePlacementRect, rectOverlapsHole } from './Placement';
import { rectOverlapsBall } from './placementRules';
import { MIN_BUILDING_SIZE, WALL_Z_INDEX_BASE } from '../../config/constants';

export class BuildMode {
  currentType: TileType = 'wall';
  selection = new Selection();
  undo = new UndoStack();
  isBuilding = false;
  isMovingBuilding = false;
  movingBuilding: Building | null = null;
  movingOffset = new Vector2D(0, 0);
  buildStart = new Vector2D(0, 0);
  buildEnd = new Vector2D(0, 0);

  constructor(public walls: Building[]) {}

  setWalls(walls: Building[]): void {
    this.walls = walls;
  }

  beginBuild(p: Vector2D): void {
    this.isBuilding = true;
    this.buildStart = p.clone();
    this.buildEnd = p.clone();
  }

  updateBuild(p: Vector2D): void {
    this.buildEnd = p.clone();
  }

  /** Place the building if valid; returns the building or null. */
  finishBuild(ball: Ball, hole: Hole): Building | null {
    if (!this.isBuilding) return null;
    this.isBuilding = false;
    const rect = computePlacementRect(this.buildStart, this.buildEnd);
    if (rect.width < MIN_BUILDING_SIZE || rect.height < MIN_BUILDING_SIZE) return null;
    if (rectOverlapsBall(rect, ball)) return null;
    if (rectOverlapsHole(rect, hole)) return null;

    const b = this.makeBuilding(this.currentType, rect.startX, rect.startY, rect.width, rect.height);
    if (!b) return null;
    this.assignZIndex(b);
    this.walls.push(b);
    this.undo.push(b);
    return b;
  }

  cancelBuild(): void {
    this.isBuilding = false;
  }

  beginMove(b: Building, p: Vector2D): void {
    this.isMovingBuilding = true;
    this.movingBuilding = b;
    this.movingOffset = new Vector2D(p.x - b.x, p.y - b.y);
  }

  updateMove(p: Vector2D): void {
    const b = this.movingBuilding;
    if (!b) return;
    b.x = p.x - this.movingOffset.x;
    b.y = p.y - this.movingOffset.y;
    this.assignZIndex(b);
  }

  endMove(): void {
    this.isMovingBuilding = false;
    this.movingBuilding = null;
    this.movingOffset = new Vector2D(0, 0);
  }

  undoLast(): void {
    const b = this.undo.pop();
    if (!b) return;
    const idx = this.walls.indexOf(b);
    if (idx !== -1) this.walls.splice(idx, 1);
  }

  deleteSelected(): void {
    const sel = this.selection.selected;
    if (!sel) return;
    const idx = this.walls.indexOf(sel);
    if (idx !== -1) this.walls.splice(idx, 1);
    this.selection.clear();
  }

  /** Topmost building at canvas point (highest zIndex). */
  buildingAt(x: number, y: number): Building | null {
    let best: Building | null = null;
    let bestZ = -Infinity;
    for (const b of this.walls) {
      const bb = b.getBoundingBox();
      if (bb.left <= x && bb.right >= x && bb.top <= y && bb.bottom >= y) {
        if (b.zIndex > bestZ) {
          bestZ = b.zIndex;
          best = b;
        }
      }
    }
    return best;
  }

  /** Bring building to top of its category for layering. */
  assignZIndex(b: Building): void {
    if (b.type === 'wall') {
      const maxZ = this.walls.length > 0
        ? Math.max(...this.walls.map(w => w.zIndex))
        : WALL_Z_INDEX_BASE - 1;
      b.zIndex = Math.max(maxZ, WALL_Z_INDEX_BASE - 1) + 1;
    } else {
      const same = this.walls.filter(w => w.type === b.type);
      const maxZ = same.length > 0 ? Math.max(...same.map(w => w.zIndex)) : 0;
      b.zIndex = maxZ + 1;
    }
  }

  private makeBuilding(type: TileType, x: number, y: number, w: number, h: number): Building | null {
    switch (type) {
      case 'wall': return new Wall(x, y, w, h);
      case 'sand': return new Sand(x, y, w, h);
      case 'tallGrass': return new TallGrass(x, y, w, h);
      case 'water': return new Water(x, y, w, h);
      case 'ice': return new Ice(x, y, w, h);
      default: return null;
    }
  }
}
