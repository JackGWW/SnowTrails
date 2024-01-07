import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/SouthAscent.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50960133224726, longitude: -80.33153696916997}}
        trailName={"South Ascent"}
        trailDescription={"1.33km  -  212m\u2191 5m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"692272"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50843364931643, longitude: -80.33438748680055}}
        trailName={"South Ascent"}
        trailDescription={"1.33km  -  212m\u2191 5m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"748412"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51220550574362, longitude: -80.3292023576796}}
        trailName={"South Ascent"}
        trailDescription={"1.33km  -  212m\u2191 5m\u2193"}
        icon={props.markerImages["Square"]}
        id={"193598"}
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
