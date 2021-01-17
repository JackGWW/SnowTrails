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
        shape={"Square"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52450175769627, longitude: -80.36655555479228}}
        trailName={"Crossover"}
        shape={"Square"}
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
