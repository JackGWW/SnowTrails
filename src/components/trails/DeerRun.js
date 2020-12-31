import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/DeerRun.json"

const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"pink"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
