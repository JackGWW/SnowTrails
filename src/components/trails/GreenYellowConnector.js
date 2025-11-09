import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/GreenYellowConnector.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="GreenYellowConnector-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="GreenYellowConnector-line"
          style={{
            lineColor: "#989898",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
