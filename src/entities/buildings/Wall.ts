import { Building } from './Building';
import { HITBOX_PADDING } from '../../config/constants';

export class Wall extends Building {
  readonly type = 'wall' as const;
  override hitboxPadding = HITBOX_PADDING;
}
