import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/PurpleTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525083964690566, longitude: -80.38657036609948}}
        trailName={"Purple Trail"}
        trailDescription={"419m  -  10m\u2191 21m\u2193"}
        icon={props.markerImages["Square"]}
        id={"140891"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#9400D3"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
