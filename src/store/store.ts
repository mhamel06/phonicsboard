import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import decksReducer from './decksSlice';
import playlistsReducer from './playlistsSlice';
import wordMatsReducer from './wordMatsSlice';
import settingsReducer from './settingsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    decks: decksReducer,
    playlists: playlistsReducer,
    wordMats: wordMatsReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
