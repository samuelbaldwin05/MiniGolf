export class RulesModal {
  private modal = document.getElementById('rules-modal');

  constructor(onClick: () => void) {
    document.getElementById('close-rules')?.addEventListener('click', () => { onClick(); this.hide(); });
    document.getElementById('close-rules-btn')?.addEventListener('click', () => { onClick(); this.hide(); });
    this.modal?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'rules-modal') this.hide();
    });
  }

  show(): void {
    if (this.modal) this.modal.style.display = 'flex';
  }

  hide(): void {
    if (this.modal) this.modal.style.display = 'none';
  }
}
