import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/PurpleTrail.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.525083964690566, longitude: -80.38657036609948}}
        trailName={"Purple Trail"}
        trailDescription={"419m  -  10m\u2191 21m\u2193"}
        icon={props.markerImages["Square"]}
        id={"140891"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "PurpleTrail"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "PurpleTrail"}`}
          style={{
            lineColor: "#9400D3",
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
