import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/LoversLoop.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51765147969127, longitude: -80.34795200452209}}
        trailName={"Lover's Loop"}
        trailDescription={"818m  -  146m\u2191 3m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"483082"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51585146598518, longitude: -80.34932781010866}}
        trailName={"Lover's Loop"}
        trailDescription={"818m  -  146m\u2191 3m\u2193"}
        icon={props.markerImages["Square"]}
        id={"412348"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#FFEA00"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
