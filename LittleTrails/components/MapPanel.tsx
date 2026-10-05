import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function MapPanel() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your little trail</Text>

      <View style={styles.map}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.caption}>
          Your adventures will appear here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lilac,
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.cardText,
  },
  map: {
    height: 180,
    backgroundColor: colors.mint,
    borderRadius: 18,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  icon: {
    fontSize: 40,
  },
  caption: {
    fontSize: 14,
    color: colors.mintText,
    marginTop: 10,
    textAlign: 'center',
  },
});