import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/TheSpur.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="TheSpur-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="TheSpur-line"
          style={{
            lineColor: "#FF9100",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
