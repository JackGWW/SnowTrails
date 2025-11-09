import React from "react";
import Mapbox from "@rnmapbox/maps";
import trail from "../../../data/json/AcrossCraigleith.json"

const ShowTrail = (props) => {
  return (
      <Mapbox.ShapeSource
        id="AcrossCraigleith-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="AcrossCraigleith-line"
          style={{
            lineColor: "#212121",
            lineWidth: 3,
            
          }}
        />
      </Mapbox.ShapeSource>

  );
};

export default ShowTrail;
