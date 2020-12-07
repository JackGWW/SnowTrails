import React from "react";
import { Marker } from "react-native-maps";

export default diamond30 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/diamond30.png")}
        />
    );
};


