import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/ToSouth.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "ToSouth"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "ToSouth"}`}
          style={{
            lineColor: "#212121",
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
