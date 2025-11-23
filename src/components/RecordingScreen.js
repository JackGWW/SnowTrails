import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import AllTrails from './trails/AllTrails';
import CustomMarker from './markers/CustomMarker';

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

// Marker icons
let circleIcon = require('../../assets/trailMarkers/circle.svg');
let squareIcon = require('../../assets/trailMarkers/square.svg');
let diamondIcon = require('../../assets/trailMarkers/diamond.svg');
let benchIcon = require('../../assets/trailMarkers/bench.png');
let invisibleIcon = require('../../assets/trailMarkers/invisible.png');

// Recording states
const RecordingState = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PAUSED: 'paused',
};

// Format time with smart hours display
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function RecordingScreenComponent({ bottomInset }) {
  const [recordingState, setRecordingState] = useState(RecordingState.IDLE);
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [longitudeDelta, setLongitudeDelta] = useState(0.011);

  // Trail marker data
  const [coordinateMapping] = useState(require('../../data/coordinate_mapping.json'));
  const [trailMapping] = useState(require('../../data/trail_mapping.json'));
  const [hiddenMarker, setHiddenMarker] = useState({
    latitude: 44.518,
    longitude: -80.353,
    name: '',
    description: '',
  });

  const cameraRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const timerRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const hiddenMarkerRef = useRef(null);
  const markerIconCache = useRef(new Map());

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

  // Marker size based on zoom level
  const getMarkerSize = (delta) => {
    switch (true) {
      case delta < 0.0025:
        return 35;
      case delta < 0.003:
        return 32;
      case delta < 0.0035:
        return 29;
      case delta < 0.0042:
        return 26;
      case delta < 0.005:
        return 23;
      case delta < 0.0065:
        return 20;
      case delta < 0.008:
        return 18;
      case delta < 0.01:
        return 16;
      case delta < 0.0119:
        return 14;
      case delta < 0.0187:
        return 11;
      case delta < 0.02:
        return 10;
      case delta < 0.025:
        return 9;
      default:
        return 8;
    }
  };

  const createIconDescriptor = (source, size) => {
    const roundedSize = Math.max(1, Math.round(size));
    return Object.freeze({
      source,
      width: roundedSize,
      height: roundedSize,
    });
  };

  const getMarkerImages = () => {
    const size = getMarkerSize(longitudeDelta);

    if (markerIconCache.current.has(size)) {
      return markerIconCache.current.get(size);
    }

    const icons = {
      Circle: createIconDescriptor(circleIcon, size),
      Square: createIconDescriptor(squareIcon, size),
      Diamond: createIconDescriptor(diamondIcon, size),
      Bench: createIconDescriptor(benchIcon, size * 1.2),
      Invisible: createIconDescriptor(invisibleIcon, 1),
    };

    markerIconCache.current.set(size, icons);
    return icons;
  };

  const updateRegion = async () => {
    if (!cameraRef.current) return;

    try {
      const zoom = await cameraRef.current.getZoom();
      const zoomLevel = zoom || 15;
      const delta = 360 / Math.pow(2, zoomLevel);
      setLongitudeDelta(delta);
    } catch (error) {
      console.warn('Could not get camera zoom:', error);
    }
  };

  const toggle3DMode = () => {
    const newMode = !is3DMode;
    setIs3DMode(newMode);

    if (cameraRef.current) {
      cameraRef.current.setCamera({
        pitch: newMode ? 45 : 0,
        animationDuration: 500,
      });
    }
  };

  const getCoordinateKey = (coordinate, latDecimals, longDecimals) => {
    return coordinate.latitude.toFixed(latDecimals) + ',' + coordinate.longitude.toFixed(longDecimals);
  };

  const updateHiddenMarker = (coordinateKey) => {
    const coordinateInfo = coordinateMapping[coordinateKey];
    const trailInfo = trailMapping[coordinateInfo.trail];
    const trailName = trailInfo.name;
    let trailDescription = trailInfo.description;

    if (trailDescription === '') {
      trailDescription = null;
    }

    setHiddenMarker({
      latitude: coordinateInfo.lat,
      longitude: coordinateInfo.lon,
      name: trailName,
      description: trailDescription,
    });

    // Give marker time to update before displaying
    setTimeout(() => {
      if (hiddenMarkerRef.current) {
        hiddenMarkerRef.current.displayTrailName(false);
      }
    }, 10);
  };

  const onMapPress = (event) => {
    const { geometry } = event;
    if (!geometry || !geometry.coordinates) return;

    const coordinate = {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    };

    let coordinateKey = getCoordinateKey(coordinate, 4, 4);
    if (coordinateKey in coordinateMapping) {
      updateHiddenMarker(coordinateKey);
      return;
    }

    coordinateKey = getCoordinateKey(coordinate, 4, 3);
    if (coordinateKey in coordinateMapping) {
      updateHiddenMarker(coordinateKey);
      return;
    }

    coordinateKey = getCoordinateKey(coordinate, 3, 4);
    if (coordinateKey in coordinateMapping) {
      updateHiddenMarker(coordinateKey);
      return;
    }

    coordinateKey = getCoordinateKey(coordinate, 3, 3);
    if (coordinateKey in coordinateMapping) {
      updateHiddenMarker(coordinateKey);
      return;
    }

    // If tapped somewhere else (not on a trail), hide the callout
    if (hiddenMarkerRef.current) {
      hiddenMarkerRef.current.hideCallout();
    }
  };

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
  const markerImages = getMarkerImages();
  const longitudeDeltaStr = longitudeDelta.toFixed(5);

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
        onPress={onMapPress}
        onMapIdle={updateRegion}
      >
        <Mapbox.RasterDemSource
          id="mapbox-dem"
          url="mapbox://mapbox.terrain-rgb"
          tileSize={514}
          maxZoomLevel={14}
        >
          <Mapbox.Terrain sourceID="mapbox-dem" style={{ exaggeration: 1.5 }} />
        </Mapbox.RasterDemSource>

        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [-80.351933, 44.519949],
            zoomLevel: 15,
          }}
          minZoomLevel={14}
          maxZoomLevel={18}
          maxBounds={[
            [-80.398, 44.507], // Southwest
            [-80.328, 44.539], // Northeast
          ]}
          followUserLocation={recordingState === RecordingState.RECORDING}
          followUserMode="compass"
          followZoomLevel={16}
        />

        <Mapbox.LocationPuck pulsing={{ isEnabled: true }} puckBearingEnabled={true} puckBearing="heading" />

        {/* All trails */}
        <AllTrails longitudeDelta={longitudeDeltaStr} markerImages={markerImages} />

        {/* Bench marker */}
        <CustomMarker
          longitudeDelta={longitudeDeltaStr}
          location={{ latitude: 44.512641029432416, longitude: -80.363259455189109 }}
          trailName={'The Bench'}
          trailDescription={'Lookout point'}
          icon={markerImages['Bench']}
          id={'recording-bench'}
        />

        {/* Hidden marker for trail taps */}
        <CustomMarker
          longitudeDelta={'0'}
          location={{ latitude: hiddenMarker.latitude, longitude: hiddenMarker.longitude }}
          trailName={hiddenMarker.name}
          trailDescription={hiddenMarker.description}
          icon={markerImages['Invisible']}
          id={'recording-hidden'}
          ref={hiddenMarkerRef}
          key={hiddenMarker.latitude}
          tappable={false}
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

      {/* 3D Toggle Button */}
      <TouchableHighlight
        style={[styles.terrainButtonContainer, { bottom: 140 + bottomInset }]}
        activeOpacity={0.7}
        underlayColor="#F0F0F0"
        onPress={toggle3DMode}
      >
        <View style={styles.terrainButton}>
          <Text style={styles.terrainButtonText}>{is3DMode ? '2D' : '3D'}</Text>
        </View>
      </TouchableHighlight>

      {/* Control Buttons - floating above stats */}
      <View style={[styles.controlsContainer, { bottom: 80 + bottomInset }]}>
        {recordingState === RecordingState.IDLE && (
          <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleStartRecording} activeOpacity={0.8}>
            <Ionicons name="radio-button-on" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        )}

        {recordingState === RecordingState.RECORDING && (
          <>
            <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={handlePauseRecording} activeOpacity={0.8}>
              <Ionicons name="pause" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearRecording} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </>
        )}

        {recordingState === RecordingState.PAUSED && (
          <>
            <TouchableOpacity style={[styles.button, styles.resumeButton]} onPress={handleResumeRecording} activeOpacity={0.8}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearRecording} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Stats Bar - sits above tab bar */}
      <View style={[styles.statsBar, { paddingBottom: 8 }]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDistance(distance)}</Text>
          <Text style={styles.statLabel}>km</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.statLabel}>time</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatElevation(elevationGain)}</Text>
          <Text style={styles.statLabel}>m gain</Text>
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
  terrainButtonContainer: {
    position: 'absolute',
    right: 16,
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  terrainButton: {
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terrainButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E3A52',
    letterSpacing: 0.5,
  },
  controlsContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
  statsBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E3A52',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E5EA',
  },
});

// Wrapper component to provide safe area insets
export default function RecordingScreen(props) {
  const insets = useSafeAreaInsets();
  return <RecordingScreenComponent {...props} bottomInset={insets.bottom} />;
}
