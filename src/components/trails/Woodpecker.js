import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Woodpecker.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5235022995621, longitude: -80.36865320988}}
        trailName={"Woodpecker"}
        trailDescription={"274m  -  28m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"103179"}
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
