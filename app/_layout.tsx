import { Stack } from 'expo-router';
import { Provider } from 'react-redux';

import { store } from '@/store/store';
import { usePersistence } from '@/hooks/usePersistence';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useAuth } from '@/hooks/useAuth';

function AppShell() {
  // Initialize auth state listener
  useAuth();
  // Load persisted local data (decks, playlists, settings)
  usePersistence();
  // Sync to cloud when authenticated (no-ops in guest mode)
  useCloudSync();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="deck/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="deck/editor/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="playlist/editor/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="word-mat/[preset]" options={{ headerShown: false }} />
      <Stack.Screen name="share/[code]" options={{ title: 'Import Shared Resource' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
