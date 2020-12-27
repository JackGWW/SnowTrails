import React from "react";
import { Polyline } from "react-native-maps";
import southTrail from "../../../data/json/ToSouth.json"
import riverTrail from "../../../data/json/ToRiver.json"
import steepsTrail from "../../../data/json/ToSteeps.json"
import sweetSteepsTrail from "../../../data/json/ToSweetSteeps.json"


const ShowTrail = (props) => {
    return (
        <>
            <Polyline
                coordinates={southTrail}
                strokeColor={"black"}
                strokeWidth={3}
            />
            <Polyline
                coordinates={riverTrail}
                strokeColor={"black"}
                strokeWidth={3}
            />
            <Polyline
                coordinates={steepsTrail}
                strokeColor={"black"}
                strokeWidth={3}
            />
            <Polyline
                coordinates={sweetSteepsTrail}
                strokeColor={"black"}
                strokeWidth={3}
            />
        </>
    );
};

export default ShowTrail;
