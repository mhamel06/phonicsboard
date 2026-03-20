import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Playlist, PlaylistState } from '@/engine/types';
import {
  createPlaylistState,
  nextWord,
  previousWord,
  goToWord,
  toggleFocusMode,
  toggleShuffle,
} from '@/engine/playlist';
import { allPlaylists } from '@/data/playlists/index';

// --- State ---

export interface PlaylistsSliceState {
  playlists: Playlist[];
  activePlaylistState: PlaylistState | null;
}

const initialState: PlaylistsSliceState = {
  playlists: allPlaylists,
  activePlaylistState: null,
};

// --- Slice ---

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setPlaylists(state, action: PayloadAction<Playlist[]>) {
      // Merge: preset playlists always use the latest code version (they may
      // have been updated with new words). User-created playlists are kept
      // from the saved data.
      const presetIds = new Set(allPlaylists.map((p) => p.id));
      const userPlaylists = action.payload.filter((p) => !presetIds.has(p.id));
      state.playlists = [...allPlaylists, ...userPlaylists];
    },

    setActivePlaylist(state, action: PayloadAction<Playlist | null>) {
      if (action.payload === null) {
        state.activePlaylistState = null;
        return;
      }
      state.activePlaylistState = createPlaylistState(action.payload);
    },

    nextWordAction(state, action: PayloadAction<Playlist>) {
      if (!state.activePlaylistState) return;
      state.activePlaylistState = nextWord(
        state.activePlaylistState,
        action.payload,
      );
    },

    previousWordAction(state) {
      if (!state.activePlaylistState) return;
      state.activePlaylistState = previousWord(state.activePlaylistState);
    },

    goToWordAction(state, action: PayloadAction<number>) {
      if (!state.activePlaylistState) return;
      state.activePlaylistState = goToWord(
        state.activePlaylistState,
        action.payload,
      );
    },

    toggleFocusModeAction(state) {
      if (!state.activePlaylistState) return;
      state.activePlaylistState = toggleFocusMode(state.activePlaylistState);
    },

    toggleShuffleAction(state, action: PayloadAction<Playlist>) {
      if (!state.activePlaylistState) return;
      state.activePlaylistState = toggleShuffle(
        state.activePlaylistState,
        action.payload,
      );
    },

    addPlaylist(state, action: PayloadAction<Playlist>) {
      state.playlists.push(action.payload);
    },

    updatePlaylist(state, action: PayloadAction<Playlist>) {
      const index = state.playlists.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = action.payload;
      }
    },

    deletePlaylist(state, action: PayloadAction<string>) {
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
      // Clear active state if the deleted playlist was active
      if (state.activePlaylistState?.playlistId === action.payload) {
        state.activePlaylistState = null;
      }
    },
  },
});

export const {
  setPlaylists,
  setActivePlaylist,
  nextWordAction,
  previousWordAction,
  goToWordAction,
  toggleFocusModeAction,
  toggleShuffleAction,
  addPlaylist,
  updatePlaylist,
  deletePlaylist,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
