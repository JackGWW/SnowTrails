import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/ToBench.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="ToBench-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="ToBench-line"
          style={{
            lineColor: "#212121",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
