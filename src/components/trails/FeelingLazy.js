import React from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/FeelingLazy.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.523445973172784, longitude: -80.35922013223171}}
        trailName={"Feeling Lazy"}
        trailDescription={"170m  -  29m\u2191 2m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"905893"}
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
