import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/Shortcut.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.522471660748124, longitude: -80.35474914126098}}
        trailName={"Shortcut"}
        shape={"Diamond"}
        key={"051286"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#FFEA00"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
