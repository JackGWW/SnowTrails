import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import {
  requestBackgroundPermissions,
  startTracking,
  stopTracking,
  subscribeToLocationUpdates,
  shouldAddCoordinate,
  calculateTotalDistance,
  calculateElevationGain,
  formatDuration,
  formatDistance,
  formatElevation,
} from '../services/LocationTracker';

// Recording states
const RecordingState = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PAUSED: 'paused',
};

function RecordingScreenComponent({ bottomInset }) {
  const [recordingState, setRecordingState] = useState(RecordingState.IDLE);
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);

  const cameraRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const timerRef = useRef(null);
  const unsubscribeRef = useRef(null);

  // Update timer every second while recording
  useEffect(() => {
    if (recordingState === RecordingState.RECORDING) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000) + pausedTimeRef.current;
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  // Handle new location updates
  const handleLocationUpdate = useCallback(
    (location) => {
      if (recordingState !== RecordingState.RECORDING) return;

      setCurrentLocation(location);

      setCoordinates((prev) => {
        const lastCoord = prev.length > 0 ? prev[prev.length - 1] : null;

        if (shouldAddCoordinate(location, lastCoord)) {
          const newCoords = [...prev, location];
          // Update distance and elevation
          setDistance(calculateTotalDistance(newCoords));
          setElevationGain(calculateElevationGain(newCoords));
          return newCoords;
        }
        return prev;
      });
    },
    [recordingState]
  );

  // Subscribe to location updates when recording starts
  useEffect(() => {
    if (recordingState === RecordingState.RECORDING) {
      unsubscribeRef.current = subscribeToLocationUpdates(handleLocationUpdate);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [recordingState, handleLocationUpdate]);

  const handleStartRecording = async () => {
    // Request permissions
    const permResult = await requestBackgroundPermissions();
    if (!permResult.granted) {
      Alert.alert(
        'Location Permission Required',
        permResult.reason === 'background'
          ? 'Background location access is required to record your route while the app is in the background. Please enable it in Settings.'
          : 'Location access is required to record your route.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Start background tracking
    const started = await startTracking();
    if (!started) {
      Toast.show({
        type: 'error',
        text1: 'Failed to start recording',
        text2: 'Could not start location tracking',
        position: 'bottom',
      });
      return;
    }

    // Initialize recording state
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setRecordingState(RecordingState.RECORDING);

    Toast.show({
      type: 'success',
      text1: 'Recording started',
      text2: 'Your route is being tracked',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const handlePauseRecording = async () => {
    // Stop background tracking
    await stopTracking();

    // Save elapsed time
    pausedTimeRef.current = elapsedTime;
    setRecordingState(RecordingState.PAUSED);

    Toast.show({
      type: 'info',
      text1: 'Recording paused',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const handleResumeRecording = async () => {
    // Resume background tracking
    const started = await startTracking();
    if (!started) {
      Toast.show({
        type: 'error',
        text1: 'Failed to resume recording',
        position: 'bottom',
      });
      return;
    }

    // Reset start time (pausedTimeRef already has accumulated time)
    startTimeRef.current = Date.now();
    setRecordingState(RecordingState.RECORDING);

    Toast.show({
      type: 'success',
      text1: 'Recording resumed',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  const handleClearRecording = () => {
    Alert.alert(
      'Clear Recording',
      'Are you sure you want to clear the current recording? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await stopTracking();
            setRecordingState(RecordingState.IDLE);
            setCoordinates([]);
            setDistance(0);
            setElevationGain(0);
            setElapsedTime(0);
            startTimeRef.current = null;
            pausedTimeRef.current = 0;
          },
        },
      ]
    );
  };

  // Convert coordinates to GeoJSON format for Mapbox
  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates.map((coord) => [coord.longitude, coord.latitude]),
    },
  };

  const hasRoute = coordinates.length > 1;

  return (
    <View style={styles.container}>
      {/* Map */}
      <Mapbox.MapView
        style={styles.map}
        styleURL="https://api.mapbox.com/styles/v1/jackgww/ckixum56n651w19npcrja4rnq?access_token=pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg"
        compassEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        logoEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [-80.351933, 44.519949],
            zoomLevel: 15,
          }}
          followUserLocation={recordingState === RecordingState.RECORDING}
          followUserMode="compass"
          followZoomLevel={16}
        />

        <Mapbox.LocationPuck
          pulsing={{ isEnabled: true }}
          puckBearingEnabled={true}
          puckBearing="heading"
        />

        {/* Recorded route line */}
        {hasRoute && (
          <Mapbox.ShapeSource id="recorded-route-source" shape={routeGeoJSON}>
            <Mapbox.LineLayer
              id="recorded-route-line"
              style={{
                lineColor: '#FF6B35',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      {/* Stats Panel */}
      <View style={[styles.statsPanel, { paddingBottom: 16 + bottomInset }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatDistance(distance)}</Text>
            <Text style={styles.statLabel}>km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatDuration(elapsedTime)}</Text>
            <Text style={styles.statLabel}>time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatElevation(elevationGain)}</Text>
            <Text style={styles.statLabel}>m ↑</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          {recordingState === RecordingState.IDLE && (
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={handleStartRecording}
              activeOpacity={0.8}
            >
              <Ionicons name="radio-button-on" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          )}

          {recordingState === RecordingState.RECORDING && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={handlePauseRecording}
                activeOpacity={0.8}
              >
                <Ionicons name="pause" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClearRecording}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </>
          )}

          {recordingState === RecordingState.PAUSED && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.resumeButton]}
                onPress={handleResumeRecording}
                activeOpacity={0.8}
              >
                <Ionicons name="play" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClearRecording}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  map: {
    flex: 1,
  },
  statsPanel: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2E3A52',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    minWidth: 140,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#34C759',
    minWidth: 200,
  },
  pauseButton: {
    backgroundColor: '#FF9500',
    flex: 1,
  },
  resumeButton: {
    backgroundColor: '#34C759',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    flex: 1,
  },
});

// Wrapper component to provide safe area insets
export default function RecordingScreen(props) {
  const insets = useSafeAreaInsets();
  return <RecordingScreenComponent {...props} bottomInset={insets.bottom} />;
}
