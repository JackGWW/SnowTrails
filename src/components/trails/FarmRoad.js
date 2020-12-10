import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/FarmRoad.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"#14c0c9"} //Light Blue
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
