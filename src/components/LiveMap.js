import React from "react";
import { StyleSheet, View, Dimensions, StatusBar, Image } from "react-native";
import MapView, { UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from 'expo-location';

// Polyline components for all trails
import AllTrails from "./trails/AllTrails";
import Marker from "./markers/Marker"


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
      hiddenMarkerLatitude: 44.518,
      hiddenMarkerLongitude: -80.353,
      hiddenMarkerName: "",
      hiddenMarkerDescription: "",
      coordinateMapping: require('../../data/coordinate_mapping.json'),
      trailMapping: require('../../data/trail_mapping.json'),
      trailPattern: [0]
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

    northEastLimit = {
      latitude: 44.531,
      longitude: -80.328,
    };
    southWestLimit = {
      latitude: 44.507,
      longitude: -80.398,
    };
    this.mapView.setMapBoundaries(northEastLimit, southWestLimit);
  }

  updateRegion(region) {
    this.setState({ longitudeDelta: region.longitudeDelta });
  }

  updateHiddenMarker(coordinateKey){
    coordinateInfo = this.state.coordinateMapping[coordinateKey]
    trailInfo = this.state.trailMapping[coordinateInfo.trail]
    
    this.setState({ 
      hiddenMarkerLatitude: coordinateInfo.lat,
      hiddenMarkerLongitude: coordinateInfo.lon,
      hiddenMarkerName: trailInfo.name,
      hiddenMarkerDescription: trailInfo.description,
    });

    // Give marker time to update before displaying
    setTimeout(() => {  this.child.displayTrailName(false) }, 10);  
  }

  getMarkerImages() {
    let delta = this.state.longitudeDelta
    
    let circleIcon =  require("../../assets/trailMarkers/circle.png")
    let squareIcon =  require("../../assets/trailMarkers/square.png")
    let diamondIcon = require("../../assets/trailMarkers/diamond.png")
    let benchIcon = require("../../assets/trailMarkers/bench.png")
    let invisibleIcon = require("../../assets/trailMarkers/invisible.png")
  
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
  
  getCoordinateKey(coordinate, latDecimals, longDecimals){
    return coordinate.latitude.toFixed(latDecimals) + "," + coordinate.longitude.toFixed(longDecimals)
  }

  render() {
    markerImages = this.getMarkerImages()
    longitudeDelta = this.state.longitudeDelta.toFixed(5)

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
          onPress={ (event) => {
            coordinate = event.nativeEvent.coordinate         
            
            coordinateKey = this.getCoordinateKey(coordinate, 4, 4)
            if (coordinateKey in this.state.coordinateMapping){
              this.updateHiddenMarker(coordinateKey)
              return
            }
            
            coordinateKey = this.getCoordinateKey(coordinate, 4, 3)
            if (coordinateKey in this.state.coordinateMapping){
              this.updateHiddenMarker(coordinateKey)
              return
            }

            coordinateKey = this.getCoordinateKey(coordinate, 3, 4)
            if (coordinateKey in this.state.coordinateMapping){
              this.updateHiddenMarker(coordinateKey)
              return
            }

            coordinateKey = this.getCoordinateKey(coordinate, 3, 3)
            if (coordinateKey in this.state.coordinateMapping){
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
            zIndex={-3}
          />
          <AllTrails longitudeDelta={longitudeDelta} markerImages={markerImages} trailPattern={this.state.trailPattern} />
          <Marker
            longitudeDelta={longitudeDelta}
            location={{latitude: 44.512641029432416, longitude: -80.363259455189109}}
            trailName={"The Bench"}
            trailDescription={"Lookout point"}
            icon={markerImages["Bench"]}
            id={"6"}
          />
          <Marker
            longitudeDelta={"0"}
            location={{latitude: this.state.hiddenMarkerLatitude, longitude: this.state.hiddenMarkerLongitude}}
            trailName={this.state.hiddenMarkerName}
            trailDescription={this.state.hiddenMarkerDescription}
            icon={markerImages["Invisible"]}
            id={"12"}
            ref={child => {this.child = child}}
            key={this.state.hiddenMarkerLatitude}
          />
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
