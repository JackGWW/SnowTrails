import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/BlueBird.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52601636759937, longitude: -80.36271957680583}}
        trailName={"Blue Bird"}
        trailDescription={"591m  -  26m\u2191 4m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"920646"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#2962FF"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
