import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/AlpineExpress.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51894162222743, longitude: -80.34792141057551}}
        trailName={"Alpine Express"}
        trailDescription={"893m  -  147m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"834808"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51680038124323, longitude: -80.35061250440776}}
        trailName={"Alpine Express"}
        trailDescription={"893m  -  147m\u2191 1m\u2193"}
        icon={props.markerImages["Square"]}
        id={"164535"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#388E3C"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
