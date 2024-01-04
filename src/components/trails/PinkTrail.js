import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/PinkTrail.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"magenta"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
