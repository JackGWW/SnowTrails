import React from "react";
import { Marker } from "react-native-maps";

export default square40 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/square40.png")}
        />
    );
};


