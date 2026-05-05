import type { TileType } from '../core/types';

export interface BuildPanelHandlers {
  onSelectType: (t: TileType) => void;
  onUndo: () => void;
  onDelete: () => void;
  onDone: () => void;
}

const OPTION_IDS: Record<TileType, string> = {
  wall: 'wall-option',
  sand: 'sand-option',
  tallGrass: 'tall-grass-option',
  water: 'water-option',
  ice: 'ice-option',
};

export class BuildPanel {
  constructor(private handlers: BuildPanelHandlers) {
    for (const t of Object.keys(OPTION_IDS) as TileType[]) {
      const el = document.getElementById(OPTION_IDS[t]);
      if (el) el.addEventListener('click', () => this.handlers.onSelectType(t));
    }
    document.getElementById('undo-btn')?.addEventListener('click', () => this.handlers.onUndo());
    document.getElementById('delete-btn')?.addEventListener('click', () => this.handlers.onDelete());
    document.getElementById('done-building-btn')?.addEventListener('click', () => this.handlers.onDone());
  }

  setActive(type: TileType): void {
    for (const t of Object.keys(OPTION_IDS) as TileType[]) {
      const el = document.getElementById(OPTION_IDS[t]);
      if (!el) continue;
      if (t === type) el.classList.add('active');
      else el.classList.remove('active');
    }
  }
}
