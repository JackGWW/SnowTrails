import React from "react";
import Mapbox from "@rnmapbox/maps";
import { Image } from 'expo-image';
import { View, Text, StyleSheet } from 'react-native';

export default class CustomMarker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCallout: false
        };
    }

    displayTrailName(autoHide = true) {
        this.setState({ showCallout: true });

        if (autoHide) {
            setTimeout(() => {
                try {
                    this.setState({ showCallout: false });
                } catch (e) {
                    console.log(e.toString())
                }
            }, 5 * 1000)
        }
    }

    render() {
        let markerKey = this.props.id + this.props.longitudeDelta;
        const iconDescriptor = this.props.icon;
        const coordinate = [this.props.location.longitude, this.props.location.latitude];

        return (
            <Mapbox.MarkerView
                id={markerKey}
                coordinate={coordinate}
                allowOverlap={true}
                anchor={{ x: 0.5, y: 0.5 }}
            >
                <View style={{ alignItems: 'center' }}>
                    {iconDescriptor ? (
                        <Image
                            source={iconDescriptor.source}
                            style={{ height: iconDescriptor.height, width: iconDescriptor.width }}
                            contentFit="contain"
                        />
                    ) : null}
                    {this.state.showCallout && (this.props.trailName || this.props.trailDescription) && (
                        <View style={styles.callout}>
                            {this.props.trailName && (
                                <Text style={styles.calloutTitle}>{this.props.trailName}</Text>
                            )}
                            {this.props.trailDescription && (
                                <Text style={styles.calloutDescription}>{this.props.trailDescription}</Text>
                            )}
                        </View>
                    )}
                </View>
            </Mapbox.MarkerView>
        );
    }
};

const styles = StyleSheet.create({
    callout: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
        minWidth: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    calloutTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    calloutDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});
