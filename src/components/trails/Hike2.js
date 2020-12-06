import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Hike2.json"

const ShowTrail = () => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"purple"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
