import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/LoversLoop.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51754737645388, longitude: -80.34779367037117}}
        trailName={"Lover's Loop"}
        shape={"Diamond"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5157640427351, longitude: -80.34920107573271}}
        trailName={"Lover's Loop"}
        shape={"Square"}
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
