import React from "react";
import { StyleSheet, View, Dimensions, StatusBar, Image } from "react-native";
import MapView, { UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from 'expo-location';

// Polyline components for all trails
import AllTrails from "./trails/AllTrails";

export default class LiveMap extends React.Component {
  constructor() {
    super();

    var initialCamera = {
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
    };
  }

  async enableLocationPermissions() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission was denied');
    }
  }

  mapSetup() {
    // Set map boundaries to the area containing the trails
    this.setState({ spinner: false });

    // Ask for location permissions
    this.enableLocationPermissions()

    northEastLimit = {
      latitude: 44.531,
      longitude: -80.328,
    };
    southWestLimit = {
      latitude: 44.507,
      longitude: -80.379,
    };
    this.mapView.setMapBoundaries(northEastLimit, southWestLimit);
  }

  updateRegion(region) {
    this.setState({ longitudeDelta: region.longitudeDelta });
  }

  getMarkerImages() {
    let delta = this.state.longitudeDelta
    
    let circleIcon =  require("../../assets/trailMarkers/circle.png")
    let squareIcon =  require("../../assets/trailMarkers/square.png")
    let diamondIcon = require("../../assets/trailMarkers/diamond.png")
  
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
    }
  }

  render() {
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
          initialCamera={this.state.initialCamera}
          provider={"google"} // Always use GoogleMaps (instead of MapKit on iOS)
          showsUserLocation={true}
          showsCompass={true}
          toolbarEnabled={false} // Hide map buttons on marker press
          minZoomLevel={14}
          maxZoomLevel={18}
          mapType={"none"}
          style={styles.mapStyle}
          ref={(ref) => (this.mapView = ref)}
          onMapReady={this.mapSetup.bind(this)} //Initialize map boundaries when the map loads
          onRegionChangeComplete={(region) => this.updateRegion(region)}
          provider={PROVIDER_GOOGLE}
          mapPadding={{
            top: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <UrlTile
            urlTemplate={
              "https://api.mapbox.com/styles/v1/jackgww/ckixum56n651w19npcrja4rnq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg"
            }
            maximumZ={22}
            flipY={false}
            zIndex={-3}
          />
          <AllTrails longitudeDelta={this.state.longitudeDelta.toFixed(5)} markerImages={this.getMarkerImages()} />
        </MapView>
        <View style={styles.legendContainer}>
          <Image
            source={require("../../assets/legend.png")}
            style={styles.legend}
            resizeMode="contain"
          />
        </View>
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
    right: 0,
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});
