import { useCallback, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { toggleAudio as toggleAudioAction } from '@/store/settingsSlice';

/**
 * Hook for audio playback (stub implementation).
 * Logs to console for now; actual audio files will be added later.
 */
export function useAudio() {
  const dispatch = useAppDispatch();
  const audioEnabled = useAppSelector((state) => state.settings.audioEnabled);
  const [isPlaying, setIsPlaying] = useState(false);

  const playPhoneme = useCallback(
    (text: string) => {
      if (!audioEnabled) return;
      // eslint-disable-next-line no-console
      console.log(`[Audio] Playing phoneme: "${text}"`);
      setIsPlaying(true);
      // Simulate brief playback duration
      setTimeout(() => setIsPlaying(false), 300);
    },
    [audioEnabled],
  );

  const playWord = useCallback(
    (graphemes: string[]) => {
      if (!audioEnabled) return;
      const word = graphemes.join('');
      // eslint-disable-next-line no-console
      console.log(`[Audio] Playing word: "${word}" [${graphemes.join(', ')}]`);
      setIsPlaying(true);
      // Simulate playback duration based on grapheme count
      setTimeout(() => setIsPlaying(false), graphemes.length * 300);
    },
    [audioEnabled],
  );

  const toggleAudio = useCallback(() => {
    dispatch(toggleAudioAction());
  }, [dispatch]);

  return useMemo(
    () => ({
      playPhoneme,
      playWord,
      isPlaying,
      audioEnabled,
      toggleAudio,
    }),
    [playPhoneme, playWord, isPlaying, audioEnabled, toggleAudio],
  );
}
