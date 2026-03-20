import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// --- State ---

export interface SettingsState {
  audioEnabled: boolean;
  focusModeDefault: boolean;
  theme: 'light' | 'dark';
  /** Display scale factor for projector/classroom use (0.5 – 2.0) */
  displayScale: number;
}

const initialState: SettingsState = {
  audioEnabled: true,
  focusModeDefault: false,
  theme: 'light',
  displayScale: 1.0,
};

// --- Slice ---

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleAudio(state) {
      state.audioEnabled = !state.audioEnabled;
    },
    toggleFocusDefault(state) {
      state.focusModeDefault = !state.focusModeDefault;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setDisplayScale(state, action: PayloadAction<number>) {
      state.displayScale = Math.max(0.5, Math.min(2.0, action.payload));
    },
  },
});

export const { toggleAudio, toggleFocusDefault, setTheme, setDisplayScale } =
  settingsSlice.actions;

export default settingsSlice.reducer;
