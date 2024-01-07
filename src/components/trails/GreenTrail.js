import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/GreenTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52890686690807, longitude: -80.38758231326938}}
        trailName={"Green Trail"}
        trailDescription={"1.29km  -  168m\u2191 11m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"463613"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525645384564996, longitude: -80.38238016888499}}
        trailName={"Green Trail"}
        trailDescription={"1.29km  -  168m\u2191 11m\u2193"}
        icon={props.markerImages["Square"]}
        id={"478432"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#388E3C"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
