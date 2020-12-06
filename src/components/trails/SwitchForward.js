import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/SwitchForward.json"

const ShowTrail = () => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor="red"
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
