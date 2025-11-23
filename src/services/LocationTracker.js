import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'SNOWTRAILS_ROUTE_TRACKING';

const subscribers = new Set();

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }

  const { locations } = data || {};
  if (!locations || !locations.length) {
    return;
  }

  const location = locations[0];
  subscribers.forEach((callback) => callback(location));
});

export const subscribeToLocationUpdates = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

export async function ensurePermissionsAsync() {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') {
    throw new Error('Location permission not granted');
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== 'granted') {
    throw new Error('Background location permission not granted');
  }
}

export async function startLocationUpdatesAsync() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasStarted) {
    return;
  }

  await ensurePermissionsAsync();

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    activityType: Location.ActivityType.Fitness,
    distanceInterval: 5,
    deferredUpdatesInterval: 5000,
    deferredUpdatesDistance: 5,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'SnowTrails',
      notificationBody: 'Recording route in progress',
      notificationColor: '#2E3A52',
    },
  });
}

export async function stopLocationUpdatesAsync() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
}
