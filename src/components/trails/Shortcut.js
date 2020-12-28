import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Shortcut.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"yellow"}
      strokeWidth={3}
    />
  );
};

export default ShowTrail;