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
