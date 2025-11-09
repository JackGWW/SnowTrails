import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/ForestLane.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.51316950842738, longitude: -80.35527175292373}}
        trailName={"Forest Lane"}
        trailDescription={"338m  -  3m\u2191 8m\u2193"}
        icon={props.markerImages["Circle"]}
        id={"496346"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "ForestLane"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "ForestLane"}`}
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
