import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import DiamondMarker from "./markers/DiamondMarker"
import trail from "../../../data/json/Shortcut.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <DiamondMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.52249, longitude: -80.35468 }}
        trailName={"Shortcut"}
        ref={childRef}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"yellow"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;