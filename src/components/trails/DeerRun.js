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
        location={{latitude: 44.51445487327874, longitude: -80.36384635604918}}
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
