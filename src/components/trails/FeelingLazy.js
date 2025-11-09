import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/FeelingLazy.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.523445973172784, longitude: -80.35922013223171}}
        trailName={"Feeling Lazy"}
        trailDescription={"170m  -  29m\u2191 2m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"905893"}
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
