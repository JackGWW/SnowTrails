import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/AlpineExpressLink.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#388E3C"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
