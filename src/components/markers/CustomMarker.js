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
            setTimeout(function () {
                try {
                    this.setState({ showCallout: false });
                } catch (e) {
                    console.log(e.toString())
                }
            }.bind(this), 5 * 1000)
        }
    }

    hideCallout() {
        this.setState({ showCallout: false });
    }

    render() {
        let markerKey = this.props.id + this.props.longitudeDelta;
        const iconDescriptor = this.props.icon;
        const { location, trailName, trailDescription } = this.props;

        return (
            <Mapbox.MarkerView
                id={markerKey}
                coordinate={[location.longitude, location.latitude]}
                anchor={{ x: 0.5, y: 0.5 }}
            >
                <View style={styles.markerContainer}>
                    {iconDescriptor ? (
                        <Image
                            source={iconDescriptor.source}
                            style={{ height: iconDescriptor.height, width: iconDescriptor.width }}
                            contentFit="contain"
                        />
                    ) : null}
                    {this.state.showCallout && (
                        <View style={styles.callout}>
                            <Text style={styles.calloutTitle}>{trailName}</Text>
                            {trailDescription && (
                                <Text style={styles.calloutDescription}>{trailDescription}</Text>
                            )}
                        </View>
                    )}
                </View>
            </Mapbox.MarkerView>
        );
    }
}

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    callout: {
        position: 'absolute',
        top: -60,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        minWidth: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    calloutDescription: {
        fontSize: 12,
        marginTop: 4,
    },
});
