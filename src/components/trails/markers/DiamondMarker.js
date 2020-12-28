import React from "react";
import { Marker } from "react-native-maps";

export default class diamondMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    //As the screen zooms out, make the icons smaller
    getIcon() {
        delta = this.props.longitudeDelta
        switch (true) {
            case (delta < 0.002):
                return require("../../../../assets/trailMarkers/diamond60.png");
            case (delta < 0.0055):
                return require("../../../../assets/trailMarkers/diamond50.png");
            case (delta < 0.0105):
                return require("../../../../assets/trailMarkers/diamond40.png");
            case (delta < 0.019):
                return require("../../../../assets/trailMarkers/diamond30.png");
            default:
                return require("../../../../assets/trailMarkers/diamond20.png");
        }
    }

    displayTrailName() {
        this.marker.showCallout()
        setTimeout(function () { this.marker.hideCallout() }.bind(this), 5 * 1000)
    }

    render() {
        icon = this.getIcon()
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





