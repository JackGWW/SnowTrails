import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'snowtrails-background-location';
const MIN_DISTANCE_METERS = 3; // Minimum meaningful forward progress in meters
const MAX_ACCURACY_METERS = 60; // Ignore extremely noisy fixes when we have recent good data
const STALE_LOCATION_MS = 7000; // Accept a point if we haven't recorded movement in this window
const SWITCHBACK_HEADING_CHANGE = 24; // Degrees of heading change that indicate a switchback
const SMOOTHING_DISTANCE_THRESHOLD = 8; // Blend nearby points to reduce jitter without losing turns
const VERTICAL_NOISE_THRESHOLD = 1.5; // Ignore tiny elevation jitters under this change

// Event listeners for location updates
let locationListeners = [];

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

const toRadians = (degrees) => degrees * (Math.PI / 180);

const calculateBearing = (start, end) => {
  const lat1 = toRadians(start.latitude);
  const lat2 = toRadians(end.latitude);
  const dLon = toRadians(end.longitude - start.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing = Math.atan2(y, x);
  return ((bearing * 180) / Math.PI + 360) % 360;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getHeadingDelta = (currentHeading, previousHeading) => {
  if (previousHeading == null || currentHeading == null) return 0;
  const rawDelta = Math.abs(currentHeading - previousHeading);
  return rawDelta > 180 ? 360 - rawDelta : rawDelta;
};

const normalizeLocationSample = (location) => ({
  latitude: location.coords?.latitude ?? location.latitude,
  longitude: location.coords?.longitude ?? location.longitude,
  altitude: location.coords?.altitude ?? location.altitude ?? null,
  accuracy: location.coords?.accuracy ?? location.accuracy ?? null,
  altitudeAccuracy:
    location.coords?.altitudeAccuracy ?? location.altitudeAccuracy ?? null,
  speed: location.coords?.speed ?? location.speed ?? null,
  timestamp: location.timestamp ?? Date.now(),
});

const smoothAltitude = (previousAlt, newAlt) => {
  if (newAlt == null) return previousAlt ?? null;
  if (previousAlt == null) return newAlt;

  const diff = newAlt - previousAlt;
  if (Math.abs(diff) < VERTICAL_NOISE_THRESHOLD) {
    return previousAlt + diff * 0.25;
  }

  return previousAlt + diff * 0.65;
};

const smoothCoordinate = (previousCoord, newCoord, distance, accuracy) => {
  if (!previousCoord) return newCoord;

  const needsSmoothing =
    distance < SMOOTHING_DISTANCE_THRESHOLD || (accuracy != null && accuracy > 12);

  if (!needsSmoothing) {
    return {
      ...newCoord,
      altitude: smoothAltitude(previousCoord.altitude, newCoord.altitude),
    };
  }

  const weight = clamp((accuracy ?? 10) / 50, 0.25, 0.65);

  const blendedLatitude =
    previousCoord.latitude + (newCoord.latitude - previousCoord.latitude) * (1 - weight);
  const blendedLongitude =
    previousCoord.longitude + (newCoord.longitude - previousCoord.longitude) * (1 - weight);

  return {
    ...newCoord,
    latitude: blendedLatitude,
    longitude: blendedLongitude,
    altitude: smoothAltitude(previousCoord.altitude, newCoord.altitude),
  };
};

// Calculate elevation gain from an array of coordinates with altitude
export function calculateElevationGain(coordinates) {
  let totalGain = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    if (prev.altitude != null && curr.altitude != null) {
      const diff = curr.altitude - prev.altitude;
      if (diff > VERTICAL_NOISE_THRESHOLD) {
        totalGain += diff;
      }
    }
  }
  return totalGain;
}

// Calculate total distance from an array of coordinates
export function calculateTotalDistance(coordinates) {
  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    totalDistance += calculateDistance(
      prev.latitude,
      prev.longitude,
      curr.latitude,
      curr.longitude
    );
  }
  return totalDistance;
}

// Format duration in seconds to HH:MM:SS
export function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format distance in meters to km with 1 decimal place
export function formatDistance(meters) {
  return (meters / 1000).toFixed(1);
}

// Format elevation in meters with no decimal places
export function formatElevation(meters) {
  return Math.round(meters);
}

// Subscribe to location updates
export function subscribeToLocationUpdates(callback) {
  locationListeners.push(callback);
  return () => {
    locationListeners = locationListeners.filter((cb) => cb !== callback);
  };
}

// Notify all listeners of new location
function notifyListeners(location) {
  locationListeners.forEach((callback) => callback(location));
}

// Define the background task (guarded to prevent crashes during Fast Refresh)
if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      console.error('Background location error:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      if (locations && locations.length > 0) {
        locations.forEach((location) => {
          notifyListeners(normalizeLocationSample(location));
        });
      }
    }
  });
}

// Request background location permissions
export async function requestBackgroundPermissions() {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    return { granted: false, reason: 'foreground' };
  }

  const { status: backgroundStatus } =
    await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    return { granted: false, reason: 'background' };
  }

  return { granted: true };
}

// Check if background location task is running
export async function isTrackingActive() {
  return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
}

// Start background location tracking
export async function startTracking() {
  const isStarted = await isTrackingActive();
  if (isStarted) {
    return true;
  }

  try {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 2500, // Update every ~2.5 seconds for hiking cadence
      distanceInterval: 2, // Capture tighter switchbacks; filtering will reduce noise
      showsBackgroundLocationIndicator: true, // iOS blue bar
      foregroundService: {
        notificationTitle: 'SnowTrails Recording',
        notificationBody: 'Recording your snowshoe route',
        notificationColor: '#2E3A52',
      },
      pausesUpdatesAutomatically: false,
      activityType: Location.ActivityType.Fitness,
    });
    return true;
  } catch (error) {
    console.error('Failed to start location tracking:', error);
    return false;
  }
}

// Stop background location tracking
export async function stopTracking() {
  const isStarted = await isTrackingActive();
  if (!isStarted) {
    return true;
  }

  try {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    return true;
  } catch (error) {
    console.error('Failed to stop location tracking:', error);
    return false;
  }
}

// Evaluate and smooth a new coordinate for recording
export function prepareCoordinateForRecording(rawCoord, lastCoord) {
  const normalizedCoord = normalizeLocationSample(rawCoord);

  if (normalizedCoord.latitude == null || normalizedCoord.longitude == null) {
    return { shouldAdd: false, coordinate: lastCoord };
  }

  if (!lastCoord) {
    return { shouldAdd: true, coordinate: { ...normalizedCoord, heading: null } };
  }

  const distance = calculateDistance(
    lastCoord.latitude,
    lastCoord.longitude,
    normalizedCoord.latitude,
    normalizedCoord.longitude
  );

  const accuracy = normalizedCoord.accuracy;
  const timeDelta =
    normalizedCoord.timestamp && lastCoord.timestamp
      ? normalizedCoord.timestamp - lastCoord.timestamp
      : STALE_LOCATION_MS + 1;

  const bearingFromLast = calculateBearing(lastCoord, normalizedCoord);
  const headingDelta = getHeadingDelta(bearingFromLast, lastCoord.heading);

  const accuracyAwareThreshold = Math.max(MIN_DISTANCE_METERS, (accuracy ?? 0) * 0.25);
  const movedEnough = distance >= accuracyAwareThreshold;
  const isStale = timeDelta > STALE_LOCATION_MS;
  const turnDetected = headingDelta >= SWITCHBACK_HEADING_CHANGE && distance >= 1.5;

  if (
    accuracy != null &&
    accuracy > MAX_ACCURACY_METERS &&
    distance < accuracy * 0.5 &&
    !isStale
  ) {
    return { shouldAdd: false, coordinate: lastCoord };
  }

  if (!movedEnough && !turnDetected && !isStale) {
    return { shouldAdd: false, coordinate: lastCoord };
  }

  const smoothedCoord = smoothCoordinate(lastCoord, normalizedCoord, distance, accuracy);

  return {
    shouldAdd: true,
    coordinate: { ...smoothedCoord, heading: bearingFromLast },
  };
}

// Legacy boolean helper for compatibility
export function shouldAddCoordinate(newCoord, lastCoord) {
  return prepareCoordinateForRecording(newCoord, lastCoord).shouldAdd;
}
