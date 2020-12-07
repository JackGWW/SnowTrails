import React from "react";
import { Marker } from "react-native-maps";

export default diamond20 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/diamond20.png")}
        />
    );
};


