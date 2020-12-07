import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Hike2.json"
import DiamondMarker from "./markers/DiamondMarker"


const ShowTrail = (props) => {
  return (
    <>
      <DiamondMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.5227, longitude: -80.355 }}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"purple"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
