import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Hike1.json"
import CircleMarker from "./markers/CircleMarker"

const ShowTrail = (props) => {
  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.5227, longitude: -80.35 }}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"orange"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
