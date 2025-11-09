import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/AlpineExpress.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51894162222743, longitude: -80.34792141057551}}
        trailName={"Alpine Express"}
        trailDescription={"893m  -  147m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"834808"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51680038124323, longitude: -80.35061250440776}}
        trailName={"Alpine Express"}
        trailDescription={"893m  -  147m\u2191 1m\u2193"}
        icon={props.markerImages["Square"]}
        id={"164535"}
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
