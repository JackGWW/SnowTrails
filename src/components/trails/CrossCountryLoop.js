import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/CrossCountryLoop.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="CrossCountryLoop-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="CrossCountryLoop-line"
          style={{
            lineColor: "#696969",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            lineDasharray: [3, 3],
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
