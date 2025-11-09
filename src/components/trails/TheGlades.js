import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/TheGlades.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.527416145429015, longitude: -80.36455605179071}}
        trailName={"The Glades"}
        trailDescription={"568m  -  39m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"063617"}
      />

      <Mapbox.ShapeSource
        id="TheGlades-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="TheGlades-line"
          style={{
            lineColor: "#FF9100",
            lineWidth: ['interpolate', ['linear'], ['zoom'], 14, 2, 16, 3, 18, 5],
            lineCap: 'round',
            lineJoin: 'round',
            
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
