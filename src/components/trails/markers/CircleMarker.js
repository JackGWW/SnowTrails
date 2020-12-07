import React from "react";
import Circle40 from "./Circle40"

export default circleMarker = (props) => {
    //Update to switch based on zoom level
    console.log(props.longitudeDelta)
    if (props.longitudeDelta) {
        return (
            <Circle40 location={props.location} />
        );
    }
};



