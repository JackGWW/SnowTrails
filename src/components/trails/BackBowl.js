import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Backbowl.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"#fc03f0"} //Pink
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
