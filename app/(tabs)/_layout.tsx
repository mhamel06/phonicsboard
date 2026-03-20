import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2D6A4F',
        headerStyle: { backgroundColor: '#FFF8F0' },
        tabBarStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Decks',
        }}
      />
      <Tabs.Screen
        name="playlists"
        options={{
          title: 'Playlists',
        }}
      />
      <Tabs.Screen
        name="word-mats"
        options={{
          title: 'Word Mats',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
        }}
      />
    </Tabs>
  );
}
