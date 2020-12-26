import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, {
  UrlTile,
} from "react-native-maps";

// Polyline components for each trail
import AlpineExpress from "./trails/AlpineExpress";
import EnchantedForest from "./trails/EnchantedForest";
import FarmRoad from "./trails/FarmRoad"
import ForestGump from "./trails/ForestGump";
import ForestLane from "./trails/ForestLane";
import LoversLoop from "./trails/LoversLoop";
import SkiAcross from "./trails/SkiAcross";
import Switchback from "./trails/Switchback";

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
      longitudeDelta: 0.011
    };
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

  updateRegion(region) {
    this.setState({longitudeDelta: region.longitudeDelta})
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
            mapType={"none"}
            style={styles.mapStyle}
            ref={(ref) => (this.mapView = ref)}
            onMapReady={this.mapSetup.bind(this)} //Initialize map boundaries when the map loads
            onRegionChangeComplete={region => this.updateRegion(region)}
          >

            <UrlTile
              urlTemplate={
                //"https://tile.thunderforest.com/landscape/{z}/{x}/{y}@2x.png?apikey=b5fc3b88cf204ad8b1381b659cc07391"
                "https://api.mapbox.com/styles/v1/jackgww/ckixum56n651w19npcrja4rnq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamFja2d3dyIsImEiOiJja2l4dDZ5bnIxZTh1MnNwZmdxODA4cjU1In0.QruuU5HoAnwNtt0UE45GSg"
              }
              maximumZ={22}
              flipY={false}
              zIndex={-3}
            />
            <AlpineExpress longitudeDelta={this.state.longitudeDelta} />
            <EnchantedForest longitudeDelta={this.state.longitudeDelta}/>
            <FarmRoad longitudeDelta={this.state.longitudeDelta}/>
            <ForestGump  longitudeDelta={this.state.longitudeDelta}/>
            <ForestLane longitudeDelta={this.state.longitudeDelta}/>
            <LoversLoop longitudeDelta={this.state.longitudeDelta}/>
            <SkiAcross longitudeDelta={this.state.longitudeDelta}/>
            <Switchback longitudeDelta={this.state.longitudeDelta}/>
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
