import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useAppSelector } from '@/store/store';
import { APP_COLORS } from '@/utils/colors';

/** Map preset id to a Feather icon name */
function getPresetIcon(id: string): React.ComponentProps<typeof Feather>['name'] {
  if (id.includes('az')) return 'type';
  if (id.includes('advanced')) return 'star';
  return 'grid';
}

/** Derive a short description from the preset's keyboard groups */
function getPresetDescription(preset: { keyboard: { tiles: unknown[] }[] }): string {
  const groupCount = preset.keyboard.length;
  const tileCount = preset.keyboard.reduce((sum, g) => sum + g.tiles.length, 0);
  return `${groupCount} groups, ${tileCount} tiles`;
}

export default function WordMatsScreen() {
  const router = useRouter();
  const { presets } = useAppSelector((state) => state.wordMats);

  return (
    <View style={styles.container}>
      <FlatList
        data={presets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Word Mats</Text>
            <Text style={styles.subtitle}>
              Drag-and-drop tile boards for spelling practice
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/word-mat/${item.id}`)}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Open word mat: ${item.name}`}
          >
            <View style={styles.iconContainer}>
              <Feather
                name={getPresetIcon(item.id)}
                size={28}
                color={APP_COLORS.primary}
              />
            </View>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {getPresetDescription(item)}
            </Text>
          </Pressable>
        )}
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: APP_COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: APP_COLORS.textSecondary,
    marginTop: 4,
  },
  row: {
    paddingHorizontal: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
