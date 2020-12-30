import React from "react";
import { Marker } from "react-native-maps";

export default class circleMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    //As the screen zooms out, make the icons smaller
    getIcon(shape) {
        icons = {
            "Circle": {
                xSmall: require("../../../assets/trailMarkers/circle20.png"),
                small:  require("../../../assets/trailMarkers/circle30.png"),
                medium: require("../../../assets/trailMarkers/circle40.png"),
                large: require("../../../assets/trailMarkers/circle50.png"),
                xLarge: require("../../../assets/trailMarkers/circle60.png")
            },
            "Square": {
                xSmall: require("../../../assets/trailMarkers/square20.png"),
                small:  require("../../../assets/trailMarkers/square30.png"),
                medium: require("../../../assets/trailMarkers/square40.png"),
                large: require("../../../assets/trailMarkers/square50.png"),
                xLarge: require("../../../assets/trailMarkers/square60.png")
            },
            "Diamond": {
                xSmall: require("../../../assets/trailMarkers/diamond20.png"),
                small:  require("../../../assets/trailMarkers/diamond30.png"),
                medium: require("../../../assets/trailMarkers/diamond40.png"),
                large: require("../../../assets/trailMarkers/diamond50.png"),
                xLarge: require("../../../assets/trailMarkers/diamond60.png")
            },
        }
        delta = this.props.longitudeDelta
        switch (true) {
            case (delta < 0.002):
                return icons[shape].xLarge;
            case (delta < 0.0055):
                return icons[shape].large;
            case (delta < 0.0105):
                return icons[shape].medium;
            case (delta < 0.019):
                return icons[shape].small;
            default:
                return icons[shape].xSmall;
        }
    }

    displayTrailName() {
        this.marker.showCallout()
        setTimeout(function () { this.marker.hideCallout() }.bind(this), 5 * 1000)
    }

    render() {
        icon = this.getIcon(this.props.shape)
        return (
            <Marker
                coordinate={this.props.location}
                image={icon}
                title={this.props.trailName}
                description={this.props.trailDescription}
                ref={ref => {this.marker = ref;}}
                tracksViewChanges={false}
            />
        );
    }
};





