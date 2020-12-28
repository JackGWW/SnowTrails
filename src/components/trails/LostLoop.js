import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import CircleMarker from "./markers/CircleMarker"
import trail from "../../../data/json/LostLoop.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.52434, longitude: -80.36285 }}
        trailName={"Lost Loop"}
        ref={childRef}
      />
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.52662, longitude: -80.36922 }}
        trailName={"Lost Loop"}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"red"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
