export class Message {
  private el: HTMLElement | null;

  constructor() {
    this.el = document.getElementById('message');
  }

  show(text: string): void {
    if (this.el) this.el.textContent = text;
  }
}
