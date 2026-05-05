export type CursorStyle = 'default' | 'crosshair' | 'pointer';

export function setCursor(canvas: HTMLCanvasElement, style: CursorStyle): void {
  canvas.style.cursor = style;
}
