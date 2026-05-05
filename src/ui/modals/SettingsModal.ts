import type { AudioManager } from '../../audio/AudioManager';
import type { GameMode } from '../../core/types';

export interface SettingsHandlers {
  onClick: () => void;
  onRestartHole: () => void;
  onExitToMenu: () => void;
}

export class SettingsModal {
  private modal = document.getElementById('settings-modal');

  constructor(private audio: AudioManager, handlers: SettingsHandlers) {
    document.getElementById('close-settings')?.addEventListener('click', () => { handlers.onClick(); this.hide(); });
    document.getElementById('close-settings-btn')?.addEventListener('click', () => { handlers.onClick(); this.hide(); });
    this.modal?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'settings-modal') this.hide();
    });

    document.getElementById('restart-round-btn')?.addEventListener('click', () => {
      handlers.onClick();
      handlers.onRestartHole();
      this.hide();
    });

    document.getElementById('face-off-exit-btn')?.addEventListener('click', () => {
      handlers.onClick();
      handlers.onExitToMenu();
      this.hide();
    });
    document.getElementById('courses-exit-btn')?.addEventListener('click', () => {
      handlers.onClick();
      handlers.onExitToMenu();
      this.hide();
    });

    this.bindVolumeSlider('sound-volume', 'volume-display');
    this.bindVolumeSlider('sound-volume-courses', 'volume-display-courses');

    this.syncVolumeUI();
  }

  private bindVolumeSlider(sliderId: string, displayId: string): void {
    const slider = document.getElementById(sliderId) as HTMLInputElement | null;
    const display = document.getElementById(displayId);
    if (!slider) return;
    slider.value = String(Math.round(this.audio.volume * 100));
    if (display) display.textContent = `${Math.round(this.audio.volume * 100)}%`;
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10);
      if (isNaN(v)) return;
      this.audio.setVolume(v / 100);
      this.syncVolumeUI();
    });
  }

  syncVolumeUI(): void {
    const pct = Math.round(this.audio.volume * 100);
    for (const id of ['sound-volume', 'sound-volume-courses']) {
      const s = document.getElementById(id) as HTMLInputElement | null;
      if (s) s.value = String(pct);
    }
    for (const id of ['volume-display', 'volume-display-courses']) {
      const d = document.getElementById(id);
      if (d) d.textContent = `${pct}%`;
    }
  }

  show(): void {
    if (this.modal) this.modal.style.display = 'flex';
  }

  hide(): void {
    if (this.modal) this.modal.style.display = 'none';
  }

  updateModeUI(mode: GameMode): void {
    const faceOff = document.getElementById('face-off-settings');
    const courses = document.getElementById('courses-settings');
    const faceExit = document.getElementById('face-off-exit-btn');
    const coursesExit = document.getElementById('courses-exit-btn');
    const restartBtn = document.getElementById('restart-round-btn');
    if (mode === 'premade') {
      if (faceOff) faceOff.style.display = 'none';
      if (courses) courses.style.display = 'block';
      if (faceExit) faceExit.style.display = 'none';
      if (coursesExit) coursesExit.style.display = 'block';
      if (restartBtn) restartBtn.style.display = 'none';
    } else {
      if (faceOff) faceOff.style.display = 'block';
      if (courses) courses.style.display = 'none';
      if (faceExit) faceExit.style.display = 'block';
      if (coursesExit) coursesExit.style.display = 'none';
      if (restartBtn) restartBtn.style.display = 'block';
    }
  }
}
