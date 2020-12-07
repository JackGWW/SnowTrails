import React from "react";
import Circle30 from "./Circle30"
import Circle40 from "./Circle40"
import Circle50 from "./Circle50"

export default circleMarker = (props) => {
    //As the screen zooms out, make the icons smaller
    const delta = props.longitudeDelta
    console.log(delta)
    switch (true) {
        case (delta < 0.009):
            console.log(50)
            return <Circle50 location={props.location} />
        case (delta < 0.0105):
            console.log(40)
            return <Circle40 location={props.location} />
        default:
            console.log(30)
            return <Circle30 location={props.location} />
    }
};



