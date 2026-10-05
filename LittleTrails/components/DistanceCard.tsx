import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type DistanceCardProps = {
  distance: number;
};

export default function DistanceCard({
  distance,
}: DistanceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Today's little travels</Text>

      <Text style={styles.distance}>
        {distance.toFixed(1)} km
      </Text>

      <Text style={styles.message}>
        Every step is a little adventure 🌿
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.mint,
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.mintText,
  },
  distance: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.mintStrongText,
    marginVertical: 12,
  },
  message: {
    fontSize: 13,
    color: colors.mintText,
  },
});