import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Backbowl.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525374146178365, longitude: -80.36739433184266}}
        trailName={"Backbowl"}
        trailDescription={"584m  -  45m\u2191 20m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"664296"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#FF9100"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
