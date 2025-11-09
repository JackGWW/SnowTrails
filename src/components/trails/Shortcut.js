import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Shortcut.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.522471660748124, longitude: -80.35474914126098}}
        trailName={"Shortcut"}
        trailDescription={"244m  -  42m\u2191 4m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"051286"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#FFEA00"}
      />
    </>
  );
};

export default ShowTrail;
