import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import trail from "../../../data/json/Hike1.json"
import CircleMarker from "./markers/CircleMarker"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.5227, longitude: -80.35 }}
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
