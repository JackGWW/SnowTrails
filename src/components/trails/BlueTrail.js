import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/BlueTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52741631306708, longitude: -80.39311160333455}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  235m\u2191 47m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"026747"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.53118355944753, longitude: -80.38515642285347}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  235m\u2191 47m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"340594"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5294254552573, longitude: -80.39206889458}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  235m\u2191 47m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"932271"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52388099394739, longitude: -80.38510722108185}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  235m\u2191 47m\u2193"}
        icon={props.markerImages["Square"]}
        id={"134466"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52502839267254, longitude: -80.38915425539017}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  235m\u2191 47m\u2193"}
        icon={props.markerImages["Square"]}
        id={"271763"}
      />

      <Polyline
        coordinates={trail}
        strokeColor={"#2962FF"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
