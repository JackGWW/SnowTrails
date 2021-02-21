import React from "react";
import { Marker } from "react-native-maps";
import { Image } from 'react-native';

export default class circleMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    //As the screen zooms out, make the icons smaller
    getSize(){
        delta = this.props.longitudeDelta
        var size;
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
        return size
    }

    getIcon(shape) {
        icons = {
            "Circle": require("../../../assets/trailMarkers/circle.png"),
            "Square": require("../../../assets/trailMarkers/square.png"),
            "Diamond": require("../../../assets/trailMarkers/diamond.png")
        }
        return icons[shape];
    }

    displayTrailName() {
        this.marker.showCallout()
        setTimeout(function () { this.marker.hideCallout() }.bind(this), 5 * 1000)
    }

    render() {
        icon = this.getIcon(this.props.shape)
        size = this.getSize()
        markerKey = this.props.id + this.props.longitudeDelta.toFixed(5)
        return (
            <Marker
                coordinate={this.props.location}
                title={this.props.trailName}
                description={this.props.trailDescription}
                ref={ref => { this.marker = ref; }}
                tracksViewChanges={false}
                key={ markerKey } // Key update is required to get android to redraw the image at a different size
            >
                <Image source={icon} style={{ height: size, width: size }} />
            </Marker>
        );
    }
};





