import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/DeerRun.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.514615973457694, longitude: -80.36411432549357}}
        trailName={"Deer Run"}
        shape={"Circle"}
        ref={childRef}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"magenta"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
