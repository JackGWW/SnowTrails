import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/AlpineExpress.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.518874902278185, longitude: -80.34815233200788}}
        trailName={"Alpine Express"}
        shape={"Diamond"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51658203266561, longitude: -80.35090100951493}}
        trailName={"Alpine Express"}
        shape={"Square"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"green"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
