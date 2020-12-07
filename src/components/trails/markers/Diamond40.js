import React from "react";
import { Marker } from "react-native-maps";

export default diamond40 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/diamond40.png")}
        />
    );
};


