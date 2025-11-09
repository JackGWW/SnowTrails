import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/ToSweetSteeps.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52884467318654, longitude: -80.3573933802545}}
        trailName={"To Sweet Steeps"}
        trailDescription={"224m  -  34m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"706797"}
      />

      <Mapbox.ShapeSource
        id="ToSweetSteeps-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="ToSweetSteeps-line"
          style={{
            lineColor: "#212121",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
