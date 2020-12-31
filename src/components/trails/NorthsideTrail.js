import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/NorthsideTrail.json"

const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"red"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
