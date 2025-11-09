import React from "react";
import TrailLine from "./TrailLine";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/TopTraverse.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.509754721075296, longitude: -80.34231634810567}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"703037"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50807213783264, longitude: -80.33747387118638}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"353734"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.511623214930296, longitude: -80.34623807296157}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"803127"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51373335905373, longitude: -80.35055374726653}}
        trailName={"Top Traverse"}
        trailDescription={"1.82km  -  41m\u2191 40m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"882128"}
      />

      <TrailLine
        trailPattern={props.trailPattern}
        coordinates={trail}
        color={"#212121"}
      />
    </>
  );
};

export default ShowTrail;
