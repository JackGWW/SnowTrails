/**
 * GPS Filter Service - Adaptive filtering for hiking trail recordings
 *
 * This module implements an intelligent GPS filtering pipeline optimized for hiking
 * through forest hills and switchbacks. It balances jitter reduction with accuracy
 * by using adaptive smoothing, turn detection, and altitude management.
 *
 * Key features:
 * - Lightweight Kalman filtering for coordinate smoothing
 * - Turn detection to preserve switchbacks
 * - Adaptive thresholds based on GPS accuracy
 * - Altitude smoothing that preserves cumulative elevation changes
 * - Graceful handling of poor GPS accuracy (no UI freezes)
 * - Separate tracking of display position vs recorded points
 */

import { calculateDistance } from './LocationTracker';

/**
 * Lightweight Kalman Filter for 1D values
 * Smooths GPS noise while remaining responsive to actual movement
 */
class KalmanFilter {
  constructor(processNoise = 0.001, measurementNoise = 5) {
    this.q = processNoise;
    this.r = measurementNoise;
    this.x = null;
    this.p = 1;
  }

  filter(measurement, measurementNoise = null) {
    if (this.x === null) {
      this.x = measurement;
      return measurement;
    }

    const r = measurementNoise !== null ? measurementNoise : this.r;
    const predictionError = this.p + this.q;
    const kalmanGain = predictionError / (predictionError + r);

    this.x = this.x + kalmanGain * (measurement - this.x);
    this.p = (1 - kalmanGain) * predictionError;

    return this.x;
  }

  reset() {
    this.x = null;
    this.p = 1;
  }
}

/**
 * GPS Filter Manager
 * Manages the complete filtering pipeline for GPS coordinates during recording
 */
export class GPSFilterManager {
  constructor() {
    // Kalman filters for smoothing coordinates
    this.latKalman = new KalmanFilter(0.001, 5);
    this.lonKalman = new KalmanFilter(0.001, 5);
    this.altKalman = new KalmanFilter(0.002, 10);

    // State tracking
    this.lastRecordedPoint = null;
    this.lastDisplayPoint = null;
    this.lastTimestamp = null;

    // Altitude tracking for cumulative gain
    this.altitudeWindow = [];
    this.altitudeWindowSize = 5;

    // Filter configuration
    this.config = {
      // Accuracy thresholds (lenient - we handle poor accuracy gracefully)
      maxAccuracyForOptimal: 15,      // meters - below this is great
      maxAccuracyForAcceptable: 50,   // meters - above this we're more cautious

      // Distance thresholds
      minTurnDistance: 2.5,           // meters - min distance for turns
      minStraightDistance: 6,         // meters - min distance for straight segments

      // Turn detection
      turnAngleThreshold: 25,         // degrees - heading change to detect turn

      // Altitude
      minAltitudeChangeForRecord: 1.5, // meters - minimum to record altitude change

      // Time-based fallback
      maxTimeSinceLastRecord: 8000,   // ms - force record if no update in this time
    };
  }

  /**
   * Reset filter state (call when starting new recording or resuming)
   */
  reset() {
    this.latKalman.reset();
    this.lonKalman.reset();
    this.altKalman.reset();
    this.lastRecordedPoint = null;
    this.lastDisplayPoint = null;
    this.lastTimestamp = null;
    this.altitudeWindow = [];
  }

  /**
   * Calculate bearing between two points
   */
  calculateBearing(p1, p2) {
    const lat1 = p1.latitude * Math.PI / 180;
    const lat2 = p2.latitude * Math.PI / 180;
    const dLon = (p2.longitude - p1.longitude) * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  }

  /**
   * Calculate heading change between three points
   */
  calculateHeadingChange(p1, p2, p3) {
    const bearing1 = this.calculateBearing(p1, p2);
    const bearing2 = this.calculateBearing(p2, p3);

    let diff = Math.abs(bearing2 - bearing1);
    if (diff > 180) diff = 360 - diff;

    return diff;
  }

  /**
   * Apply Kalman smoothing to coordinates
   */
  applySmoothing(location) {
    const accuracy = location.accuracy || location.horizontalAccuracy || 10;
    const verticalAccuracy = location.verticalAccuracy || location.altitudeAccuracy || 15;

    const smoothedLat = this.latKalman.filter(location.latitude, accuracy);
    const smoothedLon = this.lonKalman.filter(location.longitude, accuracy);
    const smoothedAlt = location.altitude != null
      ? this.altKalman.filter(location.altitude, verticalAccuracy)
      : null;

    return {
      ...location,
      latitude: smoothedLat,
      longitude: smoothedLon,
      altitude: smoothedAlt,
      smoothed: true,
    };
  }

  /**
   * Smooth altitude using moving average while preserving cumulative changes
   */
  smoothAltitude(altitude, previousAltitude) {
    if (altitude == null) return null;

    // Add to moving average window
    this.altitudeWindow.push(altitude);
    if (this.altitudeWindow.length > this.altitudeWindowSize) {
      this.altitudeWindow.shift();
    }

    // Calculate moving average
    const smoothed = this.altitudeWindow.reduce((a, b) => a + b, 0) / this.altitudeWindow.length;

    // For recording purposes, only update if change is significant
    // This prevents micro-jitter while preserving cumulative gain
    if (previousAltitude != null) {
      const change = Math.abs(smoothed - previousAltitude);
      if (change < this.config.minAltitudeChangeForRecord) {
        return previousAltitude;
      }
    }

    return smoothed;
  }

  /**
   * Determine if we should record this point based on distance, time, and heading
   */
  shouldRecordPoint(smoothedLocation) {
    // Always record first point
    if (!this.lastRecordedPoint) {
      return true;
    }

    const distance = calculateDistance(
      this.lastRecordedPoint.latitude,
      this.lastRecordedPoint.longitude,
      smoothedLocation.latitude,
      smoothedLocation.longitude
    );

    // Check if too much time has passed (handle GPS gaps gracefully)
    const timeSinceLastRecord = smoothedLocation.timestamp - this.lastTimestamp;
    if (timeSinceLastRecord > this.config.maxTimeSinceLastRecord) {
      return distance >= this.config.minTurnDistance;
    }

    // Accuracy-aware minimum threshold
    const accuracy = smoothedLocation.accuracy || 10;
    const accuracyAwareMin = Math.max(
      this.config.minTurnDistance,
      accuracy * 0.3
    );

    // Must meet minimum movement threshold
    if (distance < accuracyAwareMin) {
      return false;
    }

    // Detect turns using heading change
    if (this.lastDisplayPoint) {
      const headingChange = this.calculateHeadingChange(
        this.lastRecordedPoint,
        this.lastDisplayPoint,
        smoothedLocation
      );

      // If turning, use smaller distance threshold to preserve switchbacks
      if (headingChange >= this.config.turnAngleThreshold) {
        return distance >= this.config.minTurnDistance;
      }
    }

    // For straight segments, use larger threshold to reduce jitter
    return distance >= this.config.minStraightDistance;
  }

  /**
   * Process a new GPS location through the filtering pipeline
   *
   * Returns both:
   * - displayLocation: smoothed position for UI (always updated)
   * - recordedLocation: point to add to saved track (only when shouldRecord is true)
   */
  processLocation(location) {
    // Normalize location data
    const normalizedLocation = {
      latitude: location.coords?.latitude ?? location.latitude,
      longitude: location.coords?.longitude ?? location.longitude,
      altitude: location.coords?.altitude ?? location.altitude ?? null,
      accuracy: location.coords?.accuracy ?? location.accuracy ?? null,
      horizontalAccuracy: location.coords?.accuracy ?? location.horizontalAccuracy ?? null,
      verticalAccuracy: location.coords?.altitudeAccuracy ?? location.verticalAccuracy ?? null,
      timestamp: location.timestamp ?? Date.now(),
    };

    // Apply Kalman smoothing
    const smoothedLocation = this.applySmoothing(normalizedLocation);

    // Always update display position (this prevents UI freezing)
    this.lastDisplayPoint = smoothedLocation;

    // Determine if we should record this point
    const shouldRecord = this.shouldRecordPoint(smoothedLocation);

    let recordedLocation = null;
    if (shouldRecord) {
      // Apply altitude smoothing for recorded point
      const smoothedAltitude = smoothedLocation.altitude != null
        ? this.smoothAltitude(
            smoothedLocation.altitude,
            this.lastRecordedPoint?.altitude
          )
        : null;

      recordedLocation = {
        ...smoothedLocation,
        altitude: smoothedAltitude,
        heading: this.lastRecordedPoint
          ? this.calculateBearing(this.lastRecordedPoint, smoothedLocation)
          : null,
      };

      this.lastRecordedPoint = recordedLocation;
      this.lastTimestamp = normalizedLocation.timestamp;
    }

    return {
      shouldRecord,
      recordedLocation,
      displayLocation: smoothedLocation,
    };
  }

  /**
   * Get the current display position
   * This is always the latest smoothed position, even if not recorded
   */
  getDisplayLocation() {
    return this.lastDisplayPoint;
  }

  /**
   * Get the last recorded point
   */
  getLastRecordedPoint() {
    return this.lastRecordedPoint;
  }
}

/**
 * Create a new GPS filter instance
 */
export function createGPSFilter() {
  return new GPSFilterManager();
}
