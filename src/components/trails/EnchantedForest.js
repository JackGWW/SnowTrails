import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/EnchantedForest.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.513737885281444, longitude: 44.513737885281444}}
        trailName={"Enchanted Forest"}
        shape={"Circle"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.513372434303164, longitude: 44.513372434303164}}
        trailName={"Enchanted Forest"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51455411501229, longitude: 44.51455411501229}}
        trailName={"Enchanted Forest"}
        shape={"Circle"}
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
