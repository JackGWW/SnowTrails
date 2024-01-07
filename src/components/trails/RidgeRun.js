import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/RidgeRun.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52047006227076, longitude: -80.35803811624646}}
        trailName={"Ridge Run"}
        trailDescription={"894m  -  138m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"539757"}
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
