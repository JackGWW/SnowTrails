import React from "react";
import MapboxGL from "@rnmapbox/maps";
import { StyleSheet, View, Text } from "react-native";
import { Image } from 'expo-image';

export default class CustomMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calloutVisible: false,
    };

    this.hideTimeout = null;
  }

  componentWillUnmount() {
    this.clearHideTimeout();
  }

  clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  displayTrailName(autoHide = true) {
    this.setState({ calloutVisible: true }, () => {
      if (autoHide) {
        this.clearHideTimeout();
        this.hideTimeout = setTimeout(() => this.hideCallout(), 5 * 1000);
      }
    });
  }

  hideCallout() {
    this.clearHideTimeout();
    this.setState({ calloutVisible: false });
  }

  renderCallout() {
    const { calloutVisible } = this.state;
    const { trailName, trailDescription } = this.props;

    if (!calloutVisible || (!trailName && !trailDescription)) {
      return null;
    }

    return (
      <MapboxGL.Callout>
        <View style={styles.calloutContainer}>
          {trailName ? <Text style={styles.calloutTitle}>{trailName}</Text> : null}
          {trailDescription ? <Text style={styles.calloutSubtitle}>{trailDescription}</Text> : null}
        </View>
      </MapboxGL.Callout>
    );
  }

  render() {
    let markerKey = this.props.id + this.props.longitudeDelta
    const iconDescriptor = this.props.icon;
    const coordinate = [this.props.location.longitude, this.props.location.latitude];

    return (
      <MapboxGL.PointAnnotation
        id={String(markerKey)}
        coordinate={coordinate}
        ref={ref => { this.marker = ref; }}
        anchor={{ x: 0.5, y: 0.5 }}
        key={markerKey}
        onSelected={() => this.displayTrailName(false)}
        onDeselected={() => this.hideCallout()}
      >
        {iconDescriptor ? (
          <Image
            source={iconDescriptor.source}
            style={{ height: iconDescriptor.height, width: iconDescriptor.width }}
            contentFit="contain"
          />
        ) : null}
        {this.renderCallout()}
      </MapboxGL.PointAnnotation>
    );
  }
};

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    maxWidth: 200,
  },
  calloutTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontSize: 12,
  },
});
