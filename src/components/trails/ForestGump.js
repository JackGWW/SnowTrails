import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/ForestGump.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51378314755857, longitude: -80.35327459685504}}
        trailName={"Forest Gump"}
        trailDescription={"324m  -  5m\u2191 8m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"296474"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#212121"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
