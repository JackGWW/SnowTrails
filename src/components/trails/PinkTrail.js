import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/PinkTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.5299572031945, longitude: -80.38175747729838}}
        trailName={"Pink Trail"}
        trailDescription={"429m  -  111m\u2191 1m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"410388"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "PinkTrail"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "PinkTrail"}`}
          style={{
            lineColor: "magenta",
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
