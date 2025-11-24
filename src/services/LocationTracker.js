import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'snowtrails-background-location';
const MIN_DISTANCE_METERS = 5; // Filter GPS noise - ignore points closer than this
const ELEVATION_THRESHOLD_METERS = 3; // Minimum elevation change to count (filters GPS altitude noise)
const ALTITUDE_SMOOTHING_WINDOW = 3; // Number of points to average for altitude smoothing
const MAX_HORIZONTAL_ACCURACY_METERS = 20; // Reject points with worse horizontal accuracy
const MAX_VERTICAL_ACCURACY_METERS = 30; // Reject points with worse vertical accuracy
const DEFAULT_HORIZONTAL_ACCURACY_METERS = 6;
const STATIONARY_DISTANCE_THRESHOLD = 2.8;
const SLOW_DISTANCE_THRESHOLD = 2.2;
const WALK_DISTANCE_THRESHOLD = 1.6;
const RUN_DISTANCE_THRESHOLD = 1.2;
const SLOW_SPEED_MPS = 0.5;
const WALKING_SPEED_MPS = 1.2;
const RUNNING_SPEED_MPS = 2.5;
const PENDING_SPEED_THRESHOLD_MPS = 0.7;
const RESET_PENDING_SPEED_THRESHOLD_MPS = 0.35;
const ACCURACY_BASE_FACTOR = 0.25;
const ACCURACY_POOR_SIGNAL_THRESHOLD = 12;
const ACCURACY_POOR_SIGNAL_FACTOR = 0.35;
const SMOOTHING_ALPHA_MIN = 0.18;
const SMOOTHING_ALPHA_MAX = 0.55;
const SMOOTHING_ACCURACY_MIN = 3;
const SMOOTHING_ACCURACY_MAX = 40;

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

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Smooth altitude values using a moving average
function smoothAltitudes(coordinates) {
  if (coordinates.length < ALTITUDE_SMOOTHING_WINDOW) {
    return coordinates.map((c) => c.altitude);
  }

  const smoothed = [];
  for (let i = 0; i < coordinates.length; i++) {
    // Calculate window bounds
    const halfWindow = Math.floor(ALTITUDE_SMOOTHING_WINDOW / 2);
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(coordinates.length - 1, i + halfWindow);

    // Average altitudes in window, skipping null values
    let sum = 0;
    let count = 0;
    for (let j = start; j <= end; j++) {
      if (coordinates[j].altitude != null) {
        sum += coordinates[j].altitude;
        count++;
      }
    }
    smoothed.push(count > 0 ? sum / count : null);
  }
  return smoothed;
}

// Calculate elevation gain from an array of coordinates with altitude
// Uses smoothed altitudes and peak/trough detection to filter GPS noise
// Only counts elevation changes when there's also horizontal movement
export function calculateElevationGain(coordinates) {
  if (coordinates.length < 2) return 0;

  // Smooth altitude values first
  const smoothedAltitudes = smoothAltitudes(coordinates);

  let totalGain = 0;
  let refAlt = null; // Reference altitude for current segment
  let refIdx = 0;
  let peakAlt = null; // Highest point since last reference
  let peakIdx = 0;
  let isClimbing = true; // Direction we're currently tracking

  // Find first valid altitude as starting point
  for (let i = 0; i < smoothedAltitudes.length; i++) {
    if (smoothedAltitudes[i] != null) {
      refAlt = smoothedAltitudes[i];
      peakAlt = smoothedAltitudes[i];
      refIdx = i;
      peakIdx = i;
      break;
    }
  }

  if (refAlt == null) return 0;

  for (let i = 1; i < coordinates.length; i++) {
    const currAlt = smoothedAltitudes[i];
    if (currAlt == null) continue;

    if (isClimbing) {
      if (currAlt > peakAlt) {
        // Still climbing - update peak
        peakAlt = currAlt;
        peakIdx = i;
      } else if (peakAlt - currAlt >= ELEVATION_THRESHOLD_METERS) {
        // Significant descent - finalize this climb segment
        const climbHeight = peakAlt - refAlt;

        if (climbHeight >= ELEVATION_THRESHOLD_METERS) {
          // Verify horizontal movement occurred during the climb
          const horizontalDist = calculateDistance(
            coordinates[refIdx].latitude,
            coordinates[refIdx].longitude,
            coordinates[peakIdx].latitude,
            coordinates[peakIdx].longitude
          );

          if (horizontalDist >= MIN_DISTANCE_METERS) {
            totalGain += climbHeight;
          }
        }

        // Start tracking descent from the peak
        refAlt = peakAlt;
        refIdx = peakIdx;
        peakAlt = currAlt; // Now tracking the trough
        peakIdx = i;
        isClimbing = false;
      }
    } else {
      // Descending - track the lowest point
      if (currAlt < peakAlt) {
        peakAlt = currAlt; // peakAlt is actually trough when descending
        peakIdx = i;
      } else if (currAlt - peakAlt >= ELEVATION_THRESHOLD_METERS) {
        // Significant climb - switch to climbing mode
        // Start new climb from the trough
        refAlt = peakAlt;
        refIdx = peakIdx;
        peakAlt = currAlt;
        peakIdx = i;
        isClimbing = true;
      }
    }
  }

  // Handle final segment if we ended while climbing
  if (isClimbing) {
    const finalClimb = peakAlt - refAlt;
    if (finalClimb >= ELEVATION_THRESHOLD_METERS) {
      const horizontalDist = calculateDistance(
        coordinates[refIdx].latitude,
        coordinates[refIdx].longitude,
        coordinates[peakIdx].latitude,
        coordinates[peakIdx].longitude
      );

      if (horizontalDist >= MIN_DISTANCE_METERS) {
        totalGain += finalClimb;
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
        // Process each location update
        locations.forEach((location) => {
          notifyListeners({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            horizontalAccuracy: location.coords.accuracy,
            verticalAccuracy: location.coords.altitudeAccuracy,
            timestamp: location.timestamp,
          });
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
      accuracy: Location.Accuracy.High,
      timeInterval: 3000, // Update every 3 seconds
      distanceInterval: MIN_DISTANCE_METERS, // Minimum distance between updates
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

// Check if a coordinate has acceptable GPS accuracy
export function hasAcceptableAccuracy(coord) {
  // If accuracy data is not available, accept the point (some devices don't report it)
  if (coord.horizontalAccuracy == null && coord.verticalAccuracy == null) {
    return true;
  }

  // Reject points with poor horizontal accuracy
  if (
    coord.horizontalAccuracy != null &&
    coord.horizontalAccuracy > MAX_HORIZONTAL_ACCURACY_METERS
  ) {
    return false;
  }

  // Reject points with poor vertical accuracy (affects elevation calculations)
  if (
    coord.verticalAccuracy != null &&
    coord.verticalAccuracy > MAX_VERTICAL_ACCURACY_METERS
  ) {
    return false;
  }

  return true;
}

// Filter a new coordinate based on distance from last point and accuracy
export function shouldAddCoordinate(newCoord, lastCoord) {
  // First check if this point has acceptable accuracy
  if (!hasAcceptableAccuracy(newCoord)) {
    return false;
  }

  // Always accept first point
  if (!lastCoord) {
    return true;
  }

  // Check minimum distance to filter GPS jitter
  const distance = calculateDistance(
    lastCoord.latitude,
    lastCoord.longitude,
    newCoord.latitude,
    newCoord.longitude
  );
  return distance >= MIN_DISTANCE_METERS;
}

function getDistanceThresholdBySpeed(speed) {
  if (speed >= RUNNING_SPEED_MPS) {
    return RUN_DISTANCE_THRESHOLD;
  }
  if (speed >= WALKING_SPEED_MPS) {
    return WALK_DISTANCE_THRESHOLD;
  }
  if (speed >= SLOW_SPEED_MPS) {
    return SLOW_DISTANCE_THRESHOLD;
  }
  return STATIONARY_DISTANCE_THRESHOLD;
}

function getAccuracyPenalty(currentAccuracy, lastAccuracy) {
  const current =
    currentAccuracy != null
      ? currentAccuracy
      : DEFAULT_HORIZONTAL_ACCURACY_METERS;
  const previous =
    lastAccuracy != null
      ? lastAccuracy
      : DEFAULT_HORIZONTAL_ACCURACY_METERS;
  const averageAccuracy = (current + previous) / 2;
  const basePenalty = averageAccuracy * ACCURACY_BASE_FACTOR;
  const poorSignalPenalty =
    Math.max(averageAccuracy - ACCURACY_POOR_SIGNAL_THRESHOLD, 0) *
    ACCURACY_POOR_SIGNAL_FACTOR;

  return basePenalty + poorSignalPenalty;
}

function getSmoothingAlpha(accuracy) {
  const clampedAccuracy = Math.max(
    SMOOTHING_ACCURACY_MIN,
    Math.min(
      accuracy != null ? accuracy : DEFAULT_HORIZONTAL_ACCURACY_METERS,
      SMOOTHING_ACCURACY_MAX
    )
  );
  const normalized =
    (clampedAccuracy - SMOOTHING_ACCURACY_MIN) /
    (SMOOTHING_ACCURACY_MAX - SMOOTHING_ACCURACY_MIN);
  const alpha =
    SMOOTHING_ALPHA_MAX -
    normalized * (SMOOTHING_ALPHA_MAX - SMOOTHING_ALPHA_MIN);

  return Math.max(SMOOTHING_ALPHA_MIN, Math.min(SMOOTHING_ALPHA_MAX, alpha));
}

// Provides a stateful filter that smooths coordinates and rejects jitter
// for the trail recording listener only.
export function createTrailRecordingFilter() {
  let smoothingState = null;
  let pendingDistance = 0;

  const smoothCoordinate = (coord) => {
    if (!smoothingState) {
      smoothingState = {
        latitude: coord.latitude,
        longitude: coord.longitude,
      };
      return coord;
    }

    const alpha = getSmoothingAlpha(coord.horizontalAccuracy);
    const latitude =
      smoothingState.latitude +
      (coord.latitude - smoothingState.latitude) * alpha;
    const longitude =
      smoothingState.longitude +
      (coord.longitude - smoothingState.longitude) * alpha;

    smoothingState = { latitude, longitude };
    return { ...coord, latitude, longitude };
  };

  const process = (coord, lastCoord) => {
    if (!hasAcceptableAccuracy(coord)) {
      return null;
    }

    const filteredCoord = smoothCoordinate(coord);

    if (!lastCoord) {
      pendingDistance = 0;
      return filteredCoord;
    }

    const deltaTimeSeconds = Math.max(
      (filteredCoord.timestamp - lastCoord.timestamp) / 1000,
      0
    );
    const distance = calculateDistance(
      lastCoord.latitude,
      lastCoord.longitude,
      filteredCoord.latitude,
      filteredCoord.longitude
    );
    const speed =
      deltaTimeSeconds > 0 ? distance / deltaTimeSeconds : 0;
    const distanceThreshold = getDistanceThresholdBySpeed(speed);
    const accuracyPenalty = getAccuracyPenalty(
      coord.horizontalAccuracy,
      lastCoord.horizontalAccuracy
    );
    const effectiveDistance = Math.max(0, distance - accuracyPenalty);

    if (effectiveDistance >= distanceThreshold) {
      pendingDistance = 0;
      return filteredCoord;
    }

    if (speed >= PENDING_SPEED_THRESHOLD_MPS && effectiveDistance > 0) {
      pendingDistance += effectiveDistance;
      if (pendingDistance >= distanceThreshold) {
        pendingDistance = 0;
        return filteredCoord;
      }
    } else if (speed <= RESET_PENDING_SPEED_THRESHOLD_MPS) {
      pendingDistance = 0;
    }

    return null;
  };

  const reset = () => {
    smoothingState = null;
    pendingDistance = 0;
  };

  return { process, reset };
}
