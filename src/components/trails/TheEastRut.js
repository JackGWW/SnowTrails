import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/TheEastRut.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="TheEastRut-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="TheEastRut-line"
          style={{
            lineColor: "#989898",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
