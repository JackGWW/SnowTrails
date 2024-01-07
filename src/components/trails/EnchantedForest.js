import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/EnchantedForest.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51386227272451, longitude: -80.35742313601077}}
        trailName={"Enchanted Forest"}
        trailDescription={"707m  -  22m\u2191 24m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"328626"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#FFEA00"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
