import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/FeelingLazy.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.523445973172784, longitude: -80.35922013223171}}
        trailName={"Feeling Lazy"}
        shape={"Diamond"}
        key={"905893"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#FF9100"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
