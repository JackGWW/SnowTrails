import React from "react";
import Diamond20 from "./Diamond20"
import Diamond30 from "./Diamond30"
import Diamond40 from "./Diamond40"
import Diamond50 from "./Diamond50"
import Diamond60 from "./Diamond60"

export default DiamondMarker = (props) => {
    //As the screen zooms out, make the icons smaller
    const delta = props.longitudeDelta
    //console.log(delta)
    switch (true) {
        case (delta < 0.002):
            //console.log(60)
            return <Diamond60 location={props.location} />
        case (delta < 0.0055):
            //console.log(50)
            return <Diamond50 location={props.location} />
        case (delta < 0.0105):
            //console.log(40)
            return <Diamond40 location={props.location} />
        case (delta < 0.019):
            //console.log(30)
            return <Diamond30 location={props.location} />
        default:
            //console.log(20)
            return <Diamond20 location={props.location} />
    }
};



