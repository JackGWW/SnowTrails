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
        location={{latitude: 44.51373335905373, longitude: -80.35055374726653}}
        trailName={"Enchanted Forest"}
        trailDescription={"1.31km  -  35m\u2191 31m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"882128"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5133447740227, longitude: -80.35672266036272}}
        trailName={"Enchanted Forest"}
        trailDescription={"1.31km  -  35m\u2191 31m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"634002"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.514601808041334, longitude: -80.35655158571899}}
        trailName={"Enchanted Forest"}
        trailDescription={"1.31km  -  35m\u2191 31m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"677655"}
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
