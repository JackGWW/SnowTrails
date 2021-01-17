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
        location={{latitude: 44.51797074638307, longitude: -80.36381995305419}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51238177716732, longitude: -80.35320905037224}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52225314453244, longitude: -80.37697409279644}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51732969842851, longitude: -80.36766196601093}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51295509934425, longitude: -80.36590310744941}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51208262704313, longitude: -80.35794675350189}}
        trailName={"Bruce Trail"}
        shape={"Square"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51365230605006, longitude: -80.36034800112247}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51309658586979, longitude: -80.36267129704356}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51424138620496, longitude: -80.36598918959498}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51569841243327, longitude: -80.36428154446185}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51998617500067, longitude: -80.36669285036623}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5241323672235, longitude: -80.37579266354442}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.518146431073546, longitude: -80.37598452530801}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
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
