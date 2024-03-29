import React from "react";
import { Polyline } from "react-native-maps";
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

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#2962FF"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
