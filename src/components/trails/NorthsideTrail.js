import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/NorthsideTrail.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52344773337245, longitude: -80.35017136484385}}
        trailName={"Northside Trail"}
        shape={"Square"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52389775775373, longitude: -80.3563383501023}}
        trailName={"Northside Trail"}
        shape={"Circle"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"red"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
