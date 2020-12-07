import React from "react";
import Square20 from "./Square20"
import Square30 from "./Square30"
import Square40 from "./Square40"
import Square50 from "./Square50"
import Square60 from "./Square60"

export default SquareMarker = (props) => {
    //As the screen zooms out, make the icons smaller
    const delta = props.longitudeDelta
    //console.log(delta)
    switch (true) {
        case (delta < 0.002):
            //console.log(60)
            return <Square60 location={props.location} />
        case (delta < 0.0055):
            //console.log(50)
            return <Square50 location={props.location} />
        case (delta < 0.0105):
            //console.log(40)
            return <Square40 location={props.location} />
        case (delta < 0.019):
            //console.log(30)
            return <Square30 location={props.location} />
        default:
            //console.log(20)
            return <Square20 location={props.location} />
    }
};



