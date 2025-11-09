import React from "react";
import { StyleSheet, View, Dimensions, TouchableHighlight } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from 'expo-location';
import { Image } from 'expo-image';

// Polyline components for all trails
import AllTrails from "./trails/AllTrails";
import CustomMarker from "./markers/CustomMarker"


let circleIcon = require("../../assets/trailMarkers/circle.svg")
let squareIcon = require("../../assets/trailMarkers/square.svg")
let diamondIcon = require("../../assets/trailMarkers/diamond.svg")
let benchIcon = require("../../assets/trailMarkers/bench.png")
let invisibleIcon = require("../../assets/trailMarkers/invisible.png")

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg";
const MAP_STYLE_URL = "mapbox://styles/jackgww/ckixum56n651w19npcrja4rnq";
const MAP_BOUNDS = {
  ne: [-80.328, 44.539],
  sw: [-80.398, 44.507],
};

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

export default class LiveMap extends React.Component {
  markerIconCache = new Map();

  constructor() {
    super();

    let initialCamera = {
      centerCoordinate: [-80.351933, 44.519949],
      pitch: 0,
      heading: 180,
      zoomLevel: 15,
    };

    this.state = {
      initialCamera: initialCamera,
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
      trailPattern: null
    };
  }

  async enableLocationPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission was denied');
    }
  }

  mapSetup() {
    this.setState({ spinner: false, trailPattern: null });

    // Ask for location permissions
    this.enableLocationPermissions()
  }

  updateRegion(event) {
    if (!event || !event.properties) {
      return;
    }

    if (event.properties.visibleBounds) {
      const [southWest, northEast] = event.properties.visibleBounds;
      const longitudeDelta = Math.abs(northEast[0] - southWest[0]);
      if (!Number.isNaN(longitudeDelta)) {
        this.setState({ longitudeDelta });
        return;
      }
    }

    if (event.properties.zoomLevel !== undefined) {
      const zoomLevel = event.properties.zoomLevel;
      const longitudeDelta = 360 / Math.pow(2, zoomLevel);
      this.setState({ longitudeDelta });
    }
  }

  updateCurrentLocation(coordinate) {
    const location = coordinate?.coords || coordinate;

    if (location && location.latitude !== undefined && location.longitude !== undefined) {
      this.setState({
        currentLatitude: location.latitude,
        currentLongitude: location.longitude
      });
    } else {
      console.warn("updateCurrentLocation: coordinate is undefined or invalid", coordinate);
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
    if (!this.camera) {
      return;
    }

    this.camera.setCamera({
      centerCoordinate: [this.state.currentLongitude, this.state.currentLatitude],
      animationDuration: 1000,
    });
  }

  handleMapPress(event) {
    const coordinateArray = event?.geometry?.coordinates;
    if (!coordinateArray || coordinateArray.length < 2) {
      return;
    }

    const coordinate = {
      latitude: coordinateArray[1],
      longitude: coordinateArray[0],
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

        <MapboxGL.MapView
          styleURL={MAP_STYLE_URL}
          style={styles.mapStyle}
          attributionEnabled={false}
          compassEnabled={false}
          logoEnabled={false}
          rotateEnabled={true}
          pitchEnabled={false}
          onDidFinishRenderingMapFully={this.mapSetup.bind(this)}
          onRegionDidChange={(event) => this.updateRegion(event)}
          onPress={(event) => this.handleMapPress(event)}
        >
          <MapboxGL.Camera
            ref={(ref) => (this.camera = ref)}
            defaultSettings={{
              centerCoordinate: this.state.initialCamera.centerCoordinate,
              zoomLevel: this.state.initialCamera.zoomLevel,
              pitch: this.state.initialCamera.pitch,
              heading: this.state.initialCamera.heading,
            }}
            maxBounds={MAP_BOUNDS}
            minZoomLevel={14}
            maxZoomLevel={18}
            followUserLocation={true}
            followUserMode="normal"
          />
          <MapboxGL.UserLocation
            onUpdate={(location) => this.updateCurrentLocation(location)}
            showsUserHeadingIndicator={true}
            renderMode="normal"
          />
          <AllTrails longitudeDelta={longitudeDelta} markerImages={markerImages} trailPattern={this.state.trailPattern} />
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
          />
        </MapboxGL.MapView>

        {/* Bottom left, trail rating legend */}
        <View style={styles.legendContainer}>
          <Image
            source={require("../../assets/legend.png")}
            style={styles.legend}
            contentFit="contain"
          />
        </View>

        {/* Bottom right, move to current location button */}
        <TouchableHighlight
          style={styles.locationButtonContainer}
          activeOpacity={0.5}
          underlayColor="#A9A9A9"
          onPress={() => this.animateToUser()} >
          <Image
            source={require("../../assets/locationIcon.png")}
            contentFit="contain"
            style={styles.locationButton}
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});
