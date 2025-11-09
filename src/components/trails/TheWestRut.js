import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/TheWestRut.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="TheWestRut-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="TheWestRut-line"
          style={{
            lineColor: "#989898",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
