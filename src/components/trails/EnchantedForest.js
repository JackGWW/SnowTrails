import React from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/EnchantedForest.json"


const ShowTrail = (props) => {
  return (
    <Polyline
      coordinates={trail}
      strokeColor={"#820c4d"} //Maroon
      strokeWidth={3}
    />
  );
};

export default ShowTrail;
