import type { WordMatPreset } from '../../engine/types';

export { azTilesPreset } from './az-tiles';
export { advancedSoundsPreset } from './advanced-sounds';
export { phonemesOnlyPreset } from './phonemes-only';
export { schwaFocusPreset } from './schwa-focus';

import { azTilesPreset } from './az-tiles';
import { advancedSoundsPreset } from './advanced-sounds';
import { phonemesOnlyPreset } from './phonemes-only';
import { schwaFocusPreset } from './schwa-focus';

export const allWordMatPresets: WordMatPreset[] = [
  azTilesPreset,
  advancedSoundsPreset,
  phonemesOnlyPreset,
  schwaFocusPreset,
];
