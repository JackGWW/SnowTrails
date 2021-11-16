import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/RedTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52644736506045, longitude: -80.38758407346904}}
        trailName={"Red Trail"}
        trailDescription={"1.39km  -  148m\u2191 17m\u2193"}
        icon={props.markerImages["Square"]}
        id={"408594"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52871609479189, longitude: -80.39135039784014}}
        trailName={"Red Trail"}
        trailDescription={"1.39km  -  148m\u2191 17m\u2193"}
        icon={props.markerImages["Square"]}
        id={"304825"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#D50000"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
