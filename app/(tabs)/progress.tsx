import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';

interface StatCardProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <View style={statStyles.card}>
      <View style={[statStyles.iconContainer, { backgroundColor: color + '20' }]}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: APP_COLORS.textPrimary,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default function ProgressScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Coming Soon banner */}
      <View style={styles.comingSoon}>
        <View style={styles.comingSoonIcon}>
          <Feather name="bar-chart-2" size={48} color={APP_COLORS.primary} />
        </View>
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonMessage}>
          Track student progress across sessions
        </Text>
      </View>

      {/* Placeholder stat cards */}
      <View style={styles.statsRow}>
        <StatCard
          icon="book-open"
          label="Words Blended"
          value="--"
          color={APP_COLORS.primary}
        />
        <StatCard
          icon="edit-3"
          label="Words Spelled"
          value="--"
          color={APP_COLORS.secondary}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="zap"
          label="Current Streak"
          value="--"
          color={APP_COLORS.accent}
        />
        <StatCard
          icon="target"
          label="Accuracy"
          value="--"
          color="#2A9D8F"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 24,
  },
  comingSoonIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: APP_COLORS.textPrimary,
    marginBottom: 8,
  },
  comingSoonMessage: {
    fontSize: 15,
    color: APP_COLORS.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});
