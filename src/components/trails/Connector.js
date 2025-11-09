import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Connector.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52190512791276, longitude: -80.36701857112348}}
        trailName={"Connector"}
        trailDescription={"241m  -  45m\u2191 0m\u2193"}
        icon={props.markerImages["Square"]}
        id={"321072"}
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
