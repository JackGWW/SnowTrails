import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import DiamondMarker from "./markers/DiamondMarker"
import trail from "../../../data/json/SweetSteeps.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <DiamondMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.52706, longitude: -80.35892 }}
        trailName={"Sweet Steeps"}
        ref={childRef}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"orange"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};
export default ShowTrail;
