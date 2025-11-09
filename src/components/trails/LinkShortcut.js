import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/LinkShortcut.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="LinkShortcut-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="LinkShortcut-line"
          style={{
            lineColor: "#388E3C",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
