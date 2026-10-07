import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getSavedWalks } from '../storage/walks';
import type { WalkSummary } from '../storage/walks';
import { colors } from '../theme/colors';

export default function HistoryScreen() {
  const [walks, setWalks] = useState<WalkSummary[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadWalks() {
      try {
        const saved = await getSavedWalks();

        if (!cancelled) setWalks(saved);
      } catch {
        if (!cancelled) setError('Could not load your walks.');
      }
    }

    loadWalks();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <Text style={styles.message}>{error}</Text>;
  }

  if (walks === null) {
    return <Text style={styles.message}>Loading your walks…</Text>;
  }

  return (
    <View>
      <Text style={styles.title}>Your little journeys 🌱</Text>

      {walks.length === 0 && (
        <Text style={styles.message}>
          Your first saved walk will appear here.
        </Text>
      )}

      {walks.map((walk) => (
        <View key={walk.id} style={styles.card}>
          <Text style={styles.cardTitle}>Walk #{walk.id}</Text>

          <Text style={styles.details}>
            {new Date(walk.saved_at).toLocaleString()}
          </Text>

          <Text style={styles.details}>
            {Math.round(walk.distance_meters)} m
            {' · '}
            {Math.floor(walk.duration_seconds / 60)} min
            {' '}
            {walk.duration_seconds % 60} sec
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  message: {
    color: colors.mutedText,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.cardText,
    fontSize: 18,
    fontWeight: '700',
  },
  details: {
    color: colors.cardMuted,
    fontSize: 14,
    marginTop: 8,
  },
});