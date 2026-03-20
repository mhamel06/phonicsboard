import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setActivePlaylist,
  nextWordAction,
  previousWordAction,
  goToWordAction,
  toggleFocusModeAction,
} from '@/store/playlistsSlice';
import { getCurrentWord } from '@/engine/playlist';
import type { PlaylistWord } from '@/engine/types';

/**
 * Hook for playlist operations.
 * Provides access to all playlists, the active playlist session state,
 * and memoized callbacks for playlist navigation.
 */
export function usePlaylists() {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector((state) => state.playlists.playlists);
  const activePlaylistState = useAppSelector(
    (state) => state.playlists.activePlaylistState,
  );

  const activePlaylist = useMemo(() => {
    if (!activePlaylistState) return null;
    return playlists.find((p) => p.id === activePlaylistState.playlistId) ?? null;
  }, [playlists, activePlaylistState]);

  const selectPlaylist = useCallback(
    (id: string) => {
      const playlist = playlists.find((p) => p.id === id) ?? null;
      dispatch(setActivePlaylist(playlist));
    },
    [playlists, dispatch],
  );

  const next = useCallback(() => {
    if (!activePlaylist) return;
    dispatch(nextWordAction(activePlaylist));
  }, [activePlaylist, dispatch]);

  const previous = useCallback(() => {
    dispatch(previousWordAction());
  }, [dispatch]);

  const goTo = useCallback(
    (index: number) => {
      dispatch(goToWordAction(index));
    },
    [dispatch],
  );

  const toggleFocus = useCallback(() => {
    dispatch(toggleFocusModeAction());
  }, [dispatch]);

  const currentWord: PlaylistWord | null = useMemo(() => {
    if (!activePlaylistState || !activePlaylist) return null;
    try {
      return getCurrentWord(activePlaylistState, activePlaylist);
    } catch {
      return null;
    }
  }, [activePlaylistState, activePlaylist]);

  return useMemo(
    () => ({
      playlists,
      activePlaylistState,
      selectPlaylist,
      next,
      previous,
      goTo,
      toggleFocus,
      currentWord,
    }),
    [
      playlists,
      activePlaylistState,
      selectPlaylist,
      next,
      previous,
      goTo,
      toggleFocus,
      currentWord,
    ],
  );
}
