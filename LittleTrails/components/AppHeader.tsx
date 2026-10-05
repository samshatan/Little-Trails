import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Little Trails 🌱</Text>
      <Text style={styles.subtitle}>
        Every little journey counts.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 6,
  },
});