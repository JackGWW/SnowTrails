import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/LostLoop.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.524339735507965, longitude: -80.36285025067627}}
        trailName={"Lost Loop"}
        shape={"Circle"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52674156986177, longitude: -80.36906501278281}}
        trailName={"Lost Loop"}
        shape={"Circle"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#D50000"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
