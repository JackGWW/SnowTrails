import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/NorthsideTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.523475812748075, longitude: -80.35000414587557}}
        trailName={"Northside Trail"}
        trailDescription={"1.27km  -  169m\u2191 20m\u2193"}
        icon={props.markerImages["Square"]}
        id={"331275"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52389775775373, longitude: -80.3563383501023}}
        trailName={"Northside Trail"}
        trailDescription={"1.27km  -  169m\u2191 20m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"348576"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#D50000"}
      />
    </>
  );
};

export default ShowTrail;
