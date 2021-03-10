import React from "react";
import { Marker } from "react-native-maps";
import { Image } from 'react-native';

export default class circleMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    displayTrailName() {
        this.marker.showCallout()
        setTimeout(function () { this.marker.hideCallout() }.bind(this), 5 * 1000)
    }

    render() {
        markerKey = this.props.id + this.props.longitudeDelta
        return (
            <Marker
                coordinate={this.props.location}
                title={this.props.trailName}
                description={this.props.trailDescription}
                ref={ref => { this.marker = ref; }}
                tracksViewChanges={false}
                key={ markerKey } // Key update is required to get android to redraw the image at a different size
            >
               { this.props.icon }
            </Marker>
        );
    }
};





