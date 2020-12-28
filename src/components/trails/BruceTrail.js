import React, { useRef } from "react";
import { Polyline } from "react-native-maps";
import CircleMarker from "./markers/CircleMarker"
import SquareMarker from "./markers/SquareMarker"
import DiamondMarker from "./markers/DiamondMarker"
import trail from "../../../data/json/BruceTrail.json"


const ShowTrail = (props) => {
  const childRef = useRef();

  return (
    <>
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51242, longitude: -80.35317 }}
        trailName={"Bruce Trail"}
        ref={childRef}
      />
      <SquareMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51212, longitude: -80.35817 }}
        trailName={"Bruce Trail"}
        ref={childRef}
      /> 
      <DiamondMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51365, longitude: -80.36035 }}
        trailName={"Bruce Trail"}
        ref={childRef}
      />
      <DiamondMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51310, longitude: -80.36267 }}
        trailName={"Bruce Trail"}
        ref={childRef}
      />
      <DiamondMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51424, longitude: -80.36599 }}
        trailName={"Bruce Trail"}
        ref={childRef}
      />
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51570, longitude: -80.36428 }}
        trailName={"Bruce Trail"}
        ref={childRef}
      />
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.51999, longitude: -80.36669 }}
        trailName={"Bruce Trail"}
        ref={childRef}
      />
      <CircleMarker
        longitudeDelta={props.longitudeDelta}
        location={{ latitude: 44.52393, longitude: -80.37550 }}
        trailName={"Bruce Trail"}
        ref={childRef}
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
