import React from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/LightBlueTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52794009819627, longitude: -80.38185227662325}}
        trailName={"Light Blue Trail"}
        trailDescription={"525m  -  25m\u2191 31m\u2193"}
        icon={props.markerImages["Square"]}
        id={"842698"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#0CE1F1"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
