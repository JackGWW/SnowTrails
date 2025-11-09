import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Crossover.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52254072763026, longitude: -80.36524596624076}}
        trailName={"Crossover"}
        trailDescription={"1.11km  -  80m\u2191 31m\u2193"}
        icon={props.markerImages["Square"]}
        id={"610506"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52450175769627, longitude: -80.36655555479228}}
        trailName={"Crossover"}
        trailDescription={"1.11km  -  80m\u2191 31m\u2193"}
        icon={props.markerImages["Square"]}
        id={"096014"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#2962FF"}
      />
    </>
  );
};

export default ShowTrail;
