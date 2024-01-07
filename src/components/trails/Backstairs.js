import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Backstairs.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51643291860819, longitude: -80.3465835750103}}
        trailName={"Backstairs"}
        trailDescription={"950m  -  158m\u2191 0m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"640211"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.513524901121855, longitude: -80.34594789147377}}
        trailName={"Backstairs"}
        trailDescription={"950m  -  158m\u2191 0m\u2193"}
        icon={props.markerImages["Square"]}
        id={"351915"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5178415812552, longitude: -80.34474617801607}}
        trailName={"Backstairs"}
        trailDescription={"950m  -  158m\u2191 0m\u2193"}
        icon={props.markerImages["Square"]}
        id={"676087"}
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
