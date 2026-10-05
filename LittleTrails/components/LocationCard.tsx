import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';

export default function LocationCard() {
  const [message, setMessage] = useState('Ready to find your location');
  const [loading, setLoading] = useState(false);

  async function findLocation() {
    setLoading(true);
    setMessage('Finding your location…');

    try {
      const enabled = await Location.hasServicesEnabledAsync();

      if (!enabled) {
        setMessage('Turn on Location in your phone settings.');
        return;
      }

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setMessage('Location permission is needed. Allow it in app settings.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const accuracy = position.coords.accuracy;

      setMessage(
        `Latitude: ${position.coords.latitude.toFixed(5)}\n` +
        `Longitude: ${position.coords.longitude.toFixed(5)}\n` +
        `Estimated accuracy: ${
          accuracy === null ? 'Unknown' : `${accuracy.toFixed(0)} m`
        }`
      );
    } catch {
      setMessage('Could not get your location. Try again near a window or outside.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.message}>{message}</Text>

      <Pressable
        style={styles.button}
        onPress={findLocation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Finding…' : 'Find my location'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
  },
  message: {
    color: colors.cardText,
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.mint,
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.mintStrongText,
    fontWeight: '700',
  },
});