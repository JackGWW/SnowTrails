import React from "react";
import { Polyline } from "react-native-maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/BlueTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52741631306708, longitude: -80.39311160333455}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  239m\u2191 47m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"026747"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.53118355944753, longitude: -80.38515642285347}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  239m\u2191 47m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"340594"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5294254552573, longitude: -80.39206889458}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  239m\u2191 47m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"932271"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52388099394739, longitude: -80.38510722108185}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  239m\u2191 47m\u2193"}
        icon={props.markerImages["Square"]}
        id={"134466"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52502839267254, longitude: -80.38915425539017}}
        trailName={"Blue Trail"}
        trailDescription={"2.5km  -  239m\u2191 47m\u2193"}
        icon={props.markerImages["Square"]}
        id={"271763"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#2962FF"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
