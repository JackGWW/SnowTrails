import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/YellowTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.527279268950224, longitude: -80.38418881595135}}
        trailName={"Yellow Trail"}
        trailDescription={"1.3km  -  218m\u2191 32m\u2193"}
        icon={props.markerImages["Square"]}
        id={"700112"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.524569399654865, longitude: -80.38363678380847}}
        trailName={"Yellow Trail"}
        trailDescription={"1.3km  -  218m\u2191 32m\u2193"}
        icon={props.markerImages["Square"]}
        id={"153605"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.53043036162853, longitude: -80.38255736231804}}
        trailName={"Yellow Trail"}
        trailDescription={"1.3km  -  218m\u2191 32m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"068951"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#FFEA00"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
