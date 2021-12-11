import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/ToBruceTrail.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#212121"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
