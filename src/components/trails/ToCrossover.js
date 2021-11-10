import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/ToCrossover.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        coordinates={trail}
        strokeColor={"#2962FF"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
