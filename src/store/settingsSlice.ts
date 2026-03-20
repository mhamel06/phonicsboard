import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// --- State ---

export interface SettingsState {
  audioEnabled: boolean;
  focusModeDefault: boolean;
  theme: 'light' | 'dark';
}

const initialState: SettingsState = {
  audioEnabled: true,
  focusModeDefault: false,
  theme: 'light',
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
  },
});

export const { toggleAudio, toggleFocusDefault, setTheme } =
  settingsSlice.actions;

export default settingsSlice.reducer;
