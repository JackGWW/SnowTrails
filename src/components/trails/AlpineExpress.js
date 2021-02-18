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
        location={{latitude: 44.51894162222743, longitude: -80.34792141057551}}
        trailName={"Alpine Express"}
        shape={"Diamond"}
        key={"834808"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51680038124323, longitude: -80.35061250440776}}
        trailName={"Alpine Express"}
        shape={"Square"}
        key={"164535"}
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
