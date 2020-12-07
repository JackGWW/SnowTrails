import React from "react";
import { Marker } from "react-native-maps";

export default square50 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/square50.png")}
        />
    );
};


