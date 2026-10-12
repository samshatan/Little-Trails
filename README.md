# Little Trails

Little Trails is a small Expo and React Native walking companion. Start a walk, collect location readings, see the recorded distance, and save completed walks locally on your device.

## Features

- Start and stop a walk recording.
- Track foreground location with high-accuracy GPS readings.
- Calculate route distance from usable location points.
- Save walk distance, duration, and route points to a local SQLite database.
- Browse previously saved walks in the History tab.
- Explore a simple, calming walking-focused interface.

## Tech stack

- [Expo](https://expo.dev/) SDK 57
- [React Native](https://reactnative.dev/)
- TypeScript
- `expo-location` for foreground location tracking
- `expo-sqlite` for on-device walk history
- `react-native-safe-area-context`

## Requirements

- Node.js (LTS recommended)
- npm
- Expo Go on a physical Android or iOS device, or an Android/iOS simulator
- Location services enabled when recording a walk

## Getting started

1. Clone the repository and move into the app directory:

   ```bash
   git clone https://github.com/samshatan/Little-Trails.git
   cd Little-Trails/LittleTrails
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npm start
   ```

4. Open the app using one of the options shown by Expo, or use a platform-specific command:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

   For the most reliable location tracking, use a physical device rather than a simulator.

## Using the app

1. Open the **Today** tab.
2. Tap **Start walk**.
3. Grant foreground location permission and keep location services enabled.
4. Walk until at least two usable location readings have been recorded.
5. Tap **Stop walk**, then tap **Save walk**.
6. Open **History** to view saved walks.

Location readings are accepted when they have a finite, positive accuracy value of 15 meters or better. Saved walks are stored in the local `little-trails.db` SQLite database and are not uploaded to a server.

## Project structure

```text
LittleTrails/
├── components/       # Reusable UI components
├── hooks/            # Walk tracking and elapsed-time hooks
├── screens/          # App screens, including walk history
├── storage/          # SQLite persistence for saved walks
├── theme/            # Shared colors and theme values
├── utils/            # Distance and other utility functions
├── App.tsx           # Main app layout and tab navigation
├── app.json          # Expo configuration
└── package.json      # Scripts and dependencies
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start Expo and open the Android target |
| `npm run ios` | Start Expo and open the iOS target |
| `npm run web` | Start the web target |

## Notes

- Location permission is requested only when a walk is started.
- Walk history is stored on the current device and is not synchronized between devices.
- The web target can be useful for checking the UI, but native location behavior is best tested on a physical mobile device.

## License

See [LICENSE](./LittleTrails/LICENSE).
