import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/ToCrossover.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="ToCrossover-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="ToCrossover-line"
          style={{
            lineColor: "#2962FF",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
