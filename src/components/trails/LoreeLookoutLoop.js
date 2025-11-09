import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/LoreeLookoutLoop.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="LoreeLookoutLoop-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="LoreeLookoutLoop-line"
          style={{
            lineColor: "#388E3C",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
