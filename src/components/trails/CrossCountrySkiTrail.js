import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/CrossCountrySkiTrail.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        lineDashPattern={[3, 3]}
        coordinates={trail}
        strokeColor={"#D50000"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
