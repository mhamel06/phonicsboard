import React from 'react';
import { Tabs } from 'expo-router';

import AuthButton from '@/components/common/AuthButton';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2D6A4F',
        headerStyle: { backgroundColor: '#FFF8F0' },
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        headerRight: () => <AuthButton />,
        headerRightContainerStyle: { paddingRight: 12 },
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
