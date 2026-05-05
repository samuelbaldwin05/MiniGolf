import { TIMER_WARNING_THRESHOLD } from '../config/constants';

export class Timer {
  private wrapper = document.getElementById('build-timer');
  private display = document.getElementById('timer-display');
  private intervalId: number | null = null;
  remaining = 0;

  start(seconds: number, onExpire: () => void): void {
    this.stop();
    this.remaining = seconds;
    this.render();
    if (this.wrapper) this.wrapper.style.display = 'flex';
    this.intervalId = window.setInterval(() => {
      this.remaining--;
      this.render();
      if (this.remaining <= 0) {
        this.stop();
        onExpire();
      }
    }, 1000);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.wrapper) this.wrapper.style.display = 'none';
  }

  private render(): void {
    if (this.display) this.display.textContent = String(this.remaining);
    if (this.wrapper) {
      if (this.remaining <= TIMER_WARNING_THRESHOLD) this.wrapper.classList.add('warning');
      else this.wrapper.classList.remove('warning');
    }
  }
}
