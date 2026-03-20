import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { addPlaylist, deletePlaylist } from '@/store/playlistsSlice';
import PlaylistCard from '@/components/playlist/PlaylistCard';
import ShareButton from '@/components/common/ShareButton';
import SearchFilter from '@/components/common/SearchFilter';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ImportDialog from '@/components/common/ImportDialog';
import { APP_COLORS } from '@/utils/colors';

type SubTab = 'library' | 'mine';

export default function PlaylistsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { playlists } = useAppSelector((state) => state.playlists);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<SubTab>('library');
  const [importVisible, setImportVisible] = useState(false);

  const filtered = playlists.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const libraryPlaylists = filtered.filter((p) => p.isPreset);
  const myPlaylists = filtered.filter((p) => !p.isPreset);

  const displayedPlaylists =
    activeTab === 'library' ? libraryPlaylists : myPlaylists;

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedPlaylists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Playlists</Text>

            <View style={styles.searchRow}>
              <View style={styles.searchWrapper}>
                <SearchFilter
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search playlists..."
                />
              </View>
              <Button
                title="+ New Playlist"
                onPress={() => router.push('/playlist/editor/new')}
                variant="primary"
                size="small"
              />
            </View>

            {/* Import from share code */}
            <View style={styles.importRow}>
              <Button
                title="Import from Code"
                onPress={() => setImportVisible(true)}
                variant="secondary"
                size="small"
                icon="download"
              />
            </View>

            {/* Sub-tabs */}
            <View style={styles.tabs}>
              <Pressable
                onPress={() => setActiveTab('library')}
                style={[
                  styles.tab,
                  activeTab === 'library' && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'library' && styles.tabTextActive,
                  ]}
                >
                  Blend Library
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('mine')}
                style={[
                  styles.tab,
                  activeTab === 'mine' && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'mine' && styles.tabTextActive,
                  ]}
                >
                  My Playlists
                </Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.playlistRow}>
            <View style={styles.playlistCardWrapper}>
              <PlaylistCard
                playlist={item}
                onPlay={() => router.push(`/playlist/${item.id}`)}
                onEdit={() => router.push(`/playlist/editor/${item.id}`)}
                onCopy={() => {
                  dispatch(
                    addPlaylist({
                      ...item,
                      id: `playlist-${Date.now()}`,
                      name: `${item.name} (Copy)`,
                      isPreset: false,
                      createdAt: new Date().toISOString(),
                    }),
                  );
                }}
                onDelete={
                  !item.isPreset
                    ? () => {
                        Alert.alert(
                          'Delete Playlist',
                          `Are you sure you want to delete "${item.name}"?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => dispatch(deletePlaylist(item.id)),
                            },
                          ],
                        );
                      }
                    : undefined
                }
              />
            </View>
            <View style={styles.shareButtonContainer}>
              <ShareButton
                resourceType="playlist"
                resourceId={item.id}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          activeTab === 'mine' ? (
            <EmptyState
              title="No Custom Playlists"
              message="Create your own playlists to practice specific word sets with your students."
              actionLabel="Create Playlist"
              onAction={() => router.push('/playlist/editor/new')}
            />
          ) : null
        }
      />

      <ImportDialog
        visible={importVisible}
        onClose={() => setImportVisible(false)}
        onImport={(code) => {
          // TODO: look up share code and import the playlist/deck
          console.log('Importing share code:', code);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: APP_COLORS.textPrimary,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchWrapper: {
    flex: 1,
  },
  importRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistCardWrapper: {
    flex: 1,
  },
  shareButtonContainer: {
    paddingRight: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: APP_COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: APP_COLORS.textSecondary,
  },
  tabTextActive: {
    color: APP_COLORS.textPrimary,
    fontWeight: '600',
  },
});
