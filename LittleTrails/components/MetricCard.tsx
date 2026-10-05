import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type MetricCardProps = {
  label: string;
  value: string;
};

export default function MetricCard({
  label,
  value,
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
  },
  label: {
    fontSize: 14,
    color: colors.cardMuted,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.cardText,
    marginTop: 8,
  },
});