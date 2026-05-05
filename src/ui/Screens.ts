export type ScreenName = 'start' | 'game' | 'win';

export class Screens {
  private start = document.getElementById('start-screen');
  private game = document.getElementById('game-screen');
  private win = document.getElementById('win-screen');

  show(name: ScreenName): void {
    if (this.start) this.start.style.display = name === 'start' ? 'flex' : 'none';
    if (this.game) this.game.style.display = name === 'game' ? 'block' : 'none';
    if (this.win) this.win.style.display = name === 'win' ? 'flex' : 'none';
  }

  setBuildPanelVisible(visible: boolean): void {
    const panel = document.getElementById('build-mode-panel');
    if (panel) panel.style.display = visible ? 'block' : 'none';
  }
}
