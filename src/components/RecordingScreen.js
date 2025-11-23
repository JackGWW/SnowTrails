import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tracker from '../services/LocationTracker';

Mapbox.setAccessToken('pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg');

const INITIAL_COORDINATE = [-80.351933, 44.519949];

function formatDistance(meters) {
  return (meters / 1000).toFixed(2);
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function formatElevation(meters) {
  return Math.round(meters);
}

const RecordingScreen = () => {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  const [state, setState] = useState(tracker.getState());
  const [currentDuration, setCurrentDuration] = useState(state.durationMs);
  const [initialCenter, setInitialCenter] = useState(INITIAL_COORDINATE);

  useEffect(() => {
    const subscription = tracker.subscribe((nextState) => {
      setState(nextState);
    });

    return () => subscription();
  }, []);

  useEffect(() => {
    let intervalId;
    if (state.isRecording && !state.isPaused) {
      intervalId = setInterval(() => {
        setCurrentDuration(tracker.getDurationMs());
      }, 1000);
    } else {
      setCurrentDuration(state.durationMs);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.isRecording, state.isPaused, state.durationMs]);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (location?.coords) {
          setInitialCenter([location.coords.longitude, location.coords.latitude]);
        }
      } catch (error) {
        console.warn('Could not fetch current position:', error);
      }
    }

    fetchLocation();
  }, []);

  useEffect(() => {
    if (cameraRef.current && state.lastLocation && state.isRecording && !state.isPaused) {
      cameraRef.current.setCamera({
        centerCoordinate: [state.lastLocation.longitude, state.lastLocation.latitude],
        animationDuration: 500,
      });
    }
  }, [state.lastLocation, state.isRecording, state.isPaused]);

  const routeShape = useMemo(() => state.geoJson, [state.geoJson]);

  const handleStart = async () => {
    try {
      await tracker.startRecording();
    } catch (error) {
      console.warn('Unable to start recording:', error);
    }
  };

  const handlePause = async () => {
    await tracker.pauseRecording();
    setCurrentDuration(tracker.getDurationMs());
  };

  const handleResume = async () => {
    try {
      await tracker.resumeRecording();
    } catch (error) {
      console.warn('Unable to resume recording:', error);
    }
  };

  const handleClear = async () => {
    await tracker.clearRecording();
    setCurrentDuration(0);
  };

  const isIdle = !state.isRecording;
  const isActive = state.isRecording && !state.isPaused;

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Outdoors}>
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={initialCenter}
          zoomLevel={14}
          followUserLocation={isActive}
          followUserMode="normal"
        />
        <Mapbox.UserLocation visible showsUserHeadingIndicator />
        {state.route.length > 0 && (
          <Mapbox.ShapeSource id="route" shape={routeShape}>
            <Mapbox.LineLayer
              id="route-line"
              style={styles.routeLine}
              belowLayerID="waterway-label"
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      <View style={[styles.statsContainer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.statRow}>
          <StatBlock label="Distance" value={`${formatDistance(state.distance)} km`} />
          <StatBlock label="Time" value={formatDuration(currentDuration)} />
          <StatBlock label="Elevation" value={`${formatElevation(state.elevationGain)} m`} />
        </View>

        <View style={styles.buttonRow}>
          {isIdle && (
            <PrimaryButton label="Start Recording" onPress={handleStart} />
          )}

          {isActive && (
            <>
              <SecondaryButton label="Pause" onPress={handlePause} />
              <SecondaryButton label="Clear" onPress={handleClear} variant="danger" />
            </>
          )}

          {state.isPaused && (
            <>
              <SecondaryButton label="Resume" onPress={handleResume} />
              <SecondaryButton label="Clear" onPress={handleClear} variant="danger" />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const StatBlock = ({ label, value }) => (
  <View style={styles.statBlock}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const PrimaryButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{label}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({ label, onPress, variant = 'default' }) => (
  <TouchableOpacity
    style={[styles.secondaryButton, variant === 'danger' && styles.dangerButton]}
    onPress={onPress}
  >
    <Text style={[styles.secondaryButtonText, variant === 'danger' && styles.dangerButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  map: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBlock: {
    flex: 1,
    marginHorizontal: 6,
    padding: 12,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  statValue: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#0b3d1a',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '700',
  },
  dangerButton: {
    backgroundColor: '#7f1d1d',
    borderColor: '#b91c1c',
  },
  dangerButtonText: {
    color: '#fecdd3',
  },
  routeLine: {
    lineColor: '#22c55e',
    lineWidth: 4,
    lineCap: 'round',
    lineJoin: 'round',
  },
});

export default RecordingScreen;
