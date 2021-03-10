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
        location={{latitude: 44.514505080878735, longitude: -80.36384174600244}}
        trailName={"Deer Run"}
        icon={props.markerImages["Circle"]}
        id={"651237"}
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
