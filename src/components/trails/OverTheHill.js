import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/OverTheHill.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.521359633654356, longitude: -80.35730939358473}}
        trailName={"Over The Hill"}
        trailDescription={"443m  -  85m\u2191 7m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"993037"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#388E3C"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
