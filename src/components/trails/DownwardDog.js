import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/DownwardDog.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51655210927129, longitude: -80.36226284690201}}
        trailName={"Downward Dog"}
        trailDescription={"400m  -  69m\u2191 3m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"630725"}
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
