import React from "react";
import { Polyline } from "react-native-maps";
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

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#2962FF"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
