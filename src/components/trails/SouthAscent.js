import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/SouthAscent.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50960133224726, longitude: -80.33153696916997}}
        trailName={"South Ascent"}
        trailDescription={"1.33km  -  212m\u2191 5m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"692272"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.50843364931643, longitude: -80.33438748680055}}
        trailName={"South Ascent"}
        trailDescription={"1.33km  -  212m\u2191 5m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"748412"}
      />
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51220550574362, longitude: -80.3292023576796}}
        trailName={"South Ascent"}
        trailDescription={"1.33km  -  212m\u2191 5m\u2193"}
        icon={props.markerImages["Square"]}
        id={"193598"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "SouthAscent"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "SouthAscent"}`}
          style={{
            lineColor: "#212121",
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
