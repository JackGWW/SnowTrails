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
        location={{latitude: 44.51366881839931, longitude: -80.35057486966252}}
        trailName={"Enchanted Forest"}
        shape={"Circle"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5133447740227, longitude: -80.35672266036272}}
        trailName={"Enchanted Forest"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51455411501229, longitude: -80.35657404921949}}
        trailName={"Enchanted Forest"}
        shape={"Circle"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#FFEA00"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
