import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/CrossCountrySkiTrail.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "CrossCountrySkiTrail"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "CrossCountrySkiTrail"}`}
          style={{
            lineColor: "#696969",
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
            lineDasharray: [3, 3],
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
