import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/PinkTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5299572031945, longitude: -80.38175747729838}}
        trailName={"Pink Trail"}
        trailDescription={"429m  -  111m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"410388"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"magenta"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
