import React from "react";
import { Marker } from "react-native-maps";

export default class Cirlce30 extends React.Component {

    constructor(props) {
        super(props);
    }

    displayTrailName() {
        this.marker.showCallout()
        setTimeout(function(){this.marker.hideCallout()}.bind(this), 5 * 1000)
    }

    render() {
        return (
            <Marker
                coordinate={this.props.location}
                image={require("../../../../assets/trailMarkers/circle30.png")}
                title={"Switchback"}
                description={"1.07KM"}
                ref={ref => { this.marker = ref; }}
            />
        );
    }
};


