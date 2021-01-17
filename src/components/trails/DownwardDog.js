import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/DownwardDog.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51652134768665, longitude: -80.3622683789581}}
        trailName={"Downward Dog"}
        shape={"Diamond"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51629025861621, longitude: -80.36140428856015}}
        trailName={"Downward Dog"}
        shape={"Square"}
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
