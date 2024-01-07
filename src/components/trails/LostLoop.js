import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/LostLoop.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.524339735507965, longitude: -80.36285025067627}}
        trailName={"Lost Loop"}
        trailDescription={"1.49km  -  68m\u2191 24m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"516831"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52674156986177, longitude: -80.36906501278281}}
        trailName={"Lost Loop"}
        trailDescription={"1.49km  -  68m\u2191 24m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"292104"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#D50000"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
