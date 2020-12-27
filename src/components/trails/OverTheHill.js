import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/OverTheHill.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"green"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
