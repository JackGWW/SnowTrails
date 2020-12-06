import React from "react";
import { Polyline, Marker } from "react-native-maps";
import trail from "../../../data/json/Hike1.json"

const ShowTrail = () => {
  return (
    <>
      <Marker
        coordinate={{ latitude: 44.5227, longitude: -80.35 }}
        image={require("../../../assets/trailMarkers/circle40.png")}
      />
      <Polyline
        coordinates={trail}
        strokeColor={"orange"}
        strokeWidth={3}
      />
    </>
  );
};

export default ShowTrail;
