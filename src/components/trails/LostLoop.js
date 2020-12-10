import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/LostLoop.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"#8f6538"} //Brown
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
