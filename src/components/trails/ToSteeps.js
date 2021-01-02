import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/ToSteeps.json"

const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"#212121"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
