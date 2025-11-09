import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/OverTheHill.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.521359633654356, longitude: -80.35730939358473}}
        trailName={"Over The Hill"}
        trailDescription={"443m  -  85m\u2191 7m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"993037"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#388E3C"}
      />
    </>
  );
};

export default ShowTrail;
