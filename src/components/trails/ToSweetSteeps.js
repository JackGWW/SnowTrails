import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/ToSweetSteeps.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52884467318654, longitude: -80.3573933802545}}
        trailName={"To Sweet Steeps"}
        trailDescription={"224m  -  34m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"706797"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#212121"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
