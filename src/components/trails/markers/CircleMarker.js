import React, { forwardRef, useRef, useImperativeHandle } from "react";
import Circle20 from "./Circle20"
import Circle30 from "./Circle30"
import Circle40 from "./Circle40"
import Circle50 from "./Circle50"
import Circle60 from "./Circle60"

export default circleMarker = forwardRef((props, ref) => {
    //As the screen zooms out, make the icons smaller
    const delta = props.longitudeDelta
    const childRef = useRef();

    useImperativeHandle(ref, () => ({
        displayTrailName() {
            console.log("Child1")
            childRef.current.displayTrailName()
        }
    }));

    switch (true) {
        case (delta < 0.002):
            //console.log(60)
            return <Circle60 location={props.location} ref={childRef} />
        case (delta < 0.0055):
            //console.log(50)
            return <Circle50 location={props.location} ref={childRef} />
        case (delta < 0.0105):
            //console.log(40)
            return <Circle40 location={props.location} ref={childRef} />
        case (delta < 0.019):
            //console.log(30)
            return <Circle30 location={props.location} ref={childRef} />
        default:
            //console.log(20)
            return <Circle20 location={props.location} ref={childRef} />
    }
});



