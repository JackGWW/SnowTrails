import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/BruceTrailLoop.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="BruceTrailLoop-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="BruceTrailLoop-line"
          style={{
            lineColor: "#212121",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
