import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/TheGlades.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.527416145429015, longitude: -80.36455605179071}}
        trailName={"The Glades"}
        trailDescription={"568m  -  39m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"063617"}
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
