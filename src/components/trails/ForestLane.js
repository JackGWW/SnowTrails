import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/ForestLane.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51316950842738, longitude: -80.35527175292373}}
        trailName={"Forest Lane"}
        trailDescription={"338m  -  3m\u2191 8m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"496346"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#212121"}
      />
    </>
  );
};

export default ShowTrail;
