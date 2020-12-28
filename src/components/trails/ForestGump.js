import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import CircleMarker from "./markers/CircleMarker"
import trail from "../../../data/json/ForestGump.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51376, longitude: -80.35361 }}
        trailName={"Forest Gump"}
        ref={childRef}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"black"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
