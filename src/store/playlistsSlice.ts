import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Playlist, PlaylistState } from '@/engine/types';
import {
  createPlaylistState,
  nextWord,
  previousWord,
  goToWord,
  toggleFocusMode,
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
      state.playlists = action.payload;
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

    addPlaylist(state, action: PayloadAction<Playlist>) {
      state.playlists.push(action.payload);
    },

    updatePlaylist(state, action: PayloadAction<Playlist>) {
      const index = state.playlists.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = action.payload;
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
  addPlaylist,
  updatePlaylist,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
