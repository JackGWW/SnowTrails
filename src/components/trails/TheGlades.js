import React from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/TheGlades.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.527416145429015, longitude: -80.36455605179071}}
        trailName={"The Glades"}
        trailDescription={"568m  -  39m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"063617"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#FF9100"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
