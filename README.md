# Super Tic Tac Toe (React + Vite + Android APK)

Dieses Repository enthält **Super Tic Tac Toe** als Webspiel und als Android-Projekt, das den Web-Build lokal im App-Bundle ausliefert.

## Tech-Stack

- React 19 + TypeScript
- Vite 6
- Zustand (State Management)
- Native Android (WebView-Wrapper mit Gradle)

## Lokale Entwicklung (Web)

### Voraussetzungen

- Node.js 20+
- npm 10+

### Start

```bash
npm install
npm run dev
```

Die Dev-URL ist standardmäßig `http://localhost:3000`.

## Android-Build

### Voraussetzungen

- Android Studio + Android SDK
- JDK 21
- Zugriff auf Maven Central und Google Maven (`dl.google.com`)

### Ablauf

```bash
npm run android:debug
```

Dieser Befehl führt aus:
1. `npm run build:web`
2. `npm run android:sync` (kopiert `dist/` nach `android/app/src/main/assets/public`)
3. `gradle assembleDebug` im `android/`-Ordner

### APK-Pfade

- Debug-APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release-APK (unsigned): `android/app/build/outputs/apk/release/app-release-unsigned.apk`

Release-Build:

```bash
npm run android:release
```

## Installation auf Gerät

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## CI / GitHub Actions

Der Workflow `.github/workflows/android-apk.yml` baut bei Push/PR (und manuell via `workflow_dispatch`) Debug- und Release-APK und lädt beide als Artefakte hoch.

