/**
 * GPS Filter Service - Multi-stage filtering for accurate route recording
 *
 * This module implements a sophisticated GPS filtering pipeline that:
 * - Reduces jitter while maintaining accuracy
 * - Preserves switchback turns
 * - Smooths altitude data to prevent elevation gain inflation
 * - Keeps the UI responsive with current position updates
 */

import { calculateDistance } from './LocationTracker';

/**
 * Simple Kalman Filter for GPS coordinates
 *
 * Uses a 1D Kalman filter to smooth GPS noise while remaining responsive
 * to actual movement. Separate filters are used for lat, lon, and altitude.
 */
class KalmanFilter {
  constructor(processNoise = 0.001, measurementNoise = 5, initialEstimate = 0) {
    this.q = processNoise;        // Process noise (how much we expect the value to change)
    this.r = measurementNoise;    // Measurement noise (GPS accuracy)
    this.x = initialEstimate;     // Estimated value
    this.p = 1;                   // Error covariance
    this.initialized = false;
  }

  filter(measurement, measurementNoise = null) {
    if (!this.initialized) {
      this.x = measurement;
      this.initialized = true;
      return measurement;
    }

    // Use provided measurement noise if available (GPS accuracy)
    const r = measurementNoise !== null ? measurementNoise : this.r;

    // Prediction
    const predictionError = this.p + this.q;

    // Update
    const kalmanGain = predictionError / (predictionError + r);
    this.x = this.x + kalmanGain * (measurement - this.x);
    this.p = (1 - kalmanGain) * predictionError;

    return this.x;
  }

  reset() {
    this.initialized = false;
    this.p = 1;
  }
}

/**
 * GPS Filter Manager
 *
 * Manages the complete filtering pipeline for GPS coordinates during recording.
 * Uses a multi-stage approach to balance jitter reduction with accuracy.
 */
export class GPSFilterManager {
  constructor() {
    // Kalman filters for smoothing
    this.latKalman = new KalmanFilter(0.001, 5);
    this.lonKalman = new KalmanFilter(0.001, 5);
    this.altKalman = new KalmanFilter(0.002, 10);

    // State tracking
    this.lastRecordedPoint = null;
    this.lastRawPoint = null;
    this.altitudeWindow = []; // For moving average
    this.altitudeWindowSize = 5;

    // Filter thresholds
    this.maxHorizontalAccuracy = 20; // meters - reject points with worse accuracy
    this.maxVerticalAccuracy = 30;   // meters - reject points with worse accuracy
    this.minStraightDistance = 7;    // meters - minimum distance for straight segments
    this.minTurnDistance = 3;        // meters - minimum distance when turning
    this.turnAngleThreshold = 30;    // degrees - angle change to detect turns
    this.minAltitudeChange = 2;      // meters - minimum altitude change to record
  }

  /**
   * Reset the filter state (call when starting a new recording)
   */
  reset() {
    this.latKalman.reset();
    this.lonKalman.reset();
    this.altKalman.reset();
    this.lastRecordedPoint = null;
    this.lastRawPoint = null;
    this.altitudeWindow = [];
  }

  /**
   * Stage 1: Accuracy Filter
   * Reject GPS points with poor accuracy
   */
  passesAccuracyFilter(location) {
    // Always accept if accuracy not provided
    if (!location.accuracy && !location.horizontalAccuracy) {
      return true;
    }

    const horizontalAccuracy = location.horizontalAccuracy || location.accuracy;
    if (horizontalAccuracy && horizontalAccuracy > this.maxHorizontalAccuracy) {
      return false;
    }

    const verticalAccuracy = location.verticalAccuracy || location.altitudeAccuracy;
    if (verticalAccuracy && verticalAccuracy > this.maxVerticalAccuracy) {
      return false;
    }

    return true;
  }

  /**
   * Stage 2: Kalman Smoothing
   * Apply Kalman filter to reduce GPS noise
   */
  applyKalmanFilter(location) {
    const horizontalAccuracy = location.horizontalAccuracy || location.accuracy || 5;
    const verticalAccuracy = location.verticalAccuracy || location.altitudeAccuracy || 10;

    const smoothedLat = this.latKalman.filter(location.latitude, horizontalAccuracy);
    const smoothedLon = this.lonKalman.filter(location.longitude, horizontalAccuracy);
    const smoothedAlt = location.altitude != null
      ? this.altKalman.filter(location.altitude, verticalAccuracy)
      : null;

    return {
      ...location,
      latitude: smoothedLat,
      longitude: smoothedLon,
      altitude: smoothedAlt,
    };
  }

  /**
   * Stage 3: Adaptive Distance/Angle Filter
   * Use different distance thresholds based on direction change
   * - Small threshold for turns (preserves switchbacks)
   * - Normal threshold for straight segments (reduces jitter)
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

    // Need at least minimum turn distance to consider recording
    if (distance < this.minTurnDistance) {
      return false;
    }

    // If we have a previous raw point, check for direction change
    if (this.lastRawPoint) {
      const angleChange = this.calculateAngleChange(
        this.lastRecordedPoint,
        this.lastRawPoint,
        smoothedLocation
      );

      // For significant turns, use smaller distance threshold (preserves switchbacks)
      if (Math.abs(angleChange) > this.turnAngleThreshold) {
        return distance >= this.minTurnDistance;
      }
    }

    // For straight segments, use larger threshold to reduce jitter
    return distance >= this.minStraightDistance;
  }

  /**
   * Calculate angle change between three points
   * Returns angle in degrees (-180 to 180)
   */
  calculateAngleChange(p1, p2, p3) {
    const bearing1 = this.calculateBearing(p1, p2);
    const bearing2 = this.calculateBearing(p2, p3);
    let diff = bearing2 - bearing1;

    // Normalize to -180 to 180
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    return diff;
  }

  /**
   * Calculate bearing between two points in degrees
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
   * Stage 4: Altitude Smoothing
   * Apply moving average and minimum change threshold
   */
  smoothAltitude(altitude) {
    if (altitude == null) {
      return null;
    }

    // Add to window
    this.altitudeWindow.push(altitude);
    if (this.altitudeWindow.length > this.altitudeWindowSize) {
      this.altitudeWindow.shift();
    }

    // Calculate moving average
    const sum = this.altitudeWindow.reduce((a, b) => a + b, 0);
    const smoothedAlt = sum / this.altitudeWindow.length;

    // Only update altitude if change is significant
    if (this.lastRecordedPoint && this.lastRecordedPoint.altitude != null) {
      const altChange = Math.abs(smoothedAlt - this.lastRecordedPoint.altitude);
      if (altChange < this.minAltitudeChange) {
        // Keep previous altitude to prevent micro-changes
        return this.lastRecordedPoint.altitude;
      }
    }

    return smoothedAlt;
  }

  /**
   * Process a new GPS location through the complete filtering pipeline
   *
   * @param {Object} location - Raw GPS location with {latitude, longitude, altitude, timestamp, accuracy}
   * @returns {Object} Result with {shouldRecord: boolean, smoothedLocation: Object}
   */
  processLocation(location) {
    // Stage 1: Check accuracy
    if (!this.passesAccuracyFilter(location)) {
      return {
        shouldRecord: false,
        smoothedLocation: null,
        reason: 'poor_accuracy',
      };
    }

    // Stage 2: Apply Kalman smoothing
    const smoothedLocation = this.applyKalmanFilter(location);

    // Stage 3: Check if we should record this point
    const shouldRecord = this.shouldRecordPoint(smoothedLocation);

    // Stage 4: Apply altitude smoothing (always smooth for display, even if not recording)
    if (smoothedLocation.altitude != null) {
      smoothedLocation.altitude = this.smoothAltitude(smoothedLocation.altitude);
    }

    // Update tracking state
    this.lastRawPoint = smoothedLocation;

    if (shouldRecord) {
      this.lastRecordedPoint = smoothedLocation;
      return {
        shouldRecord: true,
        smoothedLocation: smoothedLocation,
        reason: 'passed_all_filters',
      };
    }

    return {
      shouldRecord: false,
      smoothedLocation: smoothedLocation,
      reason: 'insufficient_distance',
    };
  }

  /**
   * Get the current smoothed position (for UI display)
   * Even if we're not recording a point, we want to show the user's smoothed position
   */
  getCurrentPosition() {
    return this.lastRawPoint;
  }
}

/**
 * Create a new GPS filter instance
 */
export function createGPSFilter() {
  return new GPSFilterManager();
}
