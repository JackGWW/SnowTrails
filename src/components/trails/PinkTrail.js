import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/PinkTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5299572031945, longitude: -80.38175747729838}}
        trailName={"Pink Trail"}
        trailDescription={"429m  -  111m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"410388"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"magenta"}
      />
    </>
  );
};

export default ShowTrail;
