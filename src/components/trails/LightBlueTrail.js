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
        id={`trail-source-${props.id || "LightBlueTrail"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "LightBlueTrail"}`}
          style={{
            lineColor: "#0CE1F1",
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
