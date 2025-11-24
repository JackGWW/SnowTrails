import { calculateDistance } from './LocationTracker';

const DEFAULT_CONFIG = {
  minProgressMeters: 3,
  maxAccuracyMeters: 60,
  staleLocationMs: 8000,
  switchbackHeadingChange: 22,
  minSwitchbackDistance: 1.5,
  smoothingDistanceThreshold: 7,
  verticalNoiseThreshold: 1.2,
  minAltitudeCommit: 1,
};

const toRadians = (degrees) => degrees * (Math.PI / 180);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const normalizeSample = (location) => {
  if (!location) return null;
  const coords = location.coords ?? location;
  const latitude = coords?.latitude ?? location.latitude ?? null;
  const longitude = coords?.longitude ?? location.longitude ?? null;

  if (latitude == null || longitude == null) {
    return null;
  }

  return {
    latitude,
    longitude,
    altitude: coords?.altitude ?? location.altitude ?? null,
    accuracy: coords?.accuracy ?? location.accuracy ?? null,
    horizontalAccuracy: coords?.accuracy ?? location.horizontalAccuracy ?? null,
    verticalAccuracy:
      coords?.altitudeAccuracy ??
      location.altitudeAccuracy ??
      location.verticalAccuracy ??
      null,
    timestamp: location.timestamp ?? Date.now(),
    speed: coords?.speed ?? location.speed ?? null,
  };
};

const calculateBearing = (start, end) => {
  if (!start || !end) return null;
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

const headingDelta = (currentHeading, previousHeading) => {
  if (currentHeading == null || previousHeading == null) return 0;
  const rawDelta = Math.abs(currentHeading - previousHeading);
  return rawDelta > 180 ? 360 - rawDelta : rawDelta;
};

const smoothCoordinate = (previousCoord, newCoord, distance, accuracy, config) => {
  if (!previousCoord) return newCoord;
  const needsSmoothing =
    distance < config.smoothingDistanceThreshold ||
    (accuracy != null && accuracy > 12);

  if (!needsSmoothing) {
    return newCoord;
  }

  const weight = clamp((accuracy ?? 10) / 50, 0.25, 0.65);

  return {
    ...newCoord,
    latitude:
      previousCoord.latitude +
      (newCoord.latitude - previousCoord.latitude) * (1 - weight),
    longitude:
      previousCoord.longitude +
      (newCoord.longitude - previousCoord.longitude) * (1 - weight),
  };
};

export class GPSFilter {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.lastRecorded = null;
    this.lastDisplay = null;
    this.altitudeDriftDisplay = 0;
    this.altitudeDriftRecorded = 0;
  }

  reset(anchor = null) {
    this.lastRecorded = anchor;
    this.lastDisplay = anchor;
    this.altitudeDriftDisplay = 0;
    this.altitudeDriftRecorded = 0;
  }

  smoothAltitude(previousAlt, newAlt, channel) {
    const driftKey =
      channel === 'display' ? 'altitudeDriftDisplay' : 'altitudeDriftRecorded';

    if (newAlt == null) {
      return previousAlt ?? null;
    }

    if (previousAlt == null) {
      this[driftKey] = 0;
      return newAlt;
    }

    const diff = newAlt - previousAlt;
    const absDiff = Math.abs(diff);

    if (absDiff < this.config.verticalNoiseThreshold) {
      this[driftKey] += diff;
      if (Math.abs(this[driftKey]) >= this.config.minAltitudeCommit) {
        const committed = this[driftKey] * 0.65;
        this[driftKey] = 0;
        return previousAlt + committed;
      }
      return previousAlt + diff * 0.35;
    }

    this[driftKey] = 0;
    return previousAlt + diff * 0.65;
  }

  processSample(location) {
    const normalized = normalizeSample(location);

    if (!normalized) {
      return { displayCoordinate: this.lastDisplay, recordedCoordinate: null };
    }

    const accuracy = normalized.horizontalAccuracy ?? normalized.accuracy ?? null;
    const candidateDisplay = this.createDisplayCoordinate(normalized, accuracy);
    this.lastDisplay = candidateDisplay;

    if (!this.lastRecorded) {
      const initialCoordinate = {
        ...candidateDisplay,
        heading: null,
      };
      this.lastRecorded = initialCoordinate;
      return {
        displayCoordinate: candidateDisplay,
        recordedCoordinate: initialCoordinate,
      };
    }

    const shouldRecord = this.shouldRecordCoordinate(candidateDisplay, accuracy);

    if (!shouldRecord) {
      return {
        displayCoordinate: candidateDisplay,
        recordedCoordinate: null,
      };
    }

    const heading = calculateBearing(this.lastRecorded, candidateDisplay);
    const smoothedRecorded = {
      ...candidateDisplay,
      heading,
      altitude: this.smoothAltitude(
        this.lastRecorded.altitude,
        candidateDisplay.altitude,
        'recorded'
      ),
    };

    this.lastRecorded = smoothedRecorded;

    return {
      displayCoordinate: candidateDisplay,
      recordedCoordinate: smoothedRecorded,
    };
  }

  createDisplayCoordinate(normalized, accuracy) {
    const distanceFromDisplay = this.lastDisplay
      ? calculateDistance(
          this.lastDisplay.latitude,
          this.lastDisplay.longitude,
          normalized.latitude,
          normalized.longitude
        )
      : 0;

    const smoothedPosition = smoothCoordinate(
      this.lastDisplay,
      normalized,
      distanceFromDisplay,
      accuracy,
      this.config
    );

    return {
      ...smoothedPosition,
      altitude: this.smoothAltitude(
        this.lastDisplay?.altitude ?? null,
        smoothedPosition.altitude,
        'display'
      ),
    };
  }

  shouldRecordCoordinate(candidate, accuracy) {
    const distance = calculateDistance(
      this.lastRecorded.latitude,
      this.lastRecorded.longitude,
      candidate.latitude,
      candidate.longitude
    );

    const timeDelta =
      candidate.timestamp && this.lastRecorded.timestamp
        ? candidate.timestamp - this.lastRecorded.timestamp
        : this.config.staleLocationMs + 1;

    const bearing = calculateBearing(this.lastRecorded, candidate);
    const headingChange = headingDelta(bearing, this.lastRecorded.heading);

    const accuracyAwareThreshold = Math.max(
      this.config.minProgressMeters,
      (accuracy ?? 0) * 0.25
    );
    const movedEnough = distance >= accuracyAwareThreshold;
    const isStale = timeDelta > this.config.staleLocationMs;
    const turnDetected =
      headingChange >= this.config.switchbackHeadingChange &&
      distance >= this.config.minSwitchbackDistance;

    if (
      accuracy != null &&
      accuracy > this.config.maxAccuracyMeters &&
      distance < accuracy * 0.5 &&
      !isStale
    ) {
      return false;
    }

    if (!movedEnough && !turnDetected && !isStale) {
      return false;
    }

    return true;
  }

  getCurrentPosition() {
    return this.lastDisplay;
  }
}

export function createGPSFilter(config) {
  return new GPSFilter(config);
}
