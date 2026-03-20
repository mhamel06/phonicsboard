import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppSelector } from '@/store/store';
import DeckCard from '@/components/deck/DeckCard';
import ShareButton from '@/components/common/ShareButton';
import SearchFilter from '@/components/common/SearchFilter';
import Button from '@/components/common/Button';
import { APP_COLORS } from '@/utils/colors';

export default function DecksScreen() {
  const router = useRouter();
  const { decks } = useAppSelector((state) => state.decks);
  const [search, setSearch] = useState('');

  const filtered = decks.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>My Decks</Text>
            <Text style={styles.subtitle}>
              Phonics tile decks for blending practice
            </Text>

            <View style={styles.searchRow}>
              <View style={styles.searchWrapper}>
                <SearchFilter
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search decks..."
                />
              </View>
              <Button
                title="+ New Deck"
                onPress={() => {}}
                variant="primary"
                size="small"
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <View style={styles.cardWrapper}>
              <DeckCard
                deck={item}
                onPress={() => router.push(`/deck/${item.id}`)}
              />
            </View>
            <View style={styles.shareButtonContainer}>
              <ShareButton
                resourceType="deck"
                resourceId={item.id}
              />
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Free for educators — unlimited decks and students
            </Text>
          </View>
        }
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
  },
  subtitle: {
    fontSize: 15,
    color: APP_COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  searchWrapper: {
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  cardWrapper: {
    flex: 1,
  },
  shareButtonContainer: {
    paddingRight: 16,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_COLORS.primary,
  },
});
