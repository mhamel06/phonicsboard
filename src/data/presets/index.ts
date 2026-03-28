import type { Deck } from '../../engine/types';

export { separatedBlendsDeck } from './separated-blends';
export { combinedBlendsDeck } from './combined-blends';
export { morphologyDeck } from './morphology';

import { separatedBlendsDeck } from './separated-blends';
import { combinedBlendsDeck } from './combined-blends';
import { morphologyDeck } from './morphology';

export const allDecks: Deck[] = [
  separatedBlendsDeck,
  combinedBlendsDeck,
  morphologyDeck,
];
