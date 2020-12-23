import React from "react";
import { Marker } from "react-native-maps";

export default class circleMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    //As the screen zooms out, make the icons smaller
    getIcon() {
        delta = this.props.longitudeDelta
        switch (true) {
            case (delta < 0.002):
                console.log(60)
                return require("../../../../assets/trailMarkers/circle60.png");
            case (delta < 0.0055):
                console.log(50)
                return require("../../../../assets/trailMarkers/circle50.png");
            case (delta < 0.0105):
                console.log(40)
                return require("../../../../assets/trailMarkers/circle40.png");
            case (delta < 0.019):
                console.log(30)
                return require("../../../../assets/trailMarkers/circle30.png");
            default:
                console.log(20)
                return require("../../../../assets/trailMarkers/circle20.png");
        }
    }

    displayTrailName() {
        this.marker.showCallout()
        setTimeout(function () { this.marker.hideCallout() }.bind(this), 5 * 1000)
    }

    render() {
        icon = this.getIcon()
        console.log(this.props.calloutOffset)
        return (
            <Marker
                coordinate={this.props.location}
                image={icon}
                title={this.props.trailName}
                description={this.props.trailDescription}
                ref={ref => {this.marker = ref;}}
            />
        );
    }
};





