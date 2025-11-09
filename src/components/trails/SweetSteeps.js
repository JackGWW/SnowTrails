import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/SweetSteeps.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52706309966743, longitude: -80.35891637206078}}
        trailName={"Sweet Steeps"}
        trailDescription={"1.02km  -  164m\u2191 18m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"393346"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#FF9100"}
      />
    </>
  );
};

export default ShowTrail;
