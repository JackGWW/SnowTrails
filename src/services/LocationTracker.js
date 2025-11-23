import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'snowtrails-background-location';
const MIN_DISTANCE_METERS = 5; // Filter GPS noise - ignore points closer than this

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

// Calculate elevation gain from an array of coordinates with altitude
export function calculateElevationGain(coordinates) {
  let totalGain = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    if (prev.altitude != null && curr.altitude != null) {
      const diff = curr.altitude - prev.altitude;
      if (diff > 0) {
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

// Define the background task
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
          timestamp: location.timestamp,
        });
      });
    }
  }
});

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

// Filter a new coordinate based on distance from last point
export function shouldAddCoordinate(newCoord, lastCoord) {
  if (!lastCoord) {
    return true;
  }
  const distance = calculateDistance(
    lastCoord.latitude,
    lastCoord.longitude,
    newCoord.latitude,
    newCoord.longitude
  );
  return distance >= MIN_DISTANCE_METERS;
}
