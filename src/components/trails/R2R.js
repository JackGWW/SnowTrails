import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/R2R.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        coordinates={trail}
        strokeColor={"magenta"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
