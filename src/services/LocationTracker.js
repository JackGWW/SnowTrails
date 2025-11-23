import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'snowtrails-location-tracking';
const MIN_DISTANCE_METERS = 5; // Filter GPS noise - ignore points less than 5m apart

// Global state for location tracking (persists across component mounts)
let locationSubscribers = [];
let recordedCoordinates = [];
let totalDistance = 0;
let totalElevationGain = 0;
let lastLocation = null;
let isRecording = false;
let isPaused = false;
let startTime = null;
let pausedTime = 0;
let pauseStartTime = null;

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Process a new location update
function processLocation(location) {
  if (!isRecording || isPaused) return;

  const { latitude, longitude, altitude } = location.coords;

  // Filter GPS noise - ignore points less than MIN_DISTANCE_METERS apart
  if (lastLocation) {
    const distance = calculateDistance(
      lastLocation.latitude,
      lastLocation.longitude,
      latitude,
      longitude
    );

    if (distance < MIN_DISTANCE_METERS) {
      return; // Ignore this point - too close to last recorded point
    }

    // Add distance to total
    totalDistance += distance;

    // Calculate elevation gain (only count positive elevation changes)
    if (altitude !== null && lastLocation.altitude !== null) {
      const elevationChange = altitude - lastLocation.altitude;
      if (elevationChange > 0) {
        totalElevationGain += elevationChange;
      }
    }
  }

  // Record this location
  const newCoord = {
    latitude,
    longitude,
    altitude: altitude || 0,
    timestamp: Date.now()
  };

  recordedCoordinates.push(newCoord);
  lastLocation = newCoord;

  // Notify all subscribers of the update
  notifySubscribers();
}

// Notify all subscribers of state changes
function notifySubscribers() {
  const state = getRecordingState();
  locationSubscribers.forEach(callback => callback(state));
}

// Get current recording state
export function getRecordingState() {
  let elapsedTime = 0;
  if (startTime) {
    if (isPaused && pauseStartTime) {
      elapsedTime = pauseStartTime - startTime - pausedTime;
    } else {
      elapsedTime = Date.now() - startTime - pausedTime;
    }
  }

  return {
    isRecording,
    isPaused,
    coordinates: [...recordedCoordinates],
    distance: totalDistance,
    elevationGain: totalElevationGain,
    duration: elapsedTime,
    lastLocation: lastLocation ? { ...lastLocation } : null
  };
}

// Subscribe to location updates
export function subscribeToLocationUpdates(callback) {
  locationSubscribers.push(callback);
  // Immediately call with current state
  callback(getRecordingState());

  // Return unsubscribe function
  return () => {
    locationSubscribers = locationSubscribers.filter(cb => cb !== callback);
  };
}

// Request location permissions
export async function requestPermissions() {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    return { granted: false, message: 'Foreground location permission denied' };
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    return { granted: false, message: 'Background location permission denied' };
  }

  return { granted: true };
}

// Start recording
export async function startRecording() {
  const permissionResult = await requestPermissions();
  if (!permissionResult.granted) {
    return { success: false, message: permissionResult.message };
  }

  // Reset state
  recordedCoordinates = [];
  totalDistance = 0;
  totalElevationGain = 0;
  lastLocation = null;
  pausedTime = 0;
  pauseStartTime = null;
  startTime = Date.now();
  isRecording = true;
  isPaused = false;

  // Start background location tracking
  try {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 1, // Minimum distance between updates in meters
      timeInterval: 1000, // Minimum time between updates in ms
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'SnowTrails Recording',
        notificationBody: 'Recording your route in the background',
        notificationColor: '#2E3A52',
      },
    });
  } catch (error) {
    console.error('Failed to start location updates:', error);
    isRecording = false;
    return { success: false, message: 'Failed to start location tracking' };
  }

  notifySubscribers();
  return { success: true };
}

// Pause recording
export function pauseRecording() {
  if (!isRecording || isPaused) return;

  isPaused = true;
  pauseStartTime = Date.now();
  notifySubscribers();
}

// Resume recording
export function resumeRecording() {
  if (!isRecording || !isPaused) return;

  if (pauseStartTime) {
    pausedTime += Date.now() - pauseStartTime;
    pauseStartTime = null;
  }
  isPaused = false;
  notifySubscribers();
}

// Clear/stop recording
export async function clearRecording() {
  isRecording = false;
  isPaused = false;
  recordedCoordinates = [];
  totalDistance = 0;
  totalElevationGain = 0;
  lastLocation = null;
  startTime = null;
  pausedTime = 0;
  pauseStartTime = null;

  // Stop background location tracking
  try {
    const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch (error) {
    console.error('Failed to stop location updates:', error);
  }

  notifySubscribers();
}

// Check if currently recording
export function isCurrentlyRecording() {
  return isRecording;
}

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  if (data && data.locations) {
    data.locations.forEach(location => {
      processLocation(location);
    });
  }
});
