import React from "react";
import { Marker } from "react-native-maps";

export default diamond50 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/diamond50.png")}
        />
    );
};


