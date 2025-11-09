import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/BlueBird.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52601636759937, longitude: -80.36271957680583}}
        trailName={"Blue Bird"}
        trailDescription={"591m  -  26m\u2191 4m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"920646"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#2962FF"}
      />
    </>
  );
};

export default ShowTrail;
