import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { colors, isDark } from './theme/colors';
import AppHeader from './components/AppHeader';
import DistanceCard from './components/DistanceCard';
import MetricCard from './components/MetricCard';
import MapPanel from './components/MapPanel';
import BottomNavigation from './components/BottomNavigation';
import LocationCard from './components/LocationCard';
import HistoryScreen from './screens/HistoryScreen';

import useWalkTracker from './hooks/useWalkTracker';
import useElapsedTime from './hooks/useElapsedTime';
import { getRouteDistanceMeters } from './utils/distance';
import { saveWalk } from './storage/walks';

export default function App() {
  const [activeTab, setActiveTab] = useState('Today');
  const [isSaving, setIsSaving] = useState(false);

  const walk = useWalkTracker();
  const elapsedSeconds = useElapsedTime(walk.isTracking);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  const walkTime =
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}`;

  const usablePoints = walk.points.filter((point) => {
    const accuracy = point.coords.accuracy;

    return (
      accuracy !== null &&
      Number.isFinite(accuracy) &&
      accuracy > 0 &&
      accuracy <= 15
    );
  });

  const distanceMeters = getRouteDistanceMeters(
    usablePoints.map((point) => point.coords)
  );

  const canSave =
    !walk.isTracking &&
    usablePoints.length >= 2 &&
    !isSaving;

  async function handleSaveWalk() {
    if (!canSave) return;

    setIsSaving(true);

    try {
      const inserted = await saveWalk({
        points: walk.points,
        distanceMeters,
        durationSeconds: elapsedSeconds,
      });

      Alert.alert(
        inserted ? 'Walk saved 🌱' : 'Already saved',
        inserted
          ? 'Your walk is saved on your phone.'
          : 'This recording is already saved.'
      );
    } catch (error) {
      Alert.alert(
        'Could not save',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.app}>
        <StatusBar style={isDark ? 'light' : 'dark'} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.screen}
        >
          <AppHeader />

          {activeTab === 'Today' ? (
            <>
              <Text style={styles.greeting}>Hello, My Friend 👋</Text>

              <Text style={styles.description}>
                Where will your feet take you today?
              </Text>

              <LocationCard />

              <Pressable
                onPress={walk.isTracking ? walk.stop : walk.start}
                style={styles.trackingButton}
              >
                <Text style={styles.trackingButtonText}>
                  {walk.isTracking ? 'Stop walk' : 'Start walk'}
                </Text>
              </Pressable>

              <Text style={styles.description}>
                Recorded points: {walk.points.length}
                {' · Usable: '}
                {usablePoints.length}
              </Text>

              <Pressable
                onPress={handleSaveWalk}
                disabled={!canSave}
                style={[
                  styles.saveButton,
                  { opacity: canSave ? 1 : 0.5 },
                ]}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving…' : 'Save walk'}
                </Text>
              </Pressable>

              {walk.error !== '' && (
                <Text style={styles.description}>{walk.error}</Text>
              )}

              <DistanceCard distance={distanceMeters / 1000} />

              <Text style={styles.description}>
                Debug distance: {distanceMeters.toFixed(2)} m
              </Text>

              {usablePoints.length < 2 && (
                <Text style={styles.description}>
                  {walk.isTracking
                    ? 'Waiting for a clearer location reading…'
                    : 'Record at least two usable readings to save a walk.'}
                </Text>
              )}

              {walk.points.slice(-10).map((point, index) => (
                <Text
                  key={`${point.timestamp}-${index}`}
                  style={styles.description}
                >
                  Reading {index + 1}
                  {' · Accuracy: '}
                  {point.coords.accuracy?.toFixed(0) ?? 'unknown'} m
                  {' · Speed: '}
                  {point.coords.speed?.toFixed(2) ?? 'unknown'} m/s
                </Text>
              ))}

              <View style={styles.metricRow}>
                <MetricCard label="Steps 👟" value="5,200" />
                <MetricCard label="Walk time ⏱️" value={walkTime} />
              </View>

              <View style={styles.metricRow}>
                <MetricCard label="Est. calories 🔥" value="120 kcal" />
                <MetricCard label="Pace · min/km" value="12:00" />
              </View>

              <MapPanel />
            </>
          ) : activeTab === 'History' ? (
            <HistoryScreen />
          ) : (
            <View>
              <Text style={styles.greeting}>{activeTab}</Text>

              <Text style={styles.description}>
                A new chapter of your little adventures 🌿
              </Text>

              {activeTab === 'Explore' && <MapPanel />}
            </View>
          )}
        </ScrollView>

        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.mutedText,
    marginTop: 8,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  trackingButton: {
    backgroundColor: colors.mint,
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  trackingButtonText: {
    color: colors.mintStrongText,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: colors.lilac,
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.cardText,
    fontWeight: '700',
  },
});