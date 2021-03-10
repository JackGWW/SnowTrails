import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/OverTheHill.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.521359633654356, longitude: -80.35730939358473}}
        trailName={"Over The Hill"}
        icon={props.markerImages["Diamond"]}
        id={"993037"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52064583078027, longitude: -80.36255847662687}}
        trailName={"Over The Hill"}
        icon={props.markerImages["Square"]}
        id={"846605"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#388E3C"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
