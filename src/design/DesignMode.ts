import { BuildMode } from './build/BuildMode';
import { RotationHandle } from './Rotation';
import type { Building } from '../entities/buildings/Building';

/**
 * Top-level controller for the design phase. Wraps BuildMode + RotationHandle.
 */
export class DesignMode {
  build: BuildMode;
  rotation: RotationHandle;

  ballMovable = true;
  holeMovable = true;

  constructor(walls: Building[], canvas: HTMLCanvasElement) {
    this.build = new BuildMode(walls);
    this.rotation = new RotationHandle(canvas, () => { /* started */ });
  }

  setWalls(walls: Building[]): void {
    this.build.setWalls(walls);
  }

  selectBuilding(b: Building | null): void {
    this.build.selection.select(b);
    if (b) this.rotation.show(b);
    else this.rotation.hide();
  }

  clearSelection(): void {
    this.build.selection.clear();
    this.rotation.hide();
  }
}
