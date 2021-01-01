import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/RidgeRun.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52039755880833, longitude: -80.35789436660707}}
        trailName={"Ridge Run"}
        shape={"Diamond"}
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
