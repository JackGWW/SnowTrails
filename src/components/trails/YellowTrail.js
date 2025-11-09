import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/YellowTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.527279268950224, longitude: -80.38418881595135}}
        trailName={"Yellow Trail"}
        trailDescription={"1.32km  -  223m\u2191 32m\u2193"}
        icon={props.markerImages["Square"]}
        id={"700112"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.53043036162853, longitude: -80.38255736231804}}
        trailName={"Yellow Trail"}
        trailDescription={"1.32km  -  223m\u2191 32m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"068951"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.524569399654865, longitude: -80.38363678380847}}
        trailName={"Yellow Trail"}
        trailDescription={"1.32km  -  223m\u2191 32m\u2193"}
        icon={props.markerImages["Square"]}
        id={"153605"}
      />

      <Mapbox.ShapeSource
        id="YellowTrail-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="YellowTrail-line"
          style={{
            lineColor: "#FFEA00",
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
