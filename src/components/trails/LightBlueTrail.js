import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/LightBlueTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52794009819627, longitude: -80.38185227662325}}
        trailName={"Light Blue Trail"}
        trailDescription={"525m  -  25m\u2191 31m\u2193"}
        icon={props.markerImages["Square"]}
        id={"842698"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#0CE1F1"}
      />
    </>
  );
};

export default ShowTrail;
