import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { colors, isDark } from './theme/colors';
import { useState } from 'react';
import AppHeader from './components/AppHeader';
import DistanceCard from './components/DistanceCard';
import MetricCard from './components/MetricCard';
import MapPanel from './components/MapPanel';
import BottomNavigation from './components/BottomNavigation';
import LocationCard from './components/LocationCard';
import useWalkTracker from './hooks/useWalkTracker';
import { getRouteDistanceMeters } from './utils/distance';
import useElapsedTime from './hooks/useElapsedTime';
import { saveWalk } from './storage/walks';
import HistoryScreen from './screens/HistoryScreen';


export default function App() {
  const [activeTab, setActiveTab] = useState('Today');
  const walk = useWalkTracker();
  const distanceMeters = getRouteDistanceMeters(
    walk.points.map((point) => point.coords)
  );
  const elapsedSeconds = useElapsedTime(walk.isTracking);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  const walkTime =
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}`;

  
  const [isSaving, setIsSaving] = useState(false);

  const canSave =
    !walk.isTracking &&
    walk.points.length >= 2 &&
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
            <Text style={styles.greeting}>
              Hello, Sameer 👋
            </Text>
            <Text style={styles.description}>
              Where will your feet take you today?
            </Text>

            <LocationCard />
            <Pressable
              onPress={walk.isTracking ? walk.stop : walk.start}
              style={{
                backgroundColor: colors.mint,
                padding: 14,
                borderRadius: 14,
                marginTop: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: colors.mintStrongText,
                fontWeight: '700',
              }}>
                {walk.isTracking ? 'Stop walk' : 'Start walk'}
              </Text>
            </Pressable>

            <Text style={styles.description}>
              Recorded points: {walk.points.length}
            </Text>
            
            <Pressable
              onPress={handleSaveWalk}
              disabled={!canSave}
              style={{
                backgroundColor: colors.lilac,
                padding: 14,
                borderRadius: 14,
                marginTop: 12,
                alignItems: 'center',
                opacity: canSave ? 1 : 0.5,
              }}
            >
              <Text style={{
                color: colors.cardText,
                fontWeight: '700',
              }}>
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

            <View style={styles.metricRow}>
              <MetricCard label="Walk time ⏱️" value={walkTime} />
              <MetricCard label="Active time ⏱️" value="28 min" />
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
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
});