import type { Building } from '../../entities/buildings/Building';

export class UndoStack {
  private stack: Building[] = [];

  push(b: Building): void {
    this.stack.push(b);
  }

  pop(): Building | undefined {
    return this.stack.pop();
  }

  clear(): void {
    this.stack = [];
  }
}
