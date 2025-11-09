import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/RidgeRun.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52047006227076, longitude: -80.35803811624646}}
        trailName={"Ridge Run"}
        trailDescription={"894m  -  138m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"539757"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "RidgeRun"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "RidgeRun"}`}
          style={{
            lineColor: "#2962FF",
            lineWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
};

export default ShowTrail;
