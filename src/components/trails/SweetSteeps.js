import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/SweetSteeps.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52706309966743, longitude: -80.35891637206078}}
        trailName={"Sweet Steeps"}
        trailDescription={"1.02km  -  164m\u2191 18m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"393346"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#FF9100"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
