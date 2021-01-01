import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/TheSwitchback.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51861271634698, longitude: -80.34715094603598}}
        trailName={"The Switchback"}
        shape={"Square"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51588725671172, longitude: -80.35075943917036}}
        trailName={"The Switchback"}
        shape={"Circle"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"yellow"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
