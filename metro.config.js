// This replaces `const { getDefaultConfig } = require('expo/metro-config');`
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// This replaces `const config = getDefaultConfig(__dirname);`
const config = getSentryExpoConfig(__dirname);

// Add support for .geojson files as assets (use require() to import)
config.resolver.assetExts.push('geojson');

module.exports = config;
