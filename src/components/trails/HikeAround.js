import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/HikeAround.json"


const ShowTrail = () => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"green"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
