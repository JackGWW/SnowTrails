import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "./../markers/Marker"
import trail from "../../../data/json/FarmRoad.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51190182939172, longitude: 44.51190182939172}}
        trailName={"Farm Road"}
        shape={"Circle"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"black"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
