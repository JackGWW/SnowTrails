import React from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/NorthsideTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.523475812748075, longitude: -80.35000414587557}}
        trailName={"Northside Trail"}
        trailDescription={"1.27km  -  169m\u2191 20m\u2193"}
        icon={props.markerImages["Square"]}
        id={"331275"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52389775775373, longitude: -80.3563383501023}}
        trailName={"Northside Trail"}
        trailDescription={"1.27km  -  169m\u2191 20m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"348576"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#D50000"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
