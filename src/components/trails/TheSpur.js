import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/TheSpur.json"

const ShowTrail = (props) => {
  return (
      <Polyline
        coordinates={trail}
        strokeColor={"#FF9100"}
        strokeWidth={3}
      />

  );
};

export default ShowTrail;
