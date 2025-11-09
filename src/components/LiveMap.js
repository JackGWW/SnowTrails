import React from "react";
import { StyleSheet, View, Dimensions, TouchableHighlight, Text } from "react-native";
import Mapbox from "@rnmapbox/maps";
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from 'expo-location';
import { Image } from 'expo-image';

// Polyline components for all trails
import AllTrails from "./trails/AllTrails";
import CustomMarker from "./markers/CustomMarker"

// Set Mapbox access token
Mapbox.setAccessToken("pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg");

let circleIcon = require("../../assets/trailMarkers/circle.svg")
let squareIcon = require("../../assets/trailMarkers/square.svg")
let diamondIcon = require("../../assets/trailMarkers/diamond.svg")
let benchIcon = require("../../assets/trailMarkers/bench.png")
let invisibleIcon = require("../../assets/trailMarkers/invisible.png")

export default class LiveMap extends React.Component {
  markerIconCache = new Map();

  constructor() {
    super();

    this.state = {
      longitudeDelta: 0.011,
      spinner: true,
      currentLatitude: 44.519,
      currentLongitude: -80.352,
      hiddenMarkerLatitude: 44.518,
      hiddenMarkerLongitude: -80.353,
      hiddenMarkerName: "",
      hiddenMarkerDescription: "",
      coordinateMapping: require('../../data/coordinate_mapping.json'),
      trailMapping: require('../../data/trail_mapping.json'),
      is3DMode: false,
      isTracking: false,
      isUserInBounds: false
    };

    this.mapBounds = {
      northEast: { latitude: 44.539, longitude: -80.328 },
      southWest: { latitude: 44.507, longitude: -80.398 }
    };

    this.cameraRef = React.createRef();
  }

  async enableLocationPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission was denied');
    }
  }

  isWithinBounds(lat, lon) {
    return (
      lat >= this.mapBounds.southWest.latitude &&
      lat <= this.mapBounds.northEast.latitude &&
      lon >= this.mapBounds.southWest.longitude &&
      lon <= this.mapBounds.northEast.longitude
    );
  }

  async mapSetup() {
    // Set map boundaries to the area containing the trails
    this.setState({ spinner: false });

    // Ask for location permissions
    await this.enableLocationPermissions();

    // Try to get user's current location
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;

      // Check if user is within map boundaries
      const isWithinBounds = this.isWithinBounds(userLat, userLon);

      // Update state to track if user is in bounds
      this.setState({
        isUserInBounds: isWithinBounds,
        currentLatitude: userLat,
        currentLongitude: userLon
      });

      // Set initial camera position after map has loaded
      if (this.cameraRef.current) {
        this.cameraRef.current.setCamera({
          centerCoordinate: isWithinBounds
            ? [userLon, userLat]
            : [-80.351933, 44.519949],
          zoomLevel: 15,
          pitch: 0,
          heading: 210,
          animationDuration: 0, // No animation on initial load
        });
      }

      // Enable tracking by default if user is within bounds
      if (isWithinBounds) {
        // Delay slightly to ensure camera is set up
        setTimeout(() => {
          this.setState({ isTracking: true });
        }, 500);
      }
    } catch (error) {
      console.log('Could not get user location:', error);
      // Fall back to default location
      if (this.cameraRef.current) {
        this.cameraRef.current.setCamera({
          centerCoordinate: [-80.351933, 44.519949],
          zoomLevel: 15,
          pitch: 0,
          heading: 210,
          animationDuration: 0,
        });
      }
    }
  }

  updateRegion(region) {
    // Calculate longitudeDelta from zoom level for marker sizing
    // Mapbox uses zoom levels differently than react-native-maps
    // Approximate conversion: longitudeDelta ≈ 360 / (2^zoom)
    const zoom = region.properties.zoom || 15;
    const longitudeDelta = 360 / Math.pow(2, zoom);
    this.setState({ longitudeDelta });
  }

  updateCurrentLocation(location) {
    if (location && location.coords) {
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
      const isInBounds = this.isWithinBounds(lat, lon);

      this.setState({
        currentLatitude: lat,
        currentLongitude: lon,
        isUserInBounds: isInBounds
      });

      // Disable tracking if user goes out of bounds
      if (this.state.isTracking && !isInBounds) {
        this.setState({ isTracking: false });
      }
    } else {
      console.warn("updateCurrentLocation: location is undefined or invalid", location);
    }
  }

  updateHiddenMarker(coordinateKey) {
    let coordinateInfo = this.state.coordinateMapping[coordinateKey]
    let trailInfo = this.state.trailMapping[coordinateInfo.trail]
    let trailName = trailInfo.name
    let trailDescription = trailInfo.description

    if (trailDescription === ""){
      trailDescription = null
    }

    this.setState({
      hiddenMarkerLatitude: coordinateInfo.lat,
      hiddenMarkerLongitude: coordinateInfo.lon,
      hiddenMarkerName: trailName,
      hiddenMarkerDescription: trailDescription,
    });

    // Give marker time to update before displaying
    setTimeout(() => { this.child.displayTrailName(false) }, 10);
  }

  getMarkerSize(delta) {
    // As the screen zooms out, make the icons smaller
    switch (true) {
      case (delta < 0.0025):
        return 35
      case (delta < 0.003):
        return 32
      case (delta < 0.0035):
        return 29
      case (delta < 0.0042):
        return 26
      case (delta < 0.005):
        return 23
      case (delta < 0.0065):
        return 20
      case (delta < 0.008):
        return 18
      case (delta < 0.01):
        return 16
      case (delta < 0.0119):
        return 14
      case (delta < 0.0187):
        return 11
      case (delta < 0.02):
        return 10
      case (delta < 0.025):
        return 9
      default:
        return 8
    }
  }

  createIconDescriptor(source, size) {
    const roundedSize = Math.max(1, Math.round(size));
    return Object.freeze({
      source,
      width: roundedSize,
      height: roundedSize,
    });
  }

  getMarkerImages() {
    const delta = this.state.longitudeDelta;
    const size = this.getMarkerSize(delta);

    if (this.markerIconCache.has(size)) {
      return this.markerIconCache.get(size);
    }

    const icons = {
      "Circle": this.createIconDescriptor(circleIcon, size),
      "Square": this.createIconDescriptor(squareIcon, size),
      "Diamond": this.createIconDescriptor(diamondIcon, size),
      "Bench": this.createIconDescriptor(benchIcon, size * 1.2),
      "Invisible": this.createIconDescriptor(invisibleIcon, 1),
    };

    this.markerIconCache.set(size, icons);
    return icons;
  }

  getCoordinateKey(coordinate, latDecimals, longDecimals) {
    return coordinate.latitude.toFixed(latDecimals) + "," + coordinate.longitude.toFixed(longDecimals)
  }

  animateToUser() {
    if (this.cameraRef.current && this.state.isUserInBounds) {
      this.cameraRef.current.setCamera({
        centerCoordinate: [this.state.currentLongitude, this.state.currentLatitude],
        animationDuration: 1000,
      });
    }
  }

  toggleTracking() {
    // Only allow enabling tracking if user is within bounds
    if (!this.state.isTracking && !this.state.isUserInBounds) {
      return; // Don't enable tracking if user is out of bounds
    }
    this.setState({ isTracking: !this.state.isTracking });
  }

  onCameraChanged = (state) => {
    // Disable tracking if user manually pans the map
    if (this.state.isTracking && state.gestures && state.gestures.isGestureActive) {
      this.setState({ isTracking: false });
    }
  }

  toggle3DMode() {
    const newMode = !this.state.is3DMode;
    this.setState({ is3DMode: newMode });

    if (this.cameraRef.current) {
      this.cameraRef.current.setCamera({
        pitch: newMode ? 45 : 0,
        animationDuration: 500,
      });
    }
  }

  onMapPress = (event) => {
    // If map is tapped, check if it is tapped on a trail
    // If a trail is tapped, show a marker on that trail
    const { geometry } = event;
    if (!geometry || !geometry.coordinates) return;

    const coordinate = {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0]
    };

    let coordinateKey = this.getCoordinateKey(coordinate, 4, 4)
    if (coordinateKey in this.state.coordinateMapping) {
      this.updateHiddenMarker(coordinateKey)
      return
    }

    coordinateKey = this.getCoordinateKey(coordinate, 4, 3)
    if (coordinateKey in this.state.coordinateMapping) {
      this.updateHiddenMarker(coordinateKey)
      return
    }

    coordinateKey = this.getCoordinateKey(coordinate, 3, 4)
    if (coordinateKey in this.state.coordinateMapping) {
      this.updateHiddenMarker(coordinateKey)
      return
    }

    coordinateKey = this.getCoordinateKey(coordinate, 3, 3)
    if (coordinateKey in this.state.coordinateMapping) {
      this.updateHiddenMarker(coordinateKey)
      return
    }
  }

  render() {
    let markerImages = this.getMarkerImages()
    let longitudeDelta = this.state.longitudeDelta.toFixed(5)

    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
          animation={"fade"}
          overlayColor={"rgba(0, 0, 0, 0.5)"}
        />

        <Mapbox.MapView
          style={styles.mapStyle}
          styleURL="https://api.mapbox.com/styles/v1/jackgww/ckixum56n651w19npcrja4rnq?access_token=pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg"
          onDidFinishLoadingMap={this.mapSetup.bind(this)}
          onPress={this.onMapPress}
          onMapIdle={this.updateRegion.bind(this)}
          onCameraChanged={this.onCameraChanged}
          compassEnabled={false}
          scaleBarEnabled={false}
          attributionEnabled={false}
          logoEnabled={false}
        >
          <Mapbox.Terrain
            sourceID="mapbox-dem"
            style={{ exaggeration: 1.5 }}
          />

          <Mapbox.RasterDemSource
            id="mapbox-dem"
            url="mapbox://mapbox.terrain-rgb"
            tileSize={514}
            maxZoomLevel={14}
          />

          <Mapbox.Camera
            ref={this.cameraRef}
            minZoomLevel={14}
            maxZoomLevel={18}
            maxBounds={[
              [-80.398, 44.507], // Southwest
              [-80.328, 44.539]  // Northeast
            ]}
            followUserLocation={this.state.isTracking}
            followUserMode="compass"
            followZoomLevel={16}
          />

          <Mapbox.LocationPuck
            pulsing={{ isEnabled: true }}
            puckBearingEnabled={true}
            puckBearing="heading"
          />

          <Mapbox.UserLocation
            visible={true}
            onUpdate={(location) => this.updateCurrentLocation(location)}
          />

          <AllTrails longitudeDelta={longitudeDelta} markerImages={markerImages} />

          <CustomMarker
            longitudeDelta={longitudeDelta}
            location={{ latitude: 44.512641029432416, longitude: -80.363259455189109 }}
            trailName={"The Bench"}
            trailDescription={"Lookout point"}
            icon={markerImages["Bench"]}
            id={"6"}
          />
          <CustomMarker
            longitudeDelta={"0"} // Can be static as the image doesn't change upon zoom change
            location={{ latitude: this.state.hiddenMarkerLatitude, longitude: this.state.hiddenMarkerLongitude }}
            trailName={this.state.hiddenMarkerName}
            trailDescription={this.state.hiddenMarkerDescription}
            icon={markerImages["Invisible"]}
            id={"12"}
            ref={child => { this.child = child }}
            key={this.state.hiddenMarkerLatitude}
            tappable={false}
          />
        </Mapbox.MapView>

        {/* Bottom left, trail rating legend */}
        <View style={styles.legendContainer}>
          <Image
            source={require("../../assets/legend.png")}
            style={styles.legend}
            contentFit="contain"
          />
        </View>

        {/* Bottom right, 3D toggle button */}
        <TouchableHighlight
          style={styles.terrainButtonContainer}
          activeOpacity={0.5}
          underlayColor="#A9A9A9"
          onPress={() => this.toggle3DMode()} >
          <View style={styles.terrainButton}>
            <Text style={styles.terrainButtonText}>
              {this.state.is3DMode ? '2D' : '3D'}
            </Text>
          </View>
        </TouchableHighlight>

        {/* Bottom right, GPS tracking toggle button */}
        <TouchableHighlight
          style={[
            styles.trackingButtonContainer,
            this.state.isTracking && styles.trackingButtonActive,
            !this.state.isUserInBounds && styles.buttonDisabled
          ]}
          activeOpacity={0.5}
          underlayColor="#A9A9A9"
          onPress={() => this.toggleTracking()}
          disabled={!this.state.isUserInBounds && !this.state.isTracking} >
          <Image
            source={require("../../assets/locationIcon.png")}
            contentFit="contain"
            style={styles.trackingButton}
            tintColor={
              !this.state.isUserInBounds ? "#999" :
              this.state.isTracking ? "#FFF" : "#333"
            }
          />
        </TouchableHighlight>

        {/* Bottom right, move to current location button */}
        <TouchableHighlight
          style={[
            styles.locationButtonContainer,
            !this.state.isUserInBounds && styles.buttonDisabled
          ]}
          activeOpacity={0.5}
          underlayColor="#A9A9A9"
          onPress={() => this.animateToUser()}
          disabled={!this.state.isUserInBounds} >
          <Image
            source={require("../../assets/locationIcon.png")}
            contentFit="contain"
            style={styles.locationButton}
            tintColor={!this.state.isUserInBounds ? "#999" : "#333"}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  map: {
    flex: 1,
    position: "absolute",
  },
  legendContainer: {
    position: "absolute",
    left: 1,
    bottom: 1,
    height: 100,
    width: 100,
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  legend: {
    top: 0,
    right: 0,
    height: 80,
    width: 80,
    flexDirection: "row",
  },
  terrainButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 140,
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  terrainButton: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  terrainButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  trackingButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 80,
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  trackingButtonActive: {
    backgroundColor: "rgba(0, 122, 255, 0.9)",
    borderColor: '#007AFF',
  },
  trackingButton: {
    height: 35,
    width: 35,
  },
  locationButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  locationButton: {
    height: 35,
    width: 35,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: "rgba(200, 200, 200, 0.6)",
  },
  buttonTextDisabled: {
    color: "#999",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
