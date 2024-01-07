import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/TheSwitchback.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51870550401509, longitude: -80.34718765877187}}
        trailName={"The Switchback"}
        trailDescription={"988m  -  157m\u2191 10m\u2193"}
        icon={props.markerImages["Square"]}
        id={"756784"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5159228798002, longitude: -80.3507035318762}}
        trailName={"The Switchback"}
        trailDescription={"988m  -  157m\u2191 10m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"076006"}
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
