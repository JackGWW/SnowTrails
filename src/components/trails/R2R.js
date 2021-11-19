import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/R2R.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.519146559759974, longitude: -80.36112525500357}}
        trailName={"R2R"}
        trailDescription={"591m  -  116m\u2191 0m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"952436"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"magenta"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
