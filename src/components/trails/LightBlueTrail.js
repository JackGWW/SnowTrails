import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/LightBlueTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52794009819627, longitude: -80.38185227662325}}
        trailName={"Light Blue Trail"}
        trailDescription={"525m  -  25m\u2191 31m\u2193"}
        icon={props.markerImages["Square"]}
        id={"842698"}
      />

      <Mapbox.ShapeSource
        id="LightBlueTrail-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="LightBlueTrail-line"
          style={{
            lineColor: "#0CE1F1",
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
