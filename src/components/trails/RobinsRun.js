import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import CircleMarker from "./markers/DiamondMarker"
import trail from "../../../data/json/RobinsRun.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51504, longitude: -80.35914 }}
        trailName={"Robin's Run"}
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
