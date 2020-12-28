import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import CircleMarker from "./markers/CircleMarker"
import trail from "../../../data/json/TheGlades.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.52713, longitude: -80.36438 }}
        trailName={"The Glades"}
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