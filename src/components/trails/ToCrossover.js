import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/ToCrossover.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "ToCrossover"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "ToCrossover"}`}
          style={{
            lineColor: "#2962FF",
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
