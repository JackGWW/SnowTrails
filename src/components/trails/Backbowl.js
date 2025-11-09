import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/Backbowl.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525374146178365, longitude: -80.36739433184266}}
        trailName={"Backbowl"}
        trailDescription={"584m  -  45m\u2191 20m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"664296"}
      />

      <Mapbox.ShapeSource
        id="Backbowl-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="Backbowl-line"
          style={{
            lineColor: "#FF9100",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
