import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import Marker from "../markers/Marker"
import trail from "../../../data/json/TopTraverse.json"

const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.509754721075296, longitude: -80.34231634810567}}
        trailName={"Top Traverse"}
        shape={"Circle"}
        id={"703037"}
        ref={childRef}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50807213783264, longitude: -80.33747387118638}}
        trailName={"Top Traverse"}
        shape={"Circle"}
        id={"353734"}
      />
      <Marker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.511623214930296, longitude: -80.34623807296157}}
        trailName={"Top Traverse"}
        shape={"Circle"}
        id={"803127"}
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
