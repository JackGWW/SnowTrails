import React from "react";
import { Marker } from "react-native-maps";

export default circle60 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/circle60.png")}
        />
    );
};


