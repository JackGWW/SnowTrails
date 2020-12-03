import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";


import MapView, {
  Marker,
  UrlTile,
  LocalTile,
} from "react-native-maps";

// Polyline components for each trail
import RidgeRun from "./trails/RidgeRun";
import SpeedRocket from "./trails/SpeedRocket";
import SwitchForward from "./trails/SwitchForward";
import Hike1 from "./trails/Hike1";
import Hike2 from "./trails/Hike2";
import HikeAround from "./trails/HikeAround";

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
    this.state = { initialCamera: initialCamera };
  }

  mapSetup() {
    // Set map boundaries to the area containing the trails
    northEastLimit = {
      latitude: 44.531269,
      longitude: -80.334765,
    };
    southWestLimit = {
      latitude: 44.502138,
      longitude: -80.370155,
    };
    this.mapView.setMapBoundaries(northEastLimit, southWestLimit);
  }

  render() {
    return (
      <View style={styles.container}>
        {
          <MapView
            initialCamera={this.state.initialCamera}
            provider={"google"} // Always use GoogleMaps (instead of MapKit on iOS)
            showsUserLocation={true}
            showsCompass={true}
            toolbarEnabled={false} // Hide map buttons on marker press
            minZoomLevel={14}
            maxZoomLevel={19}
            //mapType={"hybrid"}
            mapType={"none"}
            style={styles.mapStyle}
            ref={(ref) => (this.mapView = ref)}
            onMapReady={this.mapSetup.bind(this)} //Initialize map boundaries when the map loads
          >
            {/* <LocalTile
              pathTemplate={"./assets/tiles/{z}/{x}/{y}.png"}
              tileSize={512}
            /> */}
            <UrlTile
              urlTemplate={
                "https://tile.thunderforest.com/landscape/{z}/{x}/{y}@2x.png?apikey=b5fc3b88cf204ad8b1381b659cc07391"
              }
              maximumZ={22}
              flipY={false}
              zIndex={-3}
            />
            <RidgeRun />
            <SpeedRocket />
            <SwitchForward />
            <Hike1 />
            <Hike2 />
            <HikeAround />

            {/* <Marker
              coordinate={{ latitude: 44.5227, longitude: -80.35 }}
              image={require("./assets/trailMarkers/circle40.png")}
            /> */}
          </MapView>
        }
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  map: {
    flex: 1,
    position: "absolute",
  },
});
