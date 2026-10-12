import type { LocationObject } from 'expo-location';

type WalkData = {
  points: LocationObject[];
  distanceMeters: number;
  durationSeconds: number;
};

export type WalkSummary = {
  id: number;
  saved_at: string;
  distance_meters: number;
  duration_seconds: number;
};

type StoredWalk = WalkSummary & {
  session_key: string;
};

const STORAGE_KEY = 'little-trails.walks';

function getStoredWalks(): StoredWalk[] {
  const value = globalThis.localStorage.getItem(STORAGE_KEY);

  if (!value) return [];

  try {
    return JSON.parse(value) as StoredWalk[];
  } catch (error) {
    throw new Error(
      `Could not read saved walks: ${
        error instanceof Error ? error.message : 'invalid stored data'
      }`
    );
  }
}

export async function saveWalk(walk: WalkData) {
  if (walk.points.length < 2) {
    throw new Error('Record at least two points before saving.');
  }

  const first = walk.points[0];
  const last = walk.points[walk.points.length - 1];
  const sessionKey = `${first.timestamp}:${last.timestamp}`;
  const walks = getStoredWalks();

  if (
    walks.some(
      (savedWalk) =>
        savedWalk.session_key === sessionKey
    )
  ) {
    return false;
  }

  walks.unshift({
    id: Date.now(),
    saved_at: new Date().toISOString(),
    distance_meters: walk.distanceMeters,
    duration_seconds: walk.durationSeconds,
    session_key: sessionKey,
  });
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(walks));

  return true;
}

export async function getSavedWalks() {
  return getStoredWalks().map(({ session_key, ...walk }) => walk);
}
