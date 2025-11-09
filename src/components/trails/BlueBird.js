import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/BlueBird.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52601636759937, longitude: -80.36271957680583}}
        trailName={"Blue Bird"}
        trailDescription={"591m  -  26m\u2191 4m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"920646"}
      />

      <Mapbox.ShapeSource
        id="BlueBird-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="BlueBird-line"
          style={{
            lineColor: "#2962FF",
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
