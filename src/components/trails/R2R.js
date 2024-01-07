import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/R2R.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.519146559759974, longitude: -80.36112525500357}}
        trailName={"R2R"}
        trailDescription={"618m  -  114m\u2191 0m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"952436"}
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
