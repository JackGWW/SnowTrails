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
        location={{latitude: 44.52131001278758, longitude: 44.52131001278758}}
        trailName={"Over The Hill"}
        shape={"Diamond"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"green"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
