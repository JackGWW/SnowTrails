import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/HikeAround.json"
import SquareMarker from "./markers/SquareMarker"


const ShowTrail = (props) => {
  return (
    <>
      <SquareMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.5227, longitude: -80.36 }}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"green"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
