import React from "react";
import { StyleSheet, View, Dimensions, TouchableHighlight } from "react-native";
import MapView, { UrlTile, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
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

export default class LiveMap extends React.Component {
  constructor() {
    super();

    let initialCamera = {
      center: {
        latitude: 44.519949,
        longitude: -80.351933,
      },
      pitch: 0,
      heading: 180,

      // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
      altitude: 0,

      // Only when using Google Maps.
      zoom: 15,
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
    // Set map boundaries to the area containing the trails
    this.setState({ spinner: false });

    // Ask for location permissions
    this.enableLocationPermissions()

    // TODO: Remove this and set to null from the start once the fix has been added to Expo
    this.setState({ trailPattern: null })

    var northEastLimit = {
      latitude: 44.539,
      longitude: -80.328,
    };
    var southWestLimit = {
      latitude: 44.507,
      longitude: -80.398,
    };
    this.mapView.setMapBoundaries(northEastLimit, southWestLimit);
  }

  updateRegion(region) {
    this.setState({ longitudeDelta: region.longitudeDelta });
  }

  updateCurrentLocation(coordinate) {
    if (coordinate && coordinate.latitude !== undefined && coordinate.longitude !== undefined) {
      this.setState({
        currentLatitude: coordinate.latitude,
        currentLongitude: coordinate.longitude
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

  getMarkerImages() {
    let delta = this.state.longitudeDelta

    let size;
    //As the screen zooms out, make the icons smaller
    switch (true) {
      case (delta < 0.0025):
        size = 35
        break
      case (delta < 0.003):
        size = 32
        break
      case (delta < 0.0035):
        size = 29
        break
      case (delta < 0.0042):
        size = 26
        break
      case (delta < 0.005):
        size = 23
        break
      case (delta < 0.0065):
        size = 20
        break
      case (delta < 0.008):
        size = 18
        break
      case (delta < 0.01):
        size = 16
        break
      case (delta < 0.0119):
        size = 14
        break
      case (delta < 0.0187):
        size = 11
        break
      case (delta < 0.02):
        size = 10
        break
      case (delta < 0.025):
        size = 9
        break
      default:
        size = 8;
        break
    }

    return {
      "Circle": <Image source={circleIcon} style={{ height: size, width: size }} />,
      "Square": <Image source={squareIcon} style={{ height: size, width: size }} />,
      "Diamond": <Image source={diamondIcon} style={{ height: size, width: size }} />,
      "Bench": <Image source={benchIcon} style={{ height: size * 1.2, width: size * 1.2 }} />,
      "Invisible": <Image source={invisibleIcon} style={{ height: 1, width: 1 }} />,
    }
  }

  getCoordinateKey(coordinate, latDecimals, longDecimals) {
    return coordinate.latitude.toFixed(latDecimals) + "," + coordinate.longitude.toFixed(longDecimals)
  }

  animateToUser() {
    let currentLocation = {
      center: {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
      }
    }
    this.mapView.animateCamera(currentLocation)
  }

  render() {
    let markerImages = this.getMarkerImages()
    let longitudeDelta = this.state.longitudeDelta.toFixed(5)
    
    // Always use GoogleMaps (instead of MapKit on iOS). If using the DEV build, google maps doen't work
    var mapProvider = PROVIDER_GOOGLE
    if (__DEV__) {
      var mapProvider = PROVIDER_DEFAULT
    }

    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
          animation={"fade"}
          overlayColor={"rgba(0, 0, 0, 0.5)"}
        />

        <MapView
          ref={(ref) => (this.mapView = ref)}
          initialCamera={this.state.initialCamera}
          provider={mapProvider}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={false}
          showsMyLocationButton={false}
          toolbarEnabled={false} // Hide map buttons on marker press
          minZoomLevel={14}
          maxZoomLevel={18}
          mapType={"none"}
          style={styles.mapStyle}
          onMapReady={this.mapSetup.bind(this)} // Initialize map boundaries when the map loads
          onUserLocationChange={(event) => this.updateCurrentLocation(event.nativeEvent.coordinate)}
          onRegionChangeComplete={(region) => this.updateRegion(region)}

          onPress={(event) => {
            // If map is tapped, check if it is tapped on a trail
            // If a trail is tapped, show a marker on that trail 
            let coordinate = event.nativeEvent.coordinate
            
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
          }}
        >
          <UrlTile
            urlTemplate={
              "https://api.mapbox.com/styles/v1/jackgww/ckixum56n651w19npcrja4rnq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg"
            }
            maximumZ={22}
            flipY={false}
            shouldReplaceMapContent={true}
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
            tappable={false}
          />
        </MapView>

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
