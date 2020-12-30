import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "./../markers/Marker"
import trail from "../../../data/json/BlueBird.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52601636759937, longitude: 44.52601636759937}}
        trailName={"Blue Bird"}
        shape={"Circle"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"blue"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
