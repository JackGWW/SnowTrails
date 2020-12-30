import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "./../markers/Marker"
import trail from "../../../data/json/TheGlades.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52725521288812, longitude: 44.52725521288812}}
        trailName={"The Glades"}
        shape={"Circle"}
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
