import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Switchback.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"#FFFF00"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
