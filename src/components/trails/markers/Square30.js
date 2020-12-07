import React from "react";
import { Marker } from "react-native-maps";

export default square30 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/square30.png")}
        />
    );
};


