import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ensurePermissionsAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
  subscribeToLocationUpdates,
} from '../services/LocationTracker';

Mapbox.setAccessToken(
  'pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg',
);

const haversineDistance = (start, end) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6371000;
  const lat1 = toRad(start.latitude);
  const lat2 = toRad(end.latitude);
  const deltaLat = toRad(end.latitude - start.latitude);
  const deltaLon = toRad(end.longitude - start.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const formatDuration = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const formatDistanceKm = (meters) => (meters / 1000).toFixed(2);

const RecordingScreen = ({ onRecordingStateChange }) => {
  const [recordingState, setRecordingState] = useState('idle');
  const [routePoints, setRoutePoints] = useState([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  const timerRef = useRef(null);
  const lastPointRef = useRef(null);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedMs((prev) => prev + 1000);
    }, 1000);
  };

  const handleLocationUpdate = useCallback(
    (location) => {
      if (recordingState !== 'recording') {
        return;
      }

      if (!location || !location.coords) {
        return;
      }

      const point = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: typeof location.coords.altitude === 'number'
          ? location.coords.altitude
          : 0,
      };

      const lastPoint = lastPointRef.current;
      if (lastPoint) {
        const delta = haversineDistance(lastPoint, point);
        if (delta < 5) {
          return;
        }

        setDistanceMeters((prev) => prev + delta);
        const altitudeDelta = point.altitude - lastPoint.altitude;
        if (altitudeDelta > 0) {
          setElevationGain((prev) => prev + altitudeDelta);
        }
      }

      lastPointRef.current = point;
      setRoutePoints((prev) => [...prev, point]);
    },
    [recordingState],
  );

  const lineFeature = useMemo(() => {
    if (routePoints.length < 2) {
      return null;
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routePoints.map((point) => [point.longitude, point.latitude]),
      },
    };
  }, [routePoints]);

  useEffect(() => {
    onRecordingStateChange?.(recordingState === 'recording');
  }, [onRecordingStateChange, recordingState]);

  useEffect(() => {
    const unsubscribe = subscribeToLocationUpdates((location) => {
      handleLocationUpdate(location);
    });

    return () => {
      unsubscribe();
      stopTimer();
      stopLocationUpdatesAsync();
    };
  }, [handleLocationUpdate]);

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      setRoutePoints([]);
      setDistanceMeters(0);
      setElevationGain(0);
      setElapsedMs(0);
      lastPointRef.current = null;

      await ensurePermissionsAsync();
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      if (location && location.coords) {
        const initialPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: typeof location.coords.altitude === 'number'
            ? location.coords.altitude
            : 0,
        };
        lastPointRef.current = initialPoint;
        setRoutePoints([initialPoint]);
      }

      setRecordingState('recording');
      setIsFollowing(true);
      startTimer();
      await startLocationUpdatesAsync();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to start recording');
      setRecordingState('idle');
      setIsFollowing(false);
    }
  };

  const pauseRecording = async () => {
    await stopLocationUpdatesAsync();
    setRecordingState('paused');
    setIsFollowing(false);
    stopTimer();
  };

  const resumeRecording = async () => {
    try {
      await startLocationUpdatesAsync();
      setRecordingState('recording');
      setIsFollowing(true);
      startTimer();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to resume recording');
    }
  };

  const clearRecording = async () => {
    await stopLocationUpdatesAsync();
    stopTimer();
    setRecordingState('idle');
    setRoutePoints([]);
    setDistanceMeters(0);
    setElevationGain(0);
    setElapsedMs(0);
    setIsFollowing(false);
    lastPointRef.current = null;
  };

  const renderControls = () => {
    if (recordingState === 'recording') {
      return (
        <View style={styles.controlsRow}>
          <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={pauseRecording}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearRecording}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (recordingState === 'paused') {
      return (
        <View style={styles.controlsRow}>
          <TouchableOpacity style={[styles.button, styles.resumeButton]} onPress={resumeRecording}>
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearRecording}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startRecording}>
        <Text style={styles.buttonText}>Start Recording</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Outdoors}>
        <Mapbox.Camera
          ref={cameraRef}
          followUserLocation={isFollowing}
          followUserMode="normal"
          zoomLevel={14}
        />
        <Mapbox.UserLocation visible showsUserHeadingIndicator animated />
        {lineFeature && (
          <Mapbox.ShapeSource id="routeLine" shape={lineFeature}>
            <Mapbox.LineLayer
              id="routeLayer"
              style={{
                lineColor: '#1679F3',
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      <View style={[styles.panel, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{formatDistanceKm(distanceMeters)} km</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatDuration(elapsedMs)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Elevation</Text>
            <Text style={styles.statValue}>{Math.round(elevationGain)} m</Text>
          </View>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.controlsContainer}>{renderControls()}</View>
      </View>
    </View>
  );
};

RecordingScreen.propTypes = {
  onRecordingStateChange: PropTypes.func,
};

RecordingScreen.defaultProps = {
  onRecordingStateChange: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1f3a',
  },
  map: {
    flex: 1,
  },
  panel: {
    backgroundColor: '#0b1f3a',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  controlsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#1679F3',
    width: '100%',
  },
  pauseButton: {
    backgroundColor: '#FFB703',
  },
  resumeButton: {
    backgroundColor: '#1679F3',
  },
  clearButton: {
    backgroundColor: '#FF4D6D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  errorText: {
    color: '#FF4D6D',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default RecordingScreen;
