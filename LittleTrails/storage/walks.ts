import * as SQLite from 'expo-sqlite';
import type { LocationObject } from 'expo-location';

type WalkData = {
  points: LocationObject[];
  distanceMeters: number;
  durationSeconds: number;
};

let database: SQLite.SQLiteDatabase | null = null;

async function getDatabase() {
  if (database) return database;

  const db = await SQLite.openDatabaseAsync('little-trails.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS walks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_key TEXT NOT NULL UNIQUE,
      saved_at TEXT NOT NULL,
      distance_meters REAL NOT NULL,
      duration_seconds INTEGER NOT NULL,
      points_json TEXT NOT NULL
    );
  `);

  database = db;
  return db;
}

export async function saveWalk(walk: WalkData) {
  if (walk.points.length < 2) {
    throw new Error('Record at least two points before saving.');
  }

  const first = walk.points[0];
  const last = walk.points[walk.points.length - 1];
  const sessionKey = `${first.timestamp}:${last.timestamp}`;

  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO walks (
      session_key,
      saved_at,
      distance_meters,
      duration_seconds,
      points_json
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(session_key) DO NOTHING`,
    sessionKey,
    new Date().toISOString(),
    walk.distanceMeters,
    walk.durationSeconds,
    JSON.stringify(walk.points)
  );

  return result.changes > 0;
}

export type WalkSummary = {
  id: number;
  saved_at: string;
  distance_meters: number;
  duration_seconds: number;
};

export async function getSavedWalks() {
  const db = await getDatabase();

  return db.getAllAsync<WalkSummary>(`
    SELECT id, saved_at, distance_meters, duration_seconds
    FROM walks
    ORDER BY id DESC
  `);
}