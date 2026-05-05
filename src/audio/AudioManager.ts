import { DEFAULT_VOLUME, VOLUME_STORAGE_KEY } from '../config/constants';

export type SoundName = 'hit' | 'water' | 'hole' | 'click';

export class AudioManager {
  private sounds: Record<SoundName, HTMLAudioElement | null> = {
    hit: null,
    water: null,
    hole: null,
    click: null,
  };
  private _volume = DEFAULT_VOLUME;

  constructor() {
    this.sounds.hit = document.getElementById('ball-hit-sound') as HTMLAudioElement | null;
    this.sounds.water = document.getElementById('water-splash-sound') as HTMLAudioElement | null;
    this.sounds.hole = document.getElementById('hole-success-sound') as HTMLAudioElement | null;
    this.sounds.click = document.getElementById('button-click-sound') as HTMLAudioElement | null;

    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (saved !== null) {
      const v = parseFloat(saved);
      if (!isNaN(v)) this._volume = Math.max(0, Math.min(1, v));
    }
    this.applyVolume();
  }

  get volume(): number {
    return this._volume;
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v));
    this.applyVolume();
    localStorage.setItem(VOLUME_STORAGE_KEY, this._volume.toString());
  }

  private applyVolume(): void {
    for (const key of Object.keys(this.sounds) as SoundName[]) {
      const el = this.sounds[key];
      if (el) el.volume = this._volume;
    }
  }

  play(name: SoundName): void {
    if (this._volume <= 0) return;
    const el = this.sounds[name];
    if (!el) return;
    try {
      el.currentTime = 0;
      el.volume = this._volume;
      el.play().catch(() => { /* autoplay blocked */ });
    } catch {
      /* ignore */
    }
  }
}
