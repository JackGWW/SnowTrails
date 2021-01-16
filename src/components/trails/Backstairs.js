import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Backstairs.json"

const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"#212121"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
