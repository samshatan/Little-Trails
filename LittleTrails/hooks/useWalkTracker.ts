import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useWalkTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [points, setPoints] = useState<Location.LocationObject[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isTracking) return;

    let cancelled = false;
    let subscription: Location.LocationSubscription | undefined;

    async function beginTracking() {
      try {
        const permission =
          await Location.requestForegroundPermissionsAsync();

        if (cancelled) return;

        if (permission.status !== 'granted') {
          throw new Error('Allow location permission to record a walk.');
        }

        const enabled = await Location.hasServicesEnabledAsync();

        if (cancelled) return;

        if (!enabled) {
          throw new Error('Turn on Location in your phone settings.');
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (position) => {
            if (!cancelled) {
              setPoints((previous) => [...previous, position]);
            }
          },
          (reason) => {
            if (!cancelled) {
              setError(reason);
              setIsTracking(false);
            }
          }
        );

        if (cancelled) subscription.remove();
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Could not start tracking.'
          );
          setIsTracking(false);
        }
      }
    }

    beginTracking();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [isTracking]);

  function start() {
    setPoints([]);
    setError('');
    setIsTracking(true);
  }

  function stop() {
    setIsTracking(false);
  }

  return { isTracking, points, error, start, stop };
}