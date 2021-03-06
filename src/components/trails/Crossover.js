import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/Crossover.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52254072763026, longitude: -80.36524596624076}}
        trailName={"Crossover"}
        icon={props.markerImages["Square"]}
        id={"610506"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52450175769627, longitude: -80.36655555479228}}
        trailName={"Crossover"}
        icon={props.markerImages["Square"]}
        id={"096014"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#2962FF"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
