# Repository Guidelines

## Project Structure & Module Organization
SnowTrails is an Expo-managed React Native app. `App.js` boots the experience and pulls UI from `src/components`, where `LiveMap.js`, `StaticMap.js`, and the `markers/` and `trails/` folders hold reusable view logic. Assets such as icons, fonts, and onboarding slides live in `assets/`. Back-country data plus Python helpers for GPX/GeoJSON transforms are under `data/`; activate `data/venv` before running scripts like `python data/generate_coordinate_mapping.py` so caches such as `trail_mapping.json` stay reproducible. Platform config lives at the repo root (`app.json`, `eas.json`, `ios/`); update these only when cutting a release.

## Build, Test & Development Commands
- `yarn install` — sync dependencies when `package.json` changes.
- `yarn start` — launch the Expo dev server with QR preview.
- `yarn android` / `yarn ios` — compile and run the native shell locally.
- `eas build --profile development --platform ios` (or android) — produce signed binaries; requires Expo login.
- `npx expo-doctor` — verify native modules before committing.

## Coding Style & Naming Conventions
Use function components with hooks and keep logic in small modules. Match the existing 2-space indentation, trailing commas, and single quotes. Name React components in PascalCase (`LiveMap`), colocated helper files in camelCase, and generated data artifacts in snake_case. Define props via `PropTypes` or JSDoc, and keep map constants (colors, zoom levels) in dedicated config objects rather than inline literals. Secrets (Sentry DSN, Amplitude keys) belong in Expo config variables, never in git history.

## Python commands
- Always use the virtual environment source venv/bin/activate
- Generate all the trail code using `cd data && source venv/bin/activate && python generate_trail_code.py`

## Git Branches
- Always fetch the latest master before creating a new branch
- By default, create new branches off of the master branch

## PR Creation
- Only commit files related to the current change
- Include a high level Overview section
- Include a Why section with some brief context behind the change
- Include a Changes section with bullet list of key changes