import React from "react";
import Mapbox from "@rnmapbox/maps";
import CustomMarker from "../markers/CustomMarker"
import trail from "../../../data/json/RobinsRun.json"

const ShowTrail = (props) => {
  return (
    <>
      <CustomMarker
        longitudeDelta={props.longitudeDelta}
        location={{latitude: 44.515025932341814, longitude: -80.35941417329013}}
        trailName={"Robin's Run"}
        trailDescription={"299m  -  0m\u2191 57m\u2193"}
        icon={props.markerImages["Diamond"]}
        id={"094832"}
      />

      <Mapbox.ShapeSource
        id={`trail-source-${props.id || "RobinsRun"}`}
        shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trail.map(coord => [coord.longitude, coord.latitude])
          }
        }}
      >
        <Mapbox.LineLayer
          id={`trail-line-${props.id || "RobinsRun"}`}
          style={{
            lineColor: "#FFEA00",
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
