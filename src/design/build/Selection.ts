import type { Building } from '../../entities/buildings/Building';
import {
  SELECTION_OUTLINE_COLOR,
  SELECTION_OUTLINE_WIDTH,
} from '../../config/constants';

export class Selection {
  selected: Building | null = null;

  select(b: Building | null): void {
    this.selected = b;
  }

  clear(): void {
    this.selected = null;
  }

  drawOutline(ctx: CanvasRenderingContext2D, b: Building): void {
    ctx.strokeStyle = SELECTION_OUTLINE_COLOR;
    ctx.lineWidth = SELECTION_OUTLINE_WIDTH;
    if (b.rotation === 0) {
      ctx.strokeRect(b.x - 2, b.y - 2, b.width + 4, b.height + 4);
    } else {
      ctx.save();
      ctx.translate(b.x + b.width / 2, b.y + b.height / 2);
      ctx.rotate(b.rotation * Math.PI / 180);
      ctx.strokeRect(-b.width / 2 - 2, -b.height / 2 - 2, b.width + 4, b.height + 4);
      ctx.restore();
    }
  }
}
