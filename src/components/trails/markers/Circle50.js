import React from "react";
import { Marker } from "react-native-maps";

export default circle40 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/circle50.png")}
        />
    );
};


