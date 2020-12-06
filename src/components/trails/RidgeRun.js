import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/RidgeRun.json"


const ShowTrail = () => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"blue"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
