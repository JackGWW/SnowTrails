import React from "react";
import { Marker } from "react-native-maps";

export default diamond60 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/diamond60.png")}
        />
    );
};


