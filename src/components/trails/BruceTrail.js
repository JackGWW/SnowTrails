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
        location={{latitude: 44.51246618293226, longitude: -80.35316219553351}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.522331012412906, longitude: -80.37698993459344}}
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
        location={{latitude: 44.51310262084007, longitude: -80.36579062230885}}
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
        location={{latitude: 44.51537939719856, longitude: -80.36508939228952}}
        trailName={"Bruce Trail"}
        shape={"Diamond"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51575297862291, longitude: -80.36431926302612}}
        trailName={"Bruce Trail"}
        shape={"Circle"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52007527463138, longitude: -80.36667801439762}}
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
        location={{latitude: 44.518202506005764, longitude: -80.37597899325192}}
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
