import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/CrossCountrySki.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#D50000"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
