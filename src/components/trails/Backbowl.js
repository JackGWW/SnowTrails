import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/Backbowl.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525292590260506, longitude: -80.36740304902196}}
        trailName={"Backbowl"}
        shape={"Circle"}
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
