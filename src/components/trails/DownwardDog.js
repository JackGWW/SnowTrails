import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/DownwardDog.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51655210927129, longitude: -80.36226284690201}}
        trailName={"Downward Dog"}
        trailDescription={"400m  -  69m\u2191 3m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"630725"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#FF9100"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
