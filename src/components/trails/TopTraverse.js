import React from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/TopTraverse.json"

const ShowTrail = (props) => {
  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.509754721075296, longitude: -80.34231634810567}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"703037"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50807213783264, longitude: -80.33747387118638}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"353734"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.511623214930296, longitude: -80.34623807296157}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"803127"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51373335905373, longitude: -80.35055374726653}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"882128"}
      />

      <Polyline
        lineDashPattern={props.trailPattern}
        coordinates={trail}
        strokeColor={"#212121"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
