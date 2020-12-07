import React from "react";
import { Marker } from "react-native-maps";

export default circle20 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/circle20.png")}
        />
    );
};


