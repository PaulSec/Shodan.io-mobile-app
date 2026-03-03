# Shodan Mobile

Mobile and web client for exploring Shodan data from your own API key.

Built with Expo + React Native, this app lets you search hosts, inspect full device details, browse community queries, view results on a map, and save hosts/searches locally.

## Features

- API key authentication (manual entry or QR code scanning)
- Host search with examples, pagination, and screenshot-only mode
- Full device detail pages (banners, metadata, ports, screenshots)
- Community query explorer (top-voted and latest modes)
- Interactive map view of current search results
- Saved hosts and saved searches (persisted locally)
- Profile screen with plan and API usage information

## Tech Stack

- Expo SDK 54 / React Native 0.81 / React 19
- Expo Router (file-based routing)
- Zustand (state management)
- Axios (Shodan API client)
- `expo-secure-store` (API key storage)
- `react-native-maps` (native map) + Leaflet (`react-leaflet` / WebView map)

## Prerequisites

- Node.js 20+
- npm 10+
- Expo CLI / EAS CLI (via `npx` is fine)
- For Android local builds:
  - Java 17 (Java 21 fallback supported by `scripts/eas-android-local.sh`)
  - Android SDK installed

## Getting Started

```bash
npm ci
npm run start
```

Then run on your target platform:

```bash
npm run android
npm run ios
npm run web
```

## Authentication

You need a Shodan API key to use the app:

- Manual login: paste key on the auth screen
- QR login: scan a QR containing one of:
  - Raw key string
  - JSON (`apiKey`, `api_key`, `shodan_api_key`, `key`, or `token`)
  - URL query param with the same keys

The API key is stored securely with `expo-secure-store`.

## Configuration

### Google Maps (Android native map)

`app.json` contains:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

Replace with a valid key for production Android map usage.

## Useful Scripts

- `npm run start`: start Expo dev server
- `npm run android`: run Android target from Expo
- `npm run ios`: run iOS target from Expo
- `npm run web`: run web target from Expo
- `npm run eas:android:local`: local EAS Android build (default `production`)
- `npm run eas:android:local:apk`: local APK build (`preview` profile)
- `npm run eas:android:local:aab`: local AAB build (`production` profile)
- `npm run eas:android:remote`: remote Android production build
- `npm run eas:android:submit`: submit latest Android build to Play Console

## Android Play Store Release (GitHub Actions)

Workflow: `.github/workflows/android-playstore-release.yml`

- Trigger: pushing any Git tag
- Builds Android production artifact using EAS
- Submits latest build to Google Play

Required repository secrets:

- `EXPO_TOKEN`
- `GOOGLE_SERVICE_ACCOUNT_JSON`

## Project Structure

```text
app/                    Expo Router routes (auth, tabs, device pages)
src/api/                Shodan API client, types, error parsing
src/stores/             Zustand stores (auth/search/saved/theme)
src/components/         UI and feature components
src/screens/map/        Platform-specific map implementations
src/utils/              Storage, formatting, coordinates, haptics
scripts/                Build helper scripts
.github/workflows/      CI/CD workflows
```

## Notes

- This app is an unofficial client and uses your own Shodan account/API access.
- Respect Shodan’s terms of service and applicable laws when querying infrastructure data.
