import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/OrangeTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52782048843801, longitude: -80.38052584044635}}
        trailName={"Orange Trail"}
        trailDescription={"1.09km  -  190m\u2191 6m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"200834"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.53202359378338, longitude: -80.38064042106271}}
        trailName={"Orange Trail"}
        trailDescription={"1.09km  -  190m\u2191 6m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"727933"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#FF9100"}
      />
    </>
  );
};

export default ShowTrail;
