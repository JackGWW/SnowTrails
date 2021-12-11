import React from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/EnchantedForest.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51373335905373, longitude: -80.35055374726653}}
        trailName={"Enchanted Forest"}
        trailDescription={"1.31km  -  35m\u2191 31m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"882128"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51386227272451, longitude: -80.35742313601077}}
        trailName={"Enchanted Forest"}
        trailDescription={"1.31km  -  35m\u2191 31m\u2193"}
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
