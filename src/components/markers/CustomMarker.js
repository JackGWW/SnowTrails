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
        top: -70,
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        minWidth: 120,
        maxWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    calloutTitle: {
        fontWeight: '700',
        fontSize: 15,
        color: '#2E3A52',
        letterSpacing: 0.2,
    },
    calloutDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
        lineHeight: 18,
    },
});
