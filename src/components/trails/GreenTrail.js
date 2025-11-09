import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/GreenTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52890686690807, longitude: -80.38758231326938}}
        trailName={"Green Trail"}
        trailDescription={"1.29km  -  168m\u2191 11m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"463613"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525645384564996, longitude: -80.38238016888499}}
        trailName={"Green Trail"}
        trailDescription={"1.29km  -  168m\u2191 11m\u2193"}
        icon={props.markerImages["Square"]}
        id={"478432"}
      />

      <Mapbox.ShapeSource
        id="GreenTrail-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="GreenTrail-line"
          style={{
            lineColor: "#388E3C",
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
