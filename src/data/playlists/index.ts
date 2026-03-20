/**
 * Barrel export for all preset playlists.
 */

import type { Playlist } from '@/engine/types';

import { cvcStarterPlaylist } from './cvc-starter';
import { vowelTeamsPlaylist } from './vowel-teams';
import { blendItUpPlaylist } from './blend-it-up';
import { digraphDashPlaylist } from './digraph-dash';
import { rControlledPlaylist } from './r-controlled';
import { suffixSprintPlaylist } from './suffix-sprint';
import { openSyllablesPlaylist } from './open-syllables';
import { twoSyllableClosedClosedPlaylist } from './two-syllable-closed-closed';
import { twoSyllableOpenClosedPlaylist } from './two-syllable-open-closed';
import { closedSyllableExceptionsPlaylist } from './closed-syllable-exceptions';

export {
  cvcStarterPlaylist,
  vowelTeamsPlaylist,
  blendItUpPlaylist,
  digraphDashPlaylist,
  rControlledPlaylist,
  suffixSprintPlaylist,
  openSyllablesPlaylist,
  twoSyllableClosedClosedPlaylist,
  twoSyllableOpenClosedPlaylist,
  closedSyllableExceptionsPlaylist,
};

export const allPlaylists: Playlist[] = [
  cvcStarterPlaylist,
  vowelTeamsPlaylist,
  blendItUpPlaylist,
  digraphDashPlaylist,
  rControlledPlaylist,
  suffixSprintPlaylist,
  openSyllablesPlaylist,
  twoSyllableClosedClosedPlaylist,
  twoSyllableOpenClosedPlaylist,
  closedSyllableExceptionsPlaylist,
];
