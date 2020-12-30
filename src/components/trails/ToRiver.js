import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/ToRiver.json"

const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"black"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
