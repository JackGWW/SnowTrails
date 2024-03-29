import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Woodpecker.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5235022995621, longitude: -80.36865320988}}
        trailName={"Woodpecker"}
        trailDescription={"274m  -  28m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"103179"}
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
