import { Building } from './Building';
export class Water extends Building {
  readonly type = 'water' as const;
}
