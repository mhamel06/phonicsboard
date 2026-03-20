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

export {
  cvcStarterPlaylist,
  vowelTeamsPlaylist,
  blendItUpPlaylist,
  digraphDashPlaylist,
  rControlledPlaylist,
  suffixSprintPlaylist,
};

export const allPlaylists: Playlist[] = [
  cvcStarterPlaylist,
  vowelTeamsPlaylist,
  blendItUpPlaylist,
  digraphDashPlaylist,
  rControlledPlaylist,
  suffixSprintPlaylist,
];
