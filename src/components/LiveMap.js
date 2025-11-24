import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, TouchableHighlight, TouchableOpacity, Text, Animated, Alert } from "react-native";
import Mapbox from "@rnmapbox/maps";
import Spinner from "react-native-loading-spinner-overlay";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

// Polyline components for all trails
import AllTrails from "./trails/AllTrails";
import CustomMarker from "./markers/CustomMarker";
import {
  requestBackgroundPermissions,
  startTracking,
  stopTracking,
  subscribeToLocationUpdates,
  calculateTotalDistance,
  calculateElevationGain,
  formatDistance,
  formatElevation,
} from '../services/LocationTracker';
import { createGPSFilter } from '../services/GPSFilter';

// Set Mapbox access token
Mapbox.setAccessToken("pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg");

let circleIcon = require("../../assets/trailMarkers/circle.svg")
let squareIcon = require("../../assets/trailMarkers/square.svg")
let diamondIcon = require("../../assets/trailMarkers/diamond.svg")
let benchIcon = require("../../assets/trailMarkers/bench.png")
let invisibleIcon = require("../../assets/trailMarkers/invisible.png")

// Recording states
const RecordingStateEnum = {
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

function LiveMap() {
  const insets = useSafeAreaInsets();

  // Map state
  const [spinner, setSpinner] = useState(true);
  const [longitudeDelta, setLongitudeDelta] = useState(0.011);
  const [currentLatitude, setCurrentLatitude] = useState(44.519);
  const [currentLongitude, setCurrentLongitude] = useState(-80.352);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isUserInBounds, setIsUserInBounds] = useState(false);

  // Location tracking mode: 'off' | 'follow' | 'compass'
  const [locationMode, setLocationMode] = useState('off');

  // Hidden marker state
  const [hiddenMarkerLatitude, setHiddenMarkerLatitude] = useState(44.518);
  const [hiddenMarkerLongitude, setHiddenMarkerLongitude] = useState(-80.353);
  const [hiddenMarkerName, setHiddenMarkerName] = useState("");
  const [hiddenMarkerDescription, setHiddenMarkerDescription] = useState("");

  // Recording state
  const [recordingState, setRecordingState] = useState(RecordingStateEnum.IDLE);
  const [coordinates, setCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Animation for stats panel
  const statsAnimation = useRef(new Animated.Value(0)).current;

  // Refs
  const cameraRef = useRef(null);
  const hiddenMarkerRef = useRef(null);
  const markerIconCache = useRef(new Map());
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const timerRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const gpsFilterRef = useRef(null);

  // Static data
  const coordinateMapping = useRef(require('../../data/coordinate_mapping.json')).current;
  const trailMapping = useRef(require('../../data/trail_mapping.json')).current;

  const mapBounds = {
    northEast: { latitude: 44.539, longitude: -80.328 },
    southWest: { latitude: 44.507, longitude: -80.398 }
  };

  const isWithinBounds = useCallback((lat, lon) => {
    return (
      lat >= mapBounds.southWest.latitude &&
      lat <= mapBounds.northEast.latitude &&
      lon >= mapBounds.southWest.longitude &&
      lon <= mapBounds.northEast.longitude
    );
  }, []);

  // Animate stats panel based on recording state
  useEffect(() => {
    const isActive = recordingState !== RecordingStateEnum.IDLE;
    Animated.spring(statsAnimation, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [recordingState, statsAnimation]);

  // Update timer every second while recording
  useEffect(() => {
    if (recordingState === RecordingStateEnum.RECORDING) {
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

  // Handle new location updates for recording
  const handleLocationUpdate = useCallback(
    (location) => {
      if (recordingState !== RecordingStateEnum.RECORDING) return;

      // Initialize GPS filter if needed
      if (!gpsFilterRef.current) {
        gpsFilterRef.current = createGPSFilter();
      }

      // Process location through GPS filter
      const result = gpsFilterRef.current.processLocation(location);

      // Always update current position for display (smoothed but may not be recorded)
      const smoothedPos = gpsFilterRef.current.getCurrentPosition();
      if (smoothedPos) {
        setCurrentPosition(smoothedPos);
      }

      // Only add to recorded coordinates if filter approves
      if (result.shouldRecord && result.smoothedLocation) {
        setCoordinates((prev) => {
          const newCoords = [...prev, result.smoothedLocation];
          setDistance(calculateTotalDistance(newCoords));
          setElevationGain(calculateElevationGain(newCoords));
          return newCoords;
        });
      }
    },
    [recordingState]
  );

  // Subscribe to location updates when recording starts
  useEffect(() => {
    if (recordingState === RecordingStateEnum.RECORDING) {
      unsubscribeRef.current = subscribeToLocationUpdates(handleLocationUpdate);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [recordingState, handleLocationUpdate]);


  const enableLocationPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission was denied');
    }
  };

  const mapSetup = async () => {
    setSpinner(false);
    await enableLocationPermissions();

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;
      const withinBounds = isWithinBounds(userLat, userLon);

      setIsUserInBounds(withinBounds);
      setCurrentLatitude(userLat);
      setCurrentLongitude(userLon);

      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: withinBounds
            ? [userLon, userLat]
            : [-80.351933, 44.519949],
          zoomLevel: 15,
          pitch: 0,
          heading: 210,
          animationDuration: 0,
        });
      }
    } catch (error) {
      console.log('Could not get user location:', error);
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: [-80.351933, 44.519949],
          zoomLevel: 15,
          pitch: 0,
          heading: 210,
          animationDuration: 0,
        });
      }
    }
  };

  const updateRegion = async () => {
    if (!cameraRef.current) return;

    try {
      const cameraState = await cameraRef.current.getZoom();
      const zoom = cameraState || 15;
      const delta = 360 / Math.pow(2, zoom);
      setLongitudeDelta(delta);
    } catch (error) {
      console.warn('Could not get camera zoom:', error);
    }
  };

  const updateCurrentLocation = (location) => {
    if (location && location.coords) {
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      const inBounds = isWithinBounds(lat, lon);

      setCurrentLatitude(lat);
      setCurrentLongitude(lon);
      setIsUserInBounds(inBounds);

      if (locationMode !== 'off' && !inBounds) {
        setLocationMode('off');
      }
    } else {
      console.warn("updateCurrentLocation: location is undefined or invalid", location);
    }
  };

  const updateHiddenMarker = (coordinateKey) => {
    let coordinateInfo = coordinateMapping[coordinateKey];
    let trailInfo = trailMapping[coordinateInfo.trail];
    let trailName = trailInfo.name;
    let trailDescription = trailInfo.description;

    if (trailDescription === "") {
      trailDescription = null;
    }

    setHiddenMarkerLatitude(coordinateInfo.lat);
    setHiddenMarkerLongitude(coordinateInfo.lon);
    setHiddenMarkerName(trailName);
    setHiddenMarkerDescription(trailDescription);

    setTimeout(() => {
      if (hiddenMarkerRef.current) {
        hiddenMarkerRef.current.displayTrailName(false);
      }
    }, 10);
  };

  const getMarkerSize = (delta) => {
    switch (true) {
      case (delta < 0.0025): return 35;
      case (delta < 0.003): return 32;
      case (delta < 0.0035): return 29;
      case (delta < 0.0042): return 26;
      case (delta < 0.005): return 23;
      case (delta < 0.0065): return 20;
      case (delta < 0.008): return 18;
      case (delta < 0.01): return 16;
      case (delta < 0.0119): return 14;
      case (delta < 0.0187): return 11;
      case (delta < 0.02): return 10;
      case (delta < 0.025): return 9;
      default: return 8;
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
      "Circle": createIconDescriptor(circleIcon, size),
      "Square": createIconDescriptor(squareIcon, size),
      "Diamond": createIconDescriptor(diamondIcon, size),
      "Bench": createIconDescriptor(benchIcon, size * 1.2),
      "Invisible": createIconDescriptor(invisibleIcon, 1),
    };

    markerIconCache.current.set(size, icons);
    return icons;
  };

  const getCoordinateKey = (coordinate, latDecimals, longDecimals) => {
    return coordinate.latitude.toFixed(latDecimals) + "," + coordinate.longitude.toFixed(longDecimals);
  };

  // Cycle through location modes: off -> follow -> compass -> follow -> ...
  // Panning sets it back to off
  const cycleLocationMode = () => {
    if (cameraRef.current) {
      if (locationMode === 'off') {
        // Don't enable location tracking if user is outside map bounds
        if (!isUserInBounds) {
          Toast.show({
            type: 'info',
            text1: 'Outside map area',
            text2: 'Location tracking is only available within the trail area',
            position: 'bottom',
          });
          return;
        }
        // off -> follow
        cameraRef.current.setCamera({
          centerCoordinate: [currentLongitude, currentLatitude],
          animationDuration: 500,
        });
        setLocationMode('follow');
      } else if (locationMode === 'follow') {
        // follow -> compass
        setLocationMode('compass');
      } else {
        // compass -> follow
        setLocationMode('follow');
      }
    }
  };

  const onCameraChanged = (state) => {
    if (locationMode !== 'off' && state.gestures && state.gestures.isGestureActive) {
      setLocationMode('off');
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


  const onMapPress = (event) => {
    const { geometry } = event;
    if (!geometry || !geometry.coordinates) return;

    const coordinate = {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0]
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

    if (hiddenMarkerRef.current) {
      hiddenMarkerRef.current.hideCallout();
    }
  };

  // Recording handlers
  const handleStartRecording = async () => {
    // Don't allow recording if user is outside map bounds
    if (!isUserInBounds) {
      Toast.show({
        type: 'info',
        text1: 'Outside map area',
        text2: 'Recording is only available within the trail area',
        position: 'bottom',
      });
      return;
    }

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

    // Initialize/reset GPS filter for new recording
    gpsFilterRef.current = createGPSFilter();

    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setRecordingState(RecordingStateEnum.RECORDING);
    setLocationMode('compass'); // Auto-enable compass mode when recording starts
  };

  const handlePauseRecording = async () => {
    await stopTracking();
    pausedTimeRef.current = elapsedTime;
    setCurrentPosition(null); // Clear current position while paused
    setRecordingState(RecordingStateEnum.PAUSED);
  };

  const handleResumeRecording = async () => {
    const started = await startTracking();
    if (!started) {
      Toast.show({
        type: 'error',
        text1: 'Failed to resume recording',
        position: 'bottom',
      });
      return;
    }

    startTimeRef.current = Date.now();
    setRecordingState(RecordingStateEnum.RECORDING);
  };

  const handleDeleteRecording = () => {
    Alert.alert(
      'Delete Recording',
      'Delete this recording? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await stopTracking();
            setRecordingState(RecordingStateEnum.IDLE);
            setCoordinates([]);
            setCurrentPosition(null);
            setDistance(0);
            setElevationGain(0);
            setElapsedTime(0);
            startTimeRef.current = null;
            pausedTimeRef.current = 0;
            gpsFilterRef.current = null;
          },
        },
      ]
    );
  };

  // Convert coordinates to GeoJSON format for Mapbox
  // Include current position at the end if recording to keep route up-to-date with user location
  const routeCoordinates = [...coordinates];
  if (recordingState === RecordingStateEnum.RECORDING && currentPosition && coordinates.length > 0) {
    // Add current position to show "live" end of route
    routeCoordinates.push(currentPosition);
  }

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routeCoordinates.map((coord) => [coord.longitude, coord.latitude]),
    },
  };

  const hasRoute = routeCoordinates.length > 1;
  const markerImages = getMarkerImages();
  const longitudeDeltaStr = longitudeDelta.toFixed(5);
  const isRecordingActive = recordingState !== RecordingStateEnum.IDLE;

  // Stats panel animation - panel height is ~80px
  const statsHeight = 45 + insets.bottom;
  const statsTranslateY = statsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [statsHeight, 0],
  });

  // Buttons animate up with the stats panel
  const buttonsTranslateY = statsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -statsHeight],
  });

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={"Loading map..."}
        textStyle={styles.spinnerTextStyle}
        animation={"fade"}
        overlayColor={"rgba(46, 58, 82, 0.75)"}
      />

      <Mapbox.MapView
        style={styles.mapStyle}
        styleURL="https://api.mapbox.com/styles/v1/jackgww/ckixum56n651w19npcrja4rnq?access_token=pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg"
        onDidFinishLoadingMap={mapSetup}
        onPress={onMapPress}
        onMapIdle={updateRegion}
        onCameraChanged={onCameraChanged}
        compassEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        logoEnabled={false}
      >
        <Mapbox.RasterDemSource
          id="mapbox-dem"
          url="mapbox://mapbox.terrain-rgb"
          tileSize={514}
          maxZoomLevel={14}
        >
          <Mapbox.Terrain
            sourceID="mapbox-dem"
            style={{ exaggeration: 1.5 }}
          />
        </Mapbox.RasterDemSource>

        <Mapbox.Camera
          ref={cameraRef}
          minZoomLevel={14}
          maxZoomLevel={18}
          maxBounds={[
            [-80.398, 44.507], // Southwest
            [-80.328, 44.539]  // Northeast
          ]}
          followUserLocation={locationMode !== 'off'}
          followUserMode={locationMode === 'compass' ? "compass" : "normal"}
          followZoomLevel={16}
          followPitch={is3DMode ? 45 : 0}
        />

        <Mapbox.LocationPuck
          pulsing={{ isEnabled: true }}
          puckBearingEnabled={true}
          puckBearing="heading"
        />

        <Mapbox.UserLocation
          visible={false}
          onUpdate={(location) => updateCurrentLocation(location)}
        />

        <AllTrails longitudeDelta={longitudeDeltaStr} markerImages={markerImages} />

        <CustomMarker
          longitudeDelta={longitudeDeltaStr}
          location={{ latitude: 44.512641029432416, longitude: -80.363259455189109 }}
          trailName={"The Bench"}
          trailDescription={"Lookout point"}
          icon={markerImages["Bench"]}
          id={"6"}
        />
        <CustomMarker
          longitudeDelta={"0"}
          location={{ latitude: hiddenMarkerLatitude, longitude: hiddenMarkerLongitude }}
          trailName={hiddenMarkerName}
          trailDescription={hiddenMarkerDescription}
          icon={markerImages["Invisible"]}
          id={"12"}
          ref={hiddenMarkerRef}
          key={hiddenMarkerLatitude}
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

      {/* Top left, trail rating legend */}
      <View style={[styles.legendContainer, { top: 12 + insets.top }]}>
        <Image
          source={require("../../assets/legend.png")}
          style={styles.legend}
          contentFit="contain"
        />
      </View>

      {/* Right side buttons */}
      <Animated.View style={[styles.rightButtonsContainer, { bottom: 24, transform: [{ translateY: buttonsTranslateY }] }]}>
        {/* 3D toggle button */}
        <TouchableHighlight
          style={styles.mapButton}
          activeOpacity={0.7}
          underlayColor="#F0F0F0"
          onPress={toggle3DMode}
        >
          <View style={styles.terrainButton}>
            <Text style={styles.terrainButtonText}>
              {is3DMode ? '2D' : '3D'}
            </Text>
          </View>
        </TouchableHighlight>

        {/* Location button - cycles through: off -> follow -> compass */}
        <TouchableHighlight
          style={styles.mapButton}
          activeOpacity={0.7}
          underlayColor="#F0F0F0"
          onPress={cycleLocationMode}
        >
          <Ionicons
            name={locationMode === 'off' ? "navigate-outline" : locationMode === 'follow' ? "navigate" : "compass"}
            size={24}
            color={locationMode === 'off' ? "#2E3A52" : "#007AFF"}
          />
        </TouchableHighlight>
      </Animated.View>

      {/* Recording controls - centered at bottom */}
      <Animated.View style={[styles.recordingControlsContainer, { bottom: 24, transform: [{ translateY: buttonsTranslateY }] }]}>
        {recordingState === RecordingStateEnum.IDLE && (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleStartRecording}
            activeOpacity={0.8}
          >
            <Ionicons name="radio-button-on" size={20} color="#FF3B30" />
            <Text style={styles.recordButtonText}>Record</Text>
          </TouchableOpacity>
        )}

        {recordingState === RecordingStateEnum.RECORDING && (
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={handlePauseRecording}
            activeOpacity={0.8}
          >
            <Ionicons name="pause" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {recordingState === RecordingStateEnum.PAUSED && (
          <View style={styles.pausedControlsContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteRecording}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resumeButton}
              onPress={handleResumeRecording}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Stats panel - slides up when recording */}
      <Animated.View
        style={[
          styles.statsBar,
          {
            paddingBottom: -20 + insets.bottom,
            transform: [{ translateY: statsTranslateY }],
          }
        ]}
      >
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
          <Text style={styles.statLabel}>m<Ionicons name="arrow-up" size={12} color="#8E8E93" /></Text>
        </View>
      </Animated.View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  mapStyle: {
    flex: 1,
  },
  legendContainer: {
    position: "absolute",
    left: 12,
    height: 90,
    width: 90,
  },
  legend: {
    height: 90,
    width: 90,
  },
  rightButtonsContainer: {
    position: "absolute",
    right: 16,
    gap: 12,
  },
  mapButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  mapButtonActive: {
    backgroundColor: "#2E3A52",
  },
  terrainButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  terrainButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E3A52",
    letterSpacing: 0.3,
  },
  locationButtonIcon: {
    height: 24,
    width: 24,
  },
  spinnerTextStyle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  recordingControlsContainer: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
  },
  recordButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  recordButtonOuter: {
    height: 25,
    width: 25,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF3B30",
  },
  recordButtonInner: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: "#FF3B30",
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A52",
    marginLeft: 8,
  },
  pauseButton: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#FF9500",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  pausedControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    right: 72,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FF3B30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resumeButton: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#34C759",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statsBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E3A52",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E5E5EA",
  },
});

export default LiveMap;
