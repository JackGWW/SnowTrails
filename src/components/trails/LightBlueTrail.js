import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/LightBlueTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52746911905706, longitude: -80.38192612119019}}
        trailName={"Light Blue Trail"}
        trailDescription={"326m  -  17m\u2191 20m\u2193"}
        icon={props.markerImages["Square"]}
        id={"213313"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#ADD8E6"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
