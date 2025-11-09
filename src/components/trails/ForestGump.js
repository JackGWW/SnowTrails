import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/ForestGump.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51378314755857, longitude: -80.35327459685504}}
        trailName={"Forest Gump"}
        trailDescription={"324m  -  5m\u2191 8m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"296474"}
      />

      <Mapbox.ShapeSource
        id="ForestGump-source"
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id="ForestGump-line"
          style={{
            lineColor: "#212121",
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
