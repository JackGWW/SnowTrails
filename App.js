import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import MapView, { Polyline, Marker, UrlTile } from "react-native-maps";

export default class App extends React.Component {
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
            minZoomLevel={13}
            //mapType={"hybrid"}
            mapType={"none"}
            style={styles.mapStyle}
            ref={(ref) => (this.mapView = ref)}
            onMapReady={this.mapSetup.bind(this)} //Initialize map boundaries when the map loads
          >
            <UrlTile
              urlTemplate={
                "https://tile.thunderforest.com/landscape/{z}/{x}/{y}@2x.png?apikey=b5fc3b88cf204ad8b1381b659cc07391"
              }
              maximumZ={22}
              flipY={false}
              zIndex={-3}
            />
            <Polyline
              coordinates={[
                { latitude: 44.5229, longitude: -80.34874 },
                { latitude: 44.5227, longitude: -80.34923 },
                { latitude: 44.52262, longitude: -80.34953 },
                { latitude: 44.52241, longitude: -80.35004 },
                { latitude: 44.52221, longitude: -80.35071 },
                { latitude: 44.52203, longitude: -80.35127 },
                { latitude: 44.5218, longitude: -80.35189 },
                { latitude: 44.52195, longitude: -80.35221 },
                { latitude: 44.52252, longitude: -80.3529 },
                { latitude: 44.52242, longitude: -80.35367 },
                { latitude: 44.5225, longitude: -80.35403 },
                { latitude: 44.52267, longitude: -80.35444 },
              ]}
              strokeColor="blue"
              strokeWidth={3}
            />
            <Polyline
              coordinates={[
                { latitude: 44.52299, longitude: -80.35639 },
                { latitude: 44.52368, longitude: -80.35656 },
                { latitude: 44.52421, longitude: -80.35697 },
                { latitude: 44.52479, longitude: -80.35901 },
                { latitude: 44.524, longitude: -80.360239 },
                { latitude: 44.52172, longitude: -80.35946 },
                { latitude: 44.52097, longitude: -80.3588 },
                { latitude: 44.52076, longitude: -80.35721 },
                { latitude: 44.52177, longitude: -80.35783 },
                { latitude: 44.52183, longitude: -80.35736 },
                { latitude: 44.52152, longitude: -80.35577 },
                { latitude: 44.52212, longitude: -80.3557 },
              ]}
              strokeColor="yellow"
              strokeWidth={3}
            />
            <Polyline
              coordinates={[
                { latitude: 44.52465, longitude: -80.34969},
                { latitude: 44.52451, longitude: -80.35019},
                { latitude: 44.52451, longitude: -80.35084},
                { latitude: 44.52424, longitude: -80.35094},
                { latitude: 44.52409, longitude: -80.35147},
                { latitude: 44.52393, longitude: -80.35164},
                { latitude: 44.52388, longitude: -80.35213},
                { latitude: 44.52461, longitude: -80.3536},
                { latitude: 44.52423, longitude: -80.35434},
                { latitude: 44.52393, longitude: -80.35434},
                { latitude: 44.52377, longitude: -80.35465},
                { latitude: 44.52416, longitude: -80.35566},
                { latitude: 44.52414, longitude: -80.35659},
                { latitude: 44.52379, longitude: -80.35722},
                { latitude: 44.52256, longitude: -80.36009},
                { latitude: 44.52331, longitude: -80.36155},
                { latitude: 44.52397, longitude: -80.36116},
                { latitude: 44.52694, longitude: -80.36192},
                { latitude: 44.52822, longitude: -80.36294},
                { latitude: 44.52976, longitude: -80.36519},
                { latitude: 44.53004, longitude: -80.36721},
              ]}
              strokeColor="red"
              strokeWidth={3}
            />
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
