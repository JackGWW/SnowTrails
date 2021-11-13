import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/LightBlueTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52764547429979, longitude: -80.38193668238819}}
        trailName={"Light Blue Trail"}
        trailDescription={"326m  -  17m\u2191 20m\u2193"}
        icon={props.markerImages["Square"]}
        id={"080884"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#0CE1F1"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
