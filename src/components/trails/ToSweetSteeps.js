import React from "react";
import TrailLine from "./TrailLine";
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

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#212121"}
      />
    </>
  );
};

export default ShowTrail;
