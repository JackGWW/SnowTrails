import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/FarmRoad.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51194843277335, longitude: -80.35213071852922}}
        trailName={"Farm Road"}
        trailDescription={"719m  -  10m\u2191 5m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"575587"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#212121"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
