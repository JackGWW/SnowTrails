import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/BruceTrail.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51241974718869, longitude: 44.51241974718869}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51211950741708, longitude: 44.51211950741708}}
        trailName={"Bruce Trail"}
        shape={"Square"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51365230605006, longitude: 44.51365230605006}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51309658586979, longitude: 44.51309658586979}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51424138620496, longitude: 44.51424138620496}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51569841243327, longitude: 44.51569841243327}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51998617500067, longitude: 44.51998617500067}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52393145300448, longitude: 44.52393145300448}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
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
