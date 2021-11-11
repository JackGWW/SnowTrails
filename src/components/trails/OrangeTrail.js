import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/OrangeTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.526652470231056, longitude: -80.38026080466807}}
        trailName={"Orange Trail"}
        trailDescription={"1.12km  -  209m\u2191 12m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"443701"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.53092715702951, longitude: -80.38071577437222}}
        trailName={"Orange Trail"}
        trailDescription={"1.12km  -  209m\u2191 12m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"734271"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#FF9100"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
