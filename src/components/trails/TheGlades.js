import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/TheGlades.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.527416145429015, longitude: -80.36455605179071}}
        trailName={"The Glades"}
        trailDescription={"568m  -  39m\u2191 1m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"063617"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "TheGlades"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "TheGlades"}`}
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
