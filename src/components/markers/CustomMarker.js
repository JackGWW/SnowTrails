import React from "react";
import { Marker } from "react-native-maps";
import { Image } from 'expo-image';

export default class CustomMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    displayTrailName(autoHide = true) {
        this.marker.showCallout()

        if (autoHide) {
            setTimeout(function () {
                try {
                    this.marker.hideCallout()
                } catch (e) {
                    console.log(e.toString())
                }
            }.bind(this), 5 * 1000)
        }
    }

    render() {
        let markerKey = this.props.id + this.props.longitudeDelta
        const iconDescriptor = this.props.icon;
        return (
            <Marker
                coordinate={this.props.location}
                title={this.props.trailName}
                description={this.props.trailDescription}
                ref={ref => { this.marker = ref; }}
                tappable={false}
                key={markerKey} // Key update is required to get android to redraw the image at a different size
            >
                {iconDescriptor ? (
                    <Image
                        source={iconDescriptor.source}
                        style={{ height: iconDescriptor.height, width: iconDescriptor.width }}
                        contentFit="contain"
                    />
                ) : null}
            </Marker>
        );
    }
};
