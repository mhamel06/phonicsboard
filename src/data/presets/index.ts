import type { Deck } from '../../engine/types';

export { separatedBlendsDeck } from './separated-blends';
export { combinedBlendsDeck } from './combined-blends';

import { separatedBlendsDeck } from './separated-blends';
import { combinedBlendsDeck } from './combined-blends';

export const allDecks: Deck[] = [
  separatedBlendsDeck,
  combinedBlendsDeck,
];
