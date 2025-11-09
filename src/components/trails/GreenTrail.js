import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/GreenTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52890686690807, longitude: -80.38758231326938}}
        trailName={"Green Trail"}
        trailDescription={"1.29km  -  168m\u2191 11m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"463613"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525645384564996, longitude: -80.38238016888499}}
        trailName={"Green Trail"}
        trailDescription={"1.29km  -  168m\u2191 11m\u2193"}
        icon={props.markerImages["Square"]}
        id={"478432"}
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
