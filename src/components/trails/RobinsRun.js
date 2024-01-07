import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/RobinsRun.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.515025932341814, longitude: -80.35941417329013}}
        trailName={"Robin's Run"}
        trailDescription={"299m  -  0m\u2191 57m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"094832"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#FFEA00"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
