import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/ToSouth.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="ToSouth-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="ToSouth-line"
          style={{
            lineColor: "#212121",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
