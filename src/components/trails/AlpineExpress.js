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
        location={{latitude: 44.51879929751158, longitude: -80.34798687323928}}
        trailName={"Alpine Express"}
        shape={"Diamond"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.516646321862936, longitude: -80.35063672810793}}
        trailName={"Alpine Express"}
        shape={"Square"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#388E3C"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
