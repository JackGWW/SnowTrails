import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK = 'SNOWTRAILS_ROUTE_TRACKING';
const MIN_DISTANCE_METERS = 5;

let trackerInstance = null;

TaskManager.defineTask(LOCATION_TASK, ({ data, error }) => {
  if (error) {
    console.warn('Location task error:', error);
    return;
  }

  const { locations } = data || {};
  if (!trackerInstance || !locations || locations.length === 0) {
    return;
  }

  locations.forEach((location) => trackerInstance.handleLocationUpdate(location));
});

class LocationTracker {
  constructor() {
    this.route = [];
    this.distance = 0;
    this.elevationGain = 0;
    this.elapsedMs = 0;
    this.startTime = null;
    this.isRecording = false;
    this.isPaused = false;
    this.listeners = new Set();
    this.lastLocation = null;
    trackerInstance = this;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  async requestPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.status !== 'granted') {
      throw new Error('Foreground location permission denied');
    }

    const background = await Location.requestBackgroundPermissionsAsync();
    if (background.status !== 'granted') {
      throw new Error('Background location permission denied');
    }
  }

  async startRecording() {
    await this.requestPermissions();

    this.route = [];
    this.distance = 0;
    this.elevationGain = 0;
    this.elapsedMs = 0;
    this.startTime = Date.now();
    this.isRecording = true;
    this.isPaused = false;
    this.lastLocation = null;

    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 1,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'SnowTrails Recording',
        notificationBody: 'Tracking your snowshoe route.',
      },
      pausesUpdatesAutomatically: false,
      activityType: Location.ActivityType.Fitness,
    });

    this.emitChange();
  }

  async pauseRecording() {
    if (!this.isRecording || this.isPaused) return;

    this.elapsedMs += Date.now() - this.startTime;
    this.startTime = null;
    this.isPaused = true;
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    this.emitChange();
  }

  async resumeRecording() {
    if (!this.isRecording || !this.isPaused) return;

    await this.requestPermissions();
    this.startTime = Date.now();
    this.isPaused = false;

    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 1,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'SnowTrails Recording',
        notificationBody: 'Tracking your snowshoe route.',
      },
      pausesUpdatesAutomatically: false,
      activityType: Location.ActivityType.Fitness,
    });

    this.emitChange();
  }

  async clearRecording() {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    this.route = [];
    this.distance = 0;
    this.elevationGain = 0;
    this.elapsedMs = 0;
    this.startTime = null;
    this.isRecording = false;
    this.isPaused = false;
    this.lastLocation = null;
    this.emitChange();
  }

  handleLocationUpdate(location) {
    if (!this.isRecording || this.isPaused || !location?.coords) {
      return;
    }

    const { latitude, longitude, altitude } = location.coords;
    const currentPoint = { latitude, longitude, altitude: altitude || 0 };

    if (this.route.length > 0) {
      const lastPoint = this.route[this.route.length - 1];
      const delta = this.calculateDistanceMeters(lastPoint, currentPoint);
      if (delta < MIN_DISTANCE_METERS) {
        return;
      }

      this.distance += delta;
      const elevationDelta = currentPoint.altitude - lastPoint.altitude;
      if (elevationDelta > 0) {
        this.elevationGain += elevationDelta;
      }
    }

    this.route.push(currentPoint);
    this.lastLocation = currentPoint;
    this.emitChange();
  }

  calculateDistanceMeters(start, end) {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadius = 6371000;

    const dLat = toRad(end.latitude - start.latitude);
    const dLon = toRad(end.longitude - start.longitude);

    const lat1 = toRad(start.latitude);
    const lat2 = toRad(end.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  }

  getDurationMs() {
    if (!this.isRecording) {
      return 0;
    }

    if (this.isPaused || !this.startTime) {
      return this.elapsedMs;
    }

    return this.elapsedMs + (Date.now() - this.startTime);
  }

  getGeoJson() {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: this.route.map((point) => [point.longitude, point.latitude]),
          },
          properties: {},
        },
      ],
    };
  }

  getState() {
    return {
      route: this.route,
      distance: this.distance,
      elevationGain: this.elevationGain,
      durationMs: this.getDurationMs(),
      isRecording: this.isRecording,
      isPaused: this.isPaused,
      hasPath: this.route.length > 1,
      geoJson: this.getGeoJson(),
      lastLocation: this.lastLocation,
    };
  }

  emitChange() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

const tracker = new LocationTracker();
export default tracker;
export { LOCATION_TASK };
