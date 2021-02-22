import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/Backstairs.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51643291860819, longitude: -80.3465835750103}}
        trailName={"Backstairs"}
        shape={"Diamond"}
        id={"640211"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.513524901121855, longitude: -80.34594789147377}}
        trailName={"Backstairs"}
        shape={"Square"}
        id={"351915"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5178415812552, longitude: -80.34474617801607}}
        trailName={"Backstairs"}
        shape={"Square"}
        id={"676087"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#212121"}
        strokeWidth={3}
        tappable={true}
        onPress={() => childRef.current.displayTrailName()}
      />
    </>
  );
};

export default ShowTrail;
