import React from "react";
import { Marker } from "react-native-maps";

export default square60 = (props) => {
    return (
        <Marker
            coordinate={props.location}
            image={require("../../../../assets/trailMarkers/square60.png")}
        />
    );
};


