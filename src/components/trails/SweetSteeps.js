import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/SweetSteeps.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"orange"} 
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
