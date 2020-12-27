import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/BlueBird.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"blue"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
