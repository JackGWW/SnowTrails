import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import {
  subscribeToLocationUpdates,
  startRecording,
  pauseRecording,
  resumeRecording,
  clearRecording,
  getRecordingState
} from '../services/LocationTracker';

// Set Mapbox access token
Mapbox.setAccessToken("pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg");

class RecordingScreenComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      isPaused: false,
      coordinates: [],
      distance: 0,
      elevationGain: 0,
      duration: 0,
      currentLatitude: 44.519,
      currentLongitude: -80.352,
      isFollowing: true,
    };

    this.cameraRef = React.createRef();
    this.unsubscribe = null;
    this.durationTimer = null;
  }

  componentDidMount() {
    // Subscribe to location updates
    this.unsubscribe = subscribeToLocationUpdates(this.handleLocationUpdate);

    // Request initial location
    this.getCurrentLocation();

    // Start duration timer
    this.durationTimer = setInterval(() => {
      const state = getRecordingState();
      this.setState({ duration: state.duration });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.durationTimer) {
      clearInterval(this.durationTimer);
    }
  }

  async getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      this.setState({
        currentLatitude: location.coords.latitude,
        currentLongitude: location.coords.longitude,
      });

      // Center camera on user location
      if (this.cameraRef.current) {
        this.cameraRef.current.setCamera({
          centerCoordinate: [location.coords.longitude, location.coords.latitude],
          zoomLevel: 15,
          animationDuration: 0,
        });
      }
    } catch (error) {
      console.log('Could not get user location:', error);
    }
  }

  handleLocationUpdate = (state) => {
    this.setState({
      isRecording: state.isRecording,
      isPaused: state.isPaused,
      coordinates: state.coordinates,
      distance: state.distance,
      elevationGain: state.elevationGain,
      duration: state.duration,
    });

    // Update current location and follow if recording
    if (state.lastLocation && state.isRecording && !state.isPaused) {
      this.setState({
        currentLatitude: state.lastLocation.latitude,
        currentLongitude: state.lastLocation.longitude,
      });

      // Auto-follow user location while recording
      if (this.state.isFollowing && this.cameraRef.current) {
        this.cameraRef.current.setCamera({
          centerCoordinate: [state.lastLocation.longitude, state.lastLocation.latitude],
          animationDuration: 500,
        });
      }
    }
  }

  handleStartRecording = async () => {
    const result = await startRecording();
    if (!result.success) {
      Alert.alert('Permission Required', result.message || 'Unable to start recording');
    }
    this.setState({ isFollowing: true });
  }

  handlePauseRecording = () => {
    pauseRecording();
  }

  handleResumeRecording = () => {
    resumeRecording();
    this.setState({ isFollowing: true });
  }

  handleClearRecording = () => {
    Alert.alert(
      'Clear Recording',
      'Are you sure you want to clear the current recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearRecording() }
      ]
    );
  }

  onCameraChanged = (state) => {
    // Disable auto-follow if user manually pans the map
    if (this.state.isFollowing && this.state.isRecording && state.gestures && state.gestures.isGestureActive) {
      this.setState({ isFollowing: false });
    }
  }

  centerOnUser = () => {
    if (this.cameraRef.current) {
      this.cameraRef.current.setCamera({
        centerCoordinate: [this.state.currentLongitude, this.state.currentLatitude],
        animationDuration: 500,
      });
      this.setState({ isFollowing: true });
    }
  }

  formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDistance(meters) {
    const km = meters / 1000;
    return km.toFixed(2);
  }

  formatElevation(meters) {
    return Math.round(meters);
  }

  renderRecordedRoute() {
    const { coordinates } = this.state;

    if (coordinates.length < 2) {
      return null;
    }

    const lineCoordinates = coordinates.map(coord => [coord.longitude, coord.latitude]);

    return (
      <Mapbox.ShapeSource
        id="recorded-route-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: lineCoordinates
          }
        }}
      >
        <Mapbox.LineLayer
          id="recorded-route-line"
          style={{
            lineColor: "#FF6B35",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 3, 16, 4, 18, 6],
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </Mapbox.ShapeSource>
    );
  }

  renderControls() {
    const { isRecording, isPaused } = this.state;
    const { bottomInset } = this.props;

    if (!isRecording) {
      // Idle state: Show Start Recording button
      return (
        <View style={[styles.controlsContainer, { paddingBottom: bottomInset + 16 }]}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={this.handleStartRecording}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Recording</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isPaused) {
      // Paused state: Show Resume and Clear buttons
      return (
        <View style={[styles.controlsContainer, { paddingBottom: bottomInset + 16 }]}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={this.handleClearRecording}
            activeOpacity={0.8}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resumeButton}
            onPress={this.handleResumeRecording}
            activeOpacity={0.8}
          >
            <Text style={styles.resumeButtonText}>Resume</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Recording state: Show Pause and Clear buttons
    return (
      <View style={[styles.controlsContainer, { paddingBottom: bottomInset + 16 }]}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={this.handleClearRecording}
          activeOpacity={0.8}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={this.handlePauseRecording}
          activeOpacity={0.8}
        >
          <Text style={styles.pauseButtonText}>Pause</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { distance, duration, elevationGain, isRecording, isPaused } = this.state;

    return (
      <View style={styles.container}>
        {/* Map */}
        <View style={styles.mapContainer}>
          <Mapbox.MapView
            style={styles.map}
            styleURL="https://api.mapbox.com/styles/v1/jackgww/ckixum56n651w19npcrja4rnq?access_token=pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg"
            onCameraChanged={this.onCameraChanged}
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
              ref={this.cameraRef}
              minZoomLevel={10}
              maxZoomLevel={18}
              defaultSettings={{
                centerCoordinate: [-80.351933, 44.519949],
                zoomLevel: 15,
              }}
            />

            <Mapbox.LocationPuck
              pulsing={{ isEnabled: true }}
              puckBearingEnabled={true}
              puckBearing="heading"
            />

            {this.renderRecordedRoute()}
          </Mapbox.MapView>

          {/* Center on user button */}
          {isRecording && !this.state.isFollowing && (
            <TouchableOpacity
              style={styles.centerButton}
              onPress={this.centerOnUser}
              activeOpacity={0.8}
            >
              <Text style={styles.centerButtonText}>Center</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Panel */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{this.formatDistance(distance)}</Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{this.formatDuration(duration)}</Text>
              <Text style={styles.statLabel}>duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{this.formatElevation(elevationGain)}</Text>
              <Text style={styles.statLabel}>m elevation</Text>
            </View>
          </View>

          {/* Recording indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={[styles.recordingDot, isPaused && styles.recordingDotPaused]} />
              <Text style={styles.recordingText}>
                {isPaused ? 'Paused' : 'Recording'}
              </Text>
            </View>
          )}
        </View>

        {/* Controls */}
        {this.renderControls()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  centerButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  centerButtonText: {
    color: '#2E3A52',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E3A52',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    marginRight: 8,
  },
  recordingDotPaused: {
    backgroundColor: '#FF9500',
  },
  recordingText: {
    fontSize: 14,
    color: '#2E3A52',
    fontWeight: '600',
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#2E3A52',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resumeButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  clearButtonText: {
    color: '#FF3B30',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

// Wrapper component to provide safe area insets
export default function RecordingScreen(props) {
  const insets = useSafeAreaInsets();
  return <RecordingScreenComponent {...props} bottomInset={insets.bottom} />;
}
