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
        location={{latitude: 44.5212743896991, longitude: -80.35712373442948}}
        trailName={"Over The Hill"}
        shape={"Diamond"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.520533261820674, longitude: -80.36257607862353}}
        trailName={"Over The Hill"}
        shape={"Square"}
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
