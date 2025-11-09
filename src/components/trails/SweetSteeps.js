import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/SweetSteeps.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.52706309966743, longitude: -80.35891637206078}}
        trailName={"Sweet Steeps"}
        trailDescription={"1.02km  -  164m\u2191 18m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"393346"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "SweetSteeps"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "SweetSteeps"}`}
          style={{
            lineColor: "#FF9100",
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
