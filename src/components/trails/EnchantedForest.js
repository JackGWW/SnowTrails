import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import CircleMarker from "./markers/CircleMarker"
import trail from "../../../data/json/EnchantedForest.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51374, longitude: -80.35033 }}
        trailName={"Enchanted Forest"}
      />
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51455, longitude: -80.35657 }}
        trailName={"Enchanted Forest"}
        ref={childRef}
      />
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51337, longitude: -80.35663 }}
        trailName={"Enchanted Forest"}
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
