import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/ForestLane.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51316950842738, longitude: -80.35527175292373}}
        trailName={"Forest Lane"}
        trailDescription={"337m  -  3m\u2191 8m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"496346"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#212121"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
