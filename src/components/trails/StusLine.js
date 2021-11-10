import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/StusLine.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        coordinates={trail}
        strokeColor={"#989898"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
